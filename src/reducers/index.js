import { combineReducers } from "redux";
import MainAppReducer from "./reducer_mainApp";
import DesignerReducer from "./reducer_designer";
import HierarchyDesignerReducer from "./reducer_hierarchyDesigner";

const rootReducer = combineReducers({
  mainApp: MainAppReducer,
  designer: DesignerReducer,
  hierarchyDesigner: HierarchyDesignerReducer
});

export default rootReducer;
