import masterData from '../api/masterData';

export const CLICK_MENU = "CLICK_MENU";
export const DRAG_TOOLITEM_START = "DRAG_TOOLITEM_START";
export const SELECT_TOOLPANEL_TREE = "SELECT_TOOLPANEL_TREE"
export const SELECT_HIER_DESIGNER_TREE = "SELECT_HIER_DESIGNER_TREE"
export const UPDATE_HIER_DESIGNER_TREE = "UPDATE_HIER_DESIGNER_TREE"
export const INSERT_HIER_DESIGNER_TREE = "INSERT_HIER_DESIGNER_TREE"
export const FILTER_HIER_DESIGNER_TREE = "FILTER_HIER_DESIGNER_TREE"
export const FETCH_HIERARCHY = "FETCH_HIERARCHY"
export const FETCH_AVAILABLEDATA = "FETCH_AVAILABLEDATA"
export const SELECT_CONTROL = "SELECT_CONTROL"
export const UPDATE_DESIGNER_LAYOUT = "UPDATE_DESIGNER_LAYOUT";
export const SAVE_DESIGNER_LAYOUT = "SAVE_DESIGNER_LAYOUT";
export const UPDATE_CONTROL_PROPS = "UPDATE_CONTROL_PROPS";
export const DELETE_CONTROL = "DELETE_CONTROL";
export const SAVE_HIER_DESIGN_NODE = "SAVE_HIER_DESIGN_NODE";

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

export function selectToolPanelTree(hierarchyNode) {
  return {
    type: SELECT_TOOLPANEL_TREE,
    payload: {
      ...hierarchyNode
    }
  };
}

export function selectHierDesignerTree(hierarchyNode) {
  return {
    type: SELECT_HIER_DESIGNER_TREE,
    payload: {
      ...hierarchyNode
    }
  };
}

export function updateHierDesignerTree(hierarchyArr) {
  return {
    type: UPDATE_HIER_DESIGNER_TREE,
    payload: hierarchyArr
  }
}

// Not used anymore
export function filterHierDesignerTree(filter) {
  return {
    type: FILTER_HIER_DESIGNER_TREE,
    payload: filter
  }
}


export function insertNewNode() {
  // No payload since the reducer knows who is the selected node
  return {
    type: INSERT_HIER_DESIGNER_TREE
  }
}

export function saveNodeConfig(nodeInfo) {
  return {
    type: SAVE_HIER_DESIGN_NODE,
    payload: nodeInfo
  }
}

export const fetchHierarchy = () => async dispatch => { 
  console.log('[action] fetchHierarchy');
  const response = await masterData.get('hierarchy')

  dispatch({
    type: FETCH_HIERARCHY,
    payload: response
  });
}

export const fetchAvailableData = () => async dispatch => { 
  console.log('[action] fetchAvailableData');
  const response = await masterData.get('availabledata')

  dispatch({
    type: FETCH_AVAILABLEDATA,
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

export const deleteControl = (controlData) => {
  return {
    type: DELETE_CONTROL,
    payload: controlData
  }
}