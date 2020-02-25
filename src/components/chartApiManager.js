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
        
        let stackInfo = controlFilterInfo[longestStack];
        if (!stackInfo) {
            continue;
        }

        let sliceInfo = stackInfo.sliceInfo;
        for (let prop in sliceInfo.origObj) {
            retList.push({
                Name: prop,
                Value: sliceInfo.origObj[prop]
            });
        }

        let seriesInfo = stackInfo.seriesInfo;
        if (!seriesInfo) {
            continue;
        }

        for (let prop in seriesInfo) {
            retList.push({
                Name: prop,
                Value: seriesInfo[prop]
            });
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
    let currGroupingStr = JSON.stringify(currGroupingsArr.groupStack);
    for (let currCtrlId in datasetFilters) {
        if (currCtrlId !== controlId) {
            continue;
        }
        let controlFilterInfo = datasetFilters[currCtrlId];     
        for (let stack in controlFilterInfo) {
            if (stack.length >= currGroupingStr.length) {
                continue;
            }

            let stackInfo = controlFilterInfo[stack];
            if (!stackInfo) {
                continue;
            }

            let sliceInfo = stackInfo.sliceInfo;
            for (let prop in sliceInfo.origObj) {
                retList.push({
                    Name: prop,
                    Value: sliceInfo.origObj[prop]
                });
            }
    
            let seriesInfo = stackInfo.seriesInfo;
            if (!seriesInfo) {
                continue;
            }
    
            for (let prop in seriesInfo) {
                retList.push({
                    Name: prop,
                    Value: seriesInfo[prop]
                });
            }
        }                
    }
    // TODO: There can be duplicates if there are 3 levels of grouping
    // Should remove duplicates

    return retList;
}

// This class is responsible for making API calls to get data, or handling click or grouping events
export const fetchData = async (controlData, setIsLoading, setApiData, datasetFilters, currControlGrouping, metadata) => {
    console.log('[DEBUG] fetchData ReportControl', controlData.i);
    
    setIsLoading(true);
    let postObj = {...controlData.data.dataProps}; // make a new copy
    if (!!currControlGrouping) {
        postObj.Groupings = [...currControlGrouping.groupStack];
        // if (currControlGrouping.seriesName) {
        //     postObj.Groupings.push(currControlGrouping.seriesName);
        // }
    }
    else {
        // categories is a string value
        postObj.Groupings = [controlData.data.dataProps.categories];
    }

    if (controlData.data.dataProps.seriesName) {
        postObj.Groupings.push(controlData.data.dataProps.seriesName);
    }

    if (!Array.isArray(postObj.RequestParams)) {
        postObj.RequestParams = [];
    }

    if (datasetFilters) {
        // Send a filter that excludes current control's filters
        let otherControlFilters = getOtherControlFilters(controlData.i, datasetFilters);
        debugger
        let ownHigherLevelFilters = getOwnControlHigherLevelFilters(controlData.i, datasetFilters, currControlGrouping ? currControlGrouping : null);
        postObj.RequestParams = postObj.RequestParams.concat(otherControlFilters);
        postObj.RequestParams = postObj.RequestParams.concat(ownHigherLevelFilters);
        // TODO: if in the final request params, if there are properties that overlap with the current group's own current filter, REMOVE it. 
        // It will look weird to see a pie chart with just one wedge. Show also the other inactive slices.
        // Ideally, the groupings of each control should not overlap. This will only happen if there are overlaps.
    }

    const result = await axios
        .post(metadata.server, postObj)
        .catch(error => {
            console.error("Error fetching control data", controlData.i, error);

        });

    if (result && result.data) {
        setApiData(result.data);
    }
    setIsLoading(false);
};