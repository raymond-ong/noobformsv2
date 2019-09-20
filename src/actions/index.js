export const CLICK_MENU = "CLICK_MENU";

export function menuClicked(menuName) { 
    return {
      type: CLICK_MENU,
      payload: menuName
    };
}