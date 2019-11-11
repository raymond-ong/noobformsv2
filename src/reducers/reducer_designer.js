import { SELECT_TOOLPANEL_TREE } from "../actions/index";

const defaultState = {
    toolPanelTreeSelected: null
}


export default function(state = defaultState, action) {
  console.log('[DEBUG] reducer_designer', action, state);
  switch (action.type) {
    case SELECT_TOOLPANEL_TREE:
      return {
        ...state,
        toolPanelTreeSelected: action.payload
      };
  }
  return state;
}
