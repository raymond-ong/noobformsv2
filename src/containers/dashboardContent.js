import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import NoobSplitter from '../components/noobSplitter';
import DesignerContentbase from './designerContentBase';
import HierarchyTree from './hierearchyTree';
import ReportForm from '../components/reportForm';
import {selectDashboardTree} from '../actions';
import {findInheritedPage} from '../containers/hierarchyConfigPanel';
import {reconstructHierarchyStack} from '../helper/treefilter';
import './dashboardContent.css';
//import ShowMessage, { NotifType } from '../helper/notification';

const DEFAULT_SPLIT_SIZES = [15, 85];


// Main Dashboard containing the Treeview (designed using Hierarchy Designer)
// and Dashboard contents (layout designed using Forms Designer)
class DashboardContent extends DesignerContentbase { 

    constructor(props) {
        super(props);
    }

    onSelect = (selectedKeys, info) => {
        console.log("dashboard tree onSelect...", selectedKeys, info);
        if (selectedKeys.length > 0) {
            this.props.selectDashboardTree({
              key: selectedKeys[0], 
              ...info.selectedNodes[0].props
            });
        }
        else {
            this.props.selectDashboardTree(null);
        }
    }

    getLayoutName = (userSettings) => {
        let selectedNode = this.props.selectedNode;
        if (!selectedNode || !userSettings) {
            return null;
        }

        // if there is an associated page, use that directly.
        let findUserSetting = userSettings.find(setting => setting.key === selectedNode.key);        
        if (findUserSetting && findUserSetting.inherit === false) {
            return findUserSetting.pageAssoc;
        }
        else {
            // otherwise, use the inherited page
            return findInheritedPage(selectedNode, userSettings);
        }    
    }

    getLayoutObj = (layoutName) => {
        let findLayout = this.props.masterLayouts && this.props.masterLayouts.find(layout => layout.name === layoutName);
        return {
            controls: findLayout && JSON.parse(findLayout.layoutJson),
            layoutData: findLayout && {
                rows: findLayout.numRows,
                columns: findLayout.numCols
            }
        }
    }

    renderForm = (layoutName, layoutObj) => {
        if (!this.props.selectedNode || !this.props.selectedNode.key) {
            return <div className="ui message orange">Please select a node from the treeview on the left!</div>
        }
        return <div>
            {"[DEBUG] Layout Name: " + layoutName}
            <ReportForm
                containerWidth={this.state.rightPixels}
                layoutData={layoutObj.layoutData}
                controls={layoutObj.controls}
            />
        </div>
    }
    
    // TODO: We need a toolbar to let the user specify the analysis date, and other functions like save to PDF
    render() {
        console.log('render dashboard...', this.props);
        let treeData = this.props.hierarchyView && reconstructHierarchyStack(JSON.parse(this.props.hierarchyView.hierarchyJson));
        let userSettings = this.props.hierarchyView && JSON.parse(this.props.hierarchyView.nodeSettingsJson)
        let layoutName = this.getLayoutName(userSettings);
        let layoutObj = this.getLayoutObj(layoutName);
        // TODO: Put a minsize first. Should make the toolbar buttons responsive.
        // Given the selectedNode, render the appropriate layout
        return <NoobSplitter id="hierarchyDesigner" onDragEnd={this.onSplitDragEnd} defaultSize={DEFAULT_SPLIT_SIZES} minSize={230}>
            {this.props.hierarchyView && <HierarchyTree 
                    onSelectCb={this.onSelect} 
                    selectedNodeKey={this.props.selectedNode ? this.props.selectedNode.key : null}
                    // onHierarchyChanged={this.onHierarchyChanged}
                    treeData={treeData}
                    userSettings={userSettings}
                    controlledExpansion
            />
            }
            {this.renderForm(layoutName, layoutObj)}
            
        </NoobSplitter>
    }
}

function mapStateToProps(state) {
    // Select the appropriate hierarchy tree to be included into the props
    let masterHierarchyViews = state.mainApp.masterHierarchyViews;
    let defaultView = masterHierarchyViews && masterHierarchyViews[0];

    return {
        hierarchyView: defaultView,
        masterLayouts: state.mainApp.masterLayouts,
        selectedNode: state.dashboard.selectedNode
    }
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators({selectDashboardTree }, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(DashboardContent);