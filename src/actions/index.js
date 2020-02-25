import masterData from '../api/masterData';
import _ from 'lodash';
import {sanitizeTreeData} from '../helper/treefilter';

export const CLICK_MENU = "CLICK_MENU";
export const DRAG_TOOLITEM_START = "DRAG_TOOLITEM_START";
export const SELECT_TOOLPANEL_TREE = "SELECT_TOOLPANEL_TREE"
export const SELECT_HIER_DESIGNER_TREE = "SELECT_HIER_DESIGNER_TREE"
export const UPDATE_HIER_DESIGNER_TREE = "UPDATE_HIER_DESIGNER_TREE"
export const INSERT_HIER_DESIGNER_TREE = "INSERT_HIER_DESIGNER_TREE"
export const FILTER_HIER_DESIGNER_TREE = "FILTER_HIER_DESIGNER_TREE"
export const FETCH_HIERARCHY = "FETCH_HIERARCHY"
export const FETCH_HIERARCHYCONSO = "FETCH_HIERARCHYCONSO"
export const FETCH_AVAILABLEDATA = "FETCH_AVAILABLEDATA"
export const FETCH_SAVEDLAYOUTS = "FETCH_SAVEDLAYOUTS"
export const FETCH_HIERARCHYVIEWS = "FETCH_HIERARCHYVIEWS"
export const FETCH_DIMENSIONS = "FETCH_DIMENSIONS"
export const FETCH_HIERARCHYKPI = "FETCH_HIERARCHYKPI"
export const SELECT_CONTROL = "SELECT_CONTROL"
export const UPDATE_DESIGNER_LAYOUT = "UPDATE_DESIGNER_LAYOUT";
export const OPEN_LAYOUT = "OPEN_LAYOUT";
export const SAVE_DESIGNER_LAYOUT = "SAVE_DESIGNER_LAYOUT";
export const UPDATE_CONTROL_PROPS = "UPDATE_CONTROL_PROPS";
export const DELETE_CONTROL = "DELETE_CONTROL";
export const SAVE_HIER_DESIGN_NODE = "SAVE_HIER_DESIGN_NODE";
export const SAVE_HIERARCHYVIEW = "SAVE_HIERARCHYVIEW";
export const SELECT_DASHBOARD_TREE = "SELECT_DASHBOARD_TREE";
export const CLICK_CHART_SLICE = "CLICK_CHART_SLICE";
export const SELECT_CHART_GROUP = "SELECT_CHART_GROUP";

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

// Actually, this is just "Apply" to local state
// This does not persist to the database yet
export function saveNodeConfig(nodeInfo) {
  return {
    type: SAVE_HIER_DESIGN_NODE,
    payload: nodeInfo
  }
}

export const fetchHierarchy = () => async dispatch => { 
  console.log('[action] fetchHierarchy');
  let response = await masterData.get('hierarchy');

  dispatch({
    type: FETCH_HIERARCHY,
    payload: response
  });

  return true;
}

// Get the consolidated hierarchy from various collection dates
export const fetchHierarchyConso = () => async dispatch => { 
  console.log('[action] fetchHierarchyConso');
  let response = await masterData.get('hierarchy/conso');

  dispatch({
    type: FETCH_HIERARCHYCONSO,
    payload: response
  });

  return true;
}

export const fetchSavedLayouts = () => async dispatch => { 
  console.log('[action] fetchSavedLayouts');
  const response = await masterData.get('layout')

  dispatch({
    type: FETCH_SAVEDLAYOUTS,
    payload: response
  });
}

export const fetchHierarchyViews = () => async dispatch => { 
  console.log('[action] fetchHierarchyViews');
  const response = await masterData.get('hierarchyviews')

  dispatch({
    type: FETCH_HIERARCHYVIEWS,
    payload: response
  });
}

export const fetchDimensions = () => async dispatch => { 
  console.log('[action] fetchDimensions');
  const response = await masterData.get('dimensions')

  dispatch({
    type: FETCH_DIMENSIONS,
    payload: response
  });
}

export const fetchHierarchyKpi = () => async dispatch => { 
  console.log('[action] fetchHierarchyKpi');
  const response = await masterData.get('HierarchyKpi')

  dispatch({
    type: FETCH_HIERARCHYKPI,
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

export const openLayout = (controls, layoutData) => {
  return {
    type: OPEN_LAYOUT,
    payload: {
      controls,
      layoutData
    }
  };
}

// Save the layout to persistent storage like database or web local storage
// TODO: Warn user, or inform user about replacing file, if that name already exists
export const saveLayout = (layout, name, layoutData) => async dispatch => { 
  console.log('[action] saveLayout');

  let response = null;
  try {
    response = await masterData.post('layout', {
      name,
      layoutJson: JSON.stringify(layout),
      numRows: layoutData.rows,
      numCols: layoutData.columns
    });  
  }
  catch(err) {
    return err;
  }

  dispatch({
    type: SAVE_DESIGNER_LAYOUT,
    payload: {layout, name, response}
  });

  return true;
}

// Save the layout to persistent storage like database or web local storage
// TODO: Warn user, or inform user about replacing file, if that name already exists
export const saveHierarchyView = (hierarchyData, userSettings) => async dispatch => { 
  console.log('[action] saveHierarchyView');

  let response = null;  
  let formattedHierarchyData = sanitizeTreeData(hierarchyData);
  try {
    response = await masterData.post('hierarchyviews', {
      hierarchyJson: JSON.stringify(formattedHierarchyData),
      nodeSettingsJson: JSON.stringify(userSettings),
    });  
  }
  catch(err) {
    return err;
  }

  dispatch({
    type: SAVE_HIERARCHYVIEW,
    payload: {hierarchyData, userSettings}
  });

  return true;
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

export function selectDashboardTree(hierarchyNode) {
  return {
    type: SELECT_DASHBOARD_TREE,
    payload: {
      ...hierarchyNode
    }
  };
}


export function clickChartSlice(sliceInfo, seriesInfo, groupingStackStr, datasetId, controlId) {
  return {
    type: CLICK_CHART_SLICE,
    payload: {
      sliceInfo,
      seriesInfo,
      groupingStackStr,
      datasetId,
      controlId
    }
  };
}


export function selectChartGroup(groupVal, seriesName, controlData) {
  return {
    type: SELECT_CHART_GROUP,
    payload: {
      groupVal,
      seriesName,
      controlData
    }
  };
}
