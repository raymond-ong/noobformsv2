import { combineReducers } from "redux";
import MainAppReducer from "./reducer_mainApp";
import DesignerReducer from "./reducer_designer";

const rootReducer = combineReducers({
  mainApp: MainAppReducer,
  designer: DesignerReducer
});

export default rootReducer;
