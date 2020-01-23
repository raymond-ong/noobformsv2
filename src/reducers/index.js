import { combineReducers } from "redux";
import MainAppReducer from "./reducer_mainApp";
import DesignerReducer from "./reducer_designer";
import HierarchyDesignerReducer from "./reducer_hierarchyDesigner";
import ReportAppReducer from "./reducer_reportApp";
import DashboardReducer from "./reducer_dashboard";
import DataDesignerReducer from './reducer_datadesigner';


const rootReducer = combineReducers({
  mainApp: MainAppReducer,
  designer: DesignerReducer,
  hierarchyDesigner: HierarchyDesignerReducer,
  reportApp: ReportAppReducer,
  dashboard: DashboardReducer,
  dataDesigner: DataDesignerReducer
});

export default rootReducer;
