import {SELECT_DASHBOARD_TREE, FETCH_HIERARCHYVIEWS, CLICK_CHART_SLICE} from '../actions';

// This is the reducer of the dashboard content
const defaultState = {
    selectedNode: null,
    // structure:
    // {
    //     <datasetId1>: {
    //             <controlId1>: sliceInfo
    //             <controlId2>: sliceInfo
    //         },
    // }
    chartClickFilters: {},   // DatasetId vs list of filters. Should clear this when new node is selected

}

const processChartClick = (filtersRoot, actionPayload) => {
    let {sliceInfo, datasetId, controlId} = actionPayload;
    if (!filtersRoot[datasetId]) {
        filtersRoot[datasetId] = {};
    }
    let datasetFilters = filtersRoot[datasetId];
    datasetFilters[controlId] = sliceInfo;
    filtersRoot[datasetId] = {...datasetFilters}; // to force re-render
}

export default function(state=defaultState, action) {
    switch (action.type) {
        case SELECT_DASHBOARD_TREE:
            return {
                ...state,
                selectedNode: action.payload,
                chartClickFilters: {},   // reset when a new node is clicked         
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
    }

    return state;
}