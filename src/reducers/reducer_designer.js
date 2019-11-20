import { SELECT_TOOLPANEL_TREE, SELECT_CONTROL, UPDATE_DESIGNER_LAYOUT } from "../actions/index";

const defaultState = {
    toolPanelTreeSelected: null,
    selectedControlId: null,
    layout: [],
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
    case UPDATE_DESIGNER_LAYOUT:
        return {
          ...state,
          layout: action.payload
        };
  }
  return state;
}
