import { CLICK_MENU, DRAG_TOOLITEM_START, SELECT_TOOLPANEL_TREE, FETCH_HIERARCHY } from "../actions/index";

const defaultState = {
    activeMenu: 'dashboardDesigner',
    tabIndex: 2,
    // temp state only, until react-grid-layout fixes the bug for onDrop parameters
    draggingToolItem: null,
    toolPanelTreeSelected: null,
    masterHierarchy:null
}

const tabIndexMapping = {
  home: 0,
  formsDesigner: 1,
  dashboardDesigner: 2,
  hierarchyDesigner: 3,
  settings: 4
}

export default function(state = defaultState, action) {
  console.log('[DEBUG] reducer_mainApp', action, state);
  switch (action.type) {
    case CLICK_MENU:
      return {
          ...state,
          activeMenu: action.payload,
          tabIndex: tabIndexMapping[action.payload]
      };
    case DRAG_TOOLITEM_START:
      return {
        ...state,
        draggingToolItem: action.payload
      }
    case FETCH_HIERARCHY:
      return {
        ...state,
        masterHierarchy: action.payload.data
      }
  }
  return state;
}
