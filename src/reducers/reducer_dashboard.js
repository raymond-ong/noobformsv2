import {SELECT_DASHBOARD_TREE, FETCH_HIERARCHYVIEWS} from '../actions';

// This is the reducer of the dashboard content
const defaultState = {
    selectedNode: null
}

export default function(state=defaultState, action) {
    switch (action.type) {
        case SELECT_DASHBOARD_TREE:
            return {
                ...state,
                selectedNode: action.payload
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
    }

    return state;
}