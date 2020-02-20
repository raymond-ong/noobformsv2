import axios from 'axios';

// Like crossfilter concept, we filter other control's filters only.
// Do not include current control's filters because we still need to show the other slices but grayed out.
const getOtherControlFilters = (controlId, datasetFilters) => {
    let retList = [];
    for (let currCtrlId in datasetFilters) {
        if (currCtrlId === controlId) {
            continue;
        }
        let sliceInfo = datasetFilters[currCtrlId];       

        for (let prop in sliceInfo.origObj) {
            retList.push({
                Name: prop,
                Value: sliceInfo.origObj[prop]
            });
        }
        
    }

    return retList;
}

// This class is responsible for making API calls to get data, or handling click or grouping events
export const fetchData = async (controlData, setIsLoading, setApiData, datasetFilters, controlGroups) => {
    console.log('[DEBUG] fetchData ReportControl', controlData.i);
    setIsLoading(true);
    let postObj = {...controlData.dataProps}; // make a new copy
    if (!!controlGroups) {
        debugger
        postObj.Groupings = controlGroups;
    }
    if (datasetFilters) {
        // Send a filter that excludes current control's filters
        if (!Array.isArray(postObj.RequestParams)) {
            postObj.RequestParams = [];
        }
        let otherControlFilters = getOtherControlFilters(controlData.i, datasetFilters);
        postObj.RequestParams = postObj.RequestParams.concat(otherControlFilters);
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

// export const handleChartClick = (sliceInfo) => {
//     debugger
// }