import { combineReducers } from "redux";
import MainAppReducer from "./reducer_mainApp";

const rootReducer = combineReducers({
  mainApp: MainAppReducer
});

export default rootReducer;
