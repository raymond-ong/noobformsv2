import {SELECT_DASHBOARD_TREE, FETCH_HIERARCHYVIEWS, CLICK_CHART_SLICE, SELECT_CHART_GROUP} from '../actions';

// This is the reducer of the dashboard content
const defaultState = {
    selectedNode: null,
    // structure:
    // {
    //     <datasetId1>: {
    //             <controlId1>: {groupingStackStr1: sliceInfo, groupingStackStr2: sliceInfo }
    //             <controlId2>: {groupingStackStr1: sliceInfo, groupingStackStr2: sliceInfo }
    //         },
    // }
    chartClickFilters: {},   // DatasetId vs list of filters. Should clear this when new node is selected
    chartTempGroupings: {}, // controlId vs new groupings...default groupings won't come here

}

const processChartClick = (filtersRoot, actionPayload) => {
    let {sliceInfo, groupingStackStr, datasetId, controlId} = actionPayload;
    if (!filtersRoot[datasetId]) {
        filtersRoot[datasetId] = {};
    }
    let datasetFilters = filtersRoot[datasetId];
    let controlFilters = datasetFilters[controlId];
    if (!controlFilters) {
        controlFilters = {};
        datasetFilters[controlId] = controlFilters;
    }
    controlFilters[groupingStackStr] = sliceInfo;

    filtersRoot[datasetId] = {...datasetFilters}; // to force re-render (expectation: only controls belonging to this datasetId)
}

const processChartGroups = (groupings, actionPayload) => {
    // Just replace the grouping for the controlId directly
    let {controlData, seriesName, groupVal} = actionPayload;
    //groupings[controlData.i] = groupVal;
    groupings[controlData.i] = {
        groupStack: groupVal,
        seriesName
    };
}

// actionPayload is same as the payload in processChartGroups
// chartClickFilters is the state's old chartClickFilters
// if there are updates, return the new chartClickFilters; otherwise return null
const removeLowerLevelFilters = (actionPayload, filtersRoot) => {
    let {controlData, groupVal} = actionPayload;
    let groupValStr = JSON.stringify(groupVal);
    // find filter for this Id
    if (!controlData || !controlData.i || !controlData.dataProps) {
        return null; // sanity check only
    }

    let datasetFilters = filtersRoot[controlData.dataProps.datasetId];
    if (!datasetFilters) {
        return null;
    }
    let controlFilters = datasetFilters[controlData.i];
    if (!controlFilters) {
        return null;
    }

    let groupsToRemove = Object.keys(controlFilters).filter(x => x.length > groupValStr.length);
    if (groupsToRemove.length > 0) {        
        groupsToRemove.forEach(g => {
            delete controlFilters[g];
        })

        filtersRoot[controlData.dataProps.datasetId] = {...datasetFilters}; // to force re-render (expectation: only controls belonging to this datasetId)

        return filtersRoot;
    }

    return null;
}

export default function(state=defaultState, action) {
    switch (action.type) {
        case SELECT_DASHBOARD_TREE:
            return {
                ...state,
                selectedNode: action.payload,
                chartClickFilters: {},   // reset when a new node is clicked      
                chartTempGroupings: {}   
            };
        case FETCH_HIERARCHYVIEWS:
            // Auto select the first node from the the first view
            let defaultView = action.payload.data && action.payload.data[0];
            if (!defaultView) {
                return state;
            }
            let treeData = JSON.parse(defaultView.hierarchyJson);
            let firstNode = treeData && treeData[0];

            return {
                ...state,
                selectedNode: firstNode
            };

        case CLICK_CHART_SLICE:
            let newFilters = {...state.chartClickFilters};
            processChartClick(newFilters, action.payload);
            // We can override the filter previously set by the same control (UI will not allow setting more than 1 different filter for the same control)
            
            return {
                ...state,
                chartClickFilters: newFilters
            };

        case SELECT_CHART_GROUP:
            // we need to adjust the filters also
            // if prev group is @child level, and there is a filter @child level
            // then the new group is @parent level, we need to remove the filter @child level

            let newFilter = removeLowerLevelFilters(action.payload, {...state.chartClickFilters});            

            let newGroupings = {...state.chartTempGroupings};
            processChartGroups(newGroupings, action.payload);
            return {
                ...state,
                chartTempGroupings: newGroupings,
                chartClickFilters: newFilter ? newFilter : state.chartClickFilters
            };
    }

    return state;
}