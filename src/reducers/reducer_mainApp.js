import { CLICK_MENU, DRAG_TOOLITEM_START, SELECT_TOOLPANEL_TREE, FETCH_HIERARCHY, FETCH_AVAILABLEDATA } from "../actions/index";

const defaultState = {
    activeMenu: 'formsDesigner',
    tabIndex: 1,
    // temp state only, until react-grid-layout fixes the bug for onDrop parameters
    draggingToolItem: null,
    toolPanelTreeSelected: null,
    masterHierarchy: null,
    masterAvailableData: null
}

const tabIndexMapping = {
  home: 0,
  formsDesigner: 1,
  dashboardDesigner: 2,
  hierarchyDesigner: 3,
  settings: 4
}

export default function(state = defaultState, action) {
  if (action.type in [CLICK_MENU, DRAG_TOOLITEM_START, SELECT_TOOLPANEL_TREE, FETCH_HIERARCHY, FETCH_AVAILABLEDATA]) {
    console.log('[DEBUG] reducer_mainApp', action, state);
  }
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
    case FETCH_AVAILABLEDATA:
      return {
        ...state,
        masterAvailableData: action.payload.data
      }
  }
  return state;
}
