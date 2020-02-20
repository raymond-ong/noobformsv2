import axios from 'axios';

// Like crossfilter concept, we filter other control's filters only.
// Do not include current control's filters because we still need to show the other slices but grayed out.
const getOtherControlFilters = (controlId, datasetFilters, groupingsArr) => {
    let retList = [];
    let currGroupingStr = JSON.stringify(groupingsArr);
    debugger
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
    }

    return retList;
}

const getOwnControlHigherLevelFilters = (controlId, datasetFilters, groupingsArr) => {
    let retList = [];
    let currGroupingStr = JSON.stringify(groupingsArr);
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
        postObj.Groupings = currControlGrouping;
    }
    if (datasetFilters) {
        // Send a filter that excludes current control's filters
        if (!Array.isArray(postObj.RequestParams)) {
            postObj.RequestParams = [];
        }
        let otherControlFilters = getOtherControlFilters(controlData.i, datasetFilters, postObj.Groupings);
        let ownHigherLevelFilters = getOwnControlHigherLevelFilters(controlData.i, datasetFilters, postObj.Groupings);
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