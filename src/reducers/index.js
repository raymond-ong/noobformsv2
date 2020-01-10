import { combineReducers } from "redux";
import MainAppReducer from "./reducer_mainApp";
import DesignerReducer from "./reducer_designer";
import HierarchyDesignerReducer from "./reducer_hierarchyDesigner";
import ReportAppReducer from "./reducer_reportApp";


const rootReducer = combineReducers({
  mainApp: MainAppReducer,
  designer: DesignerReducer,
  hierarchyDesigner: HierarchyDesignerReducer,
  reportApp: ReportAppReducer
});

export default rootReducer;
