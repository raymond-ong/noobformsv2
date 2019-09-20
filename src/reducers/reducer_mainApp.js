import { CLICK_MENU } from "../actions/index";

const defaultState = {
    activeMenu: 'home',
    tabIndex: 0
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
  }
  return state;
}
