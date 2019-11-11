import { CLICK_MENU, DRAG_TOOLITEM_START, SELECT_TOOLPANEL_TREE } from "../actions/index";

const defaultState = {
    activeMenu: 'designer',
    tabIndex: 1,
    // temp state only, until react-grid-layout fixes the bug for onDrop parameters
    draggingToolItem: null,
    toolPanelTreeSelected: null
}

const tabIndexMapping = {
  home: 0,
  designer: 1,
  settings: 2
}

export default function(state = defaultState, action) {
  console.log('[DEBUG] reducer_mainApp', action, state);
  switch (action.type) {
    case CLICK_MENU:
      return {
          activeMenu: action.payload,
          tabIndex: tabIndexMapping[action.payload]
      };
    case DRAG_TOOLITEM_START:
      return {
        ...state,
        draggingToolItem: action.payload
      }
  }
  return state;
}
