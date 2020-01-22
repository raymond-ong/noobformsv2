import { CLICK_MENU, 
  DRAG_TOOLITEM_START, 
  SELECT_TOOLPANEL_TREE, 
  FETCH_HIERARCHY, 
  FETCH_HIERARCHYVIEWS,
  FETCH_AVAILABLEDATA, 
  FETCH_SAVEDLAYOUTS,
  SAVE_DESIGNER_LAYOUT } from "../actions/index";

// Assumpation: All these data is for 1 tenant only
const defaultState = {
    activeMenu: 'formsDesigner',
    tabIndex: 1,
    // temp state only, until react-grid-layout fixes the bug for onDrop parameters
    draggingToolItem: null,
    toolPanelTreeSelected: null,
    masterHierarchy: null,
    masterAvailableData: null,
    masterLayouts: null,
    masterHierarchyViews: null,
    masterHierarchySettings: null, // All the hierarchy settings set by the user using the Hierarchy Designer
}

const tabIndexMapping = {
  home: 0,
  formsDesigner: 1,
  dashboardDesigner: 2,
  hierarchyDesigner: 3,
  settings: 4
}

export default function(state = defaultState, action) {
  if ([CLICK_MENU, DRAG_TOOLITEM_START, SELECT_TOOLPANEL_TREE, FETCH_HIERARCHY, FETCH_AVAILABLEDATA, SAVE_DESIGNER_LAYOUT, FETCH_HIERARCHYVIEWS].includes(action.type)) {
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
    case FETCH_SAVEDLAYOUTS:
      return {
        ...state,
        masterLayouts: action.payload.data
      }
    case SAVE_DESIGNER_LAYOUT:
      let newLayout = action.payload.response.data;
      return {
        ...state,
        masterLayouts: [...state.masterLayouts, newLayout]
      }
    case FETCH_HIERARCHYVIEWS:
      return {
        ...state,
        masterHierarchyViews: action.payload.data
      }

  }
  return state;
}
