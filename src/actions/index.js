import masterData from '../api/masterData';

export const CLICK_MENU = "CLICK_MENU";
export const DRAG_TOOLITEM_START = "DRAG_TOOLITEM_START";
export const SELECT_TOOLPANEL_TREE = "SELECT_TOOLPANEL_TREE"
export const FETCH_HIERARCHY = "FETCH_HIERARCHY"
export const SELECT_CONTROL = "SELECT_CONTROL"
export const UPDATE_DESIGNER_LAYOUT = "UPDATE_DESIGNER_LAYOUT";
export const SAVE_DESIGNER_LAYOUT = "SAVE_DESIGNER_LAYOUT";
export const UPDATE_CONTROL_PROPS = "UPDATE_CONTROL_PROPS";

export function menuClicked(menuName) { 
    return {
      type: CLICK_MENU,
      payload: menuName
    };
}

export function toolItemDragged(toolName) { 
  return {
    type: DRAG_TOOLITEM_START,
    payload: toolName
  };
}

export function selectToolPanelTree(hierarchyId) {
  return {
    type: SELECT_TOOLPANEL_TREE,
    payload: hierarchyId
  };
}


export const fetchHierarchy = () => async dispatch => { 
  console.log('[action]fetchHierarchy');
  const response = await masterData.get('hierarchy')

  dispatch({
    type: FETCH_HIERARCHY,
    payload: response
  });
}

export const selectedControl = (controlId) => {
  return {
    type: SELECT_CONTROL,
    payload: controlId
  }
}

// For UI update only, not yet persisted to the storage like DB or browser storage
// Assumption is that validations have been performed on the updated controls
export const updateLayout = (updatedControls) => {
  return {
    type: UPDATE_DESIGNER_LAYOUT,
    payload: updatedControls
  }
}

// Save the layout to persistent storage like database or web local storage
export const saveLayout = (layout) => {
  return {
    type: SAVE_DESIGNER_LAYOUT,
    payload: layout
  }
}

export const updateControlProps = (newControlData) => {
  return {
    type: UPDATE_CONTROL_PROPS,
    payload: newControlData
  }
}