export const CLICK_MENU = "CLICK_MENU";
export const DRAG_TOOLITEM_START = "DRAG_TOOLITEM_START";
export const SELECT_TOOLPANEL_TREE = "SELECT_TOOLPANEL_TREE"

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