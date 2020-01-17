import {SELECT_DASHBOARD_TREE} from '../actions';

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
    }

    return state;
}