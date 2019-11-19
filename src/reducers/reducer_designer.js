import { SELECT_TOOLPANEL_TREE, SELECT_CONTROL } from "../actions/index";

const defaultState = {
    toolPanelTreeSelected: null,
    selectedControlId: null
}


export default function(state = defaultState, action) {
  console.log('[DEBUG] reducer_designer', action, state);
  switch (action.type) {
    case SELECT_TOOLPANEL_TREE:
      return {
        ...state,
        toolPanelTreeSelected: action.payload
      };
    case SELECT_CONTROL:
      return {
        ...state,
        selectedControlId: action.payload
      };
  }
  return state;
}
