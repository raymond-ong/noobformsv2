import axios from 'axios';

// Like crossfilter concept, we filter other control's filters only.
// Do not include current control's filters because we still need to show the other slices but grayed out.
export const getOtherControlFilters = (controlId, datasetFilters, includeCarryOver=false) => {
    let retList = [];
    for (let currCtrlId in datasetFilters) {
        if (currCtrlId === controlId) {
            continue;
        }
        let controlFilterInfo = datasetFilters[currCtrlId];

        // Just take the slice info of the deepest stack
        let stacks = Object.keys(controlFilterInfo);
        let longestStack = stacks.reduce((r, e) => r.length < e.length ? e : r, "");
        
        let sliceInfo = controlFilterInfo[longestStack];
        if (!sliceInfo) {
            continue;
        }

        for (let prop in sliceInfo.origObj) {
            retList.push({
                Name: prop,
                Value: sliceInfo.origObj[prop]
            });
        }

        if (includeCarryOver) {
            for (let prop in sliceInfo.carryOverFilters) {
                retList.push({
                    Name: prop,
                    Value: sliceInfo.carryOverFilters[prop]
                });
            }    
        }
    }

    return retList;
}

// purpose: if from parent level, a filter has been made, then user drills down to child level,
// the parent filter must still be applied
// currGroupingsArr: can be null if user never changed the grouping level 
//
const getOwnControlHigherLevelFilters = (controlId, datasetFilters, currGroupingsArr) => {
    let retList = [];
    if (!currGroupingsArr) {
        return retList;
    }
    let currGroupingStr = JSON.stringify(currGroupingsArr);
    for (let currCtrlId in datasetFilters) {
        if (currCtrlId !== controlId) {
            continue;
        }
        let controlFilterInfo = datasetFilters[currCtrlId];     
        for (let stack in controlFilterInfo) {
            if (stack.length >= currGroupingStr.length) {
                continue;
            }

            let sliceInfo = controlFilterInfo[stack];
            if (!sliceInfo) {
                continue;
            }

            for (let prop in sliceInfo.origObj) {
                retList.push({
                    Name: prop,
                    Value: sliceInfo.origObj[prop]
                });
            }       
        }                
    }
    // TODO: There can be duplicates if there are 3 levels of grouping
    // Should remove duplicates

    return retList;
}

// This class is responsible for making API calls to get data, or handling click or grouping events
export const fetchData = async (controlData, setIsLoading, setApiData, datasetFilters, currControlGrouping) => {
    console.log('[DEBUG] fetchData ReportControl', controlData.i);
    setIsLoading(true);
    let postObj = {...controlData.dataProps}; // make a new copy
    if (!!currControlGrouping) {
        // Groupings already has a default value. Override it if the user selects another grouping
        postObj.Groupings = [...currControlGrouping.groupStack];
        if (currControlGrouping.seriesName) {
            postObj.Groupings.push(currControlGrouping.seriesName);
        }
    }
    if (datasetFilters) {
        // Send a filter that excludes current control's filters
        if (!Array.isArray(postObj.RequestParams)) {
            postObj.RequestParams = [];
        }
        let otherControlFilters = getOtherControlFilters(controlData.i, datasetFilters);
        let ownHigherLevelFilters = getOwnControlHigherLevelFilters(controlData.i, datasetFilters, currControlGrouping ? currControlGrouping.groupStack : null);
        postObj.RequestParams = postObj.RequestParams.concat(otherControlFilters);
        postObj.RequestParams = postObj.RequestParams.concat(ownHigherLevelFilters);
    }

    const result = await axios
        .post(controlData.dataProps.dataUrl, postObj)
        .catch(error => {
            console.error("Error fetching control data", controlData.i, error);

        });

    if (result && result.data) {
        setApiData(result.data);
    }
    setIsLoading(false);
};