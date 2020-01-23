import { FETCH_HIERARCHYCONSO } from "../actions/index";
  
  const defaultState = {
      hierarchyConso: null,
  };

  export default function(state=defaultState, action) {
    if ([FETCH_HIERARCHYCONSO].includes(action.type)) {
        console.log('[DEBUG] reducer_datadesigner', action, state);
    }

    switch(action.type) {
        case FETCH_HIERARCHYCONSO:
            return {
                ...state,
                hierarchyConso: action.payload
            }
    }

    return state;
  }