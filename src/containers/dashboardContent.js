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
import { Button } from 'semantic-ui-react';
//import ShowMessage, { NotifType } from '../helper/notification';
import Form, {FormDateRange, FormFilterInput} from '../form/Form';

const DEFAULT_SPLIT_SIZES = [15, 85];


// Main Dashboard containing the Treeview (designed using Hierarchy Designer)
// and Dashboard contents (layout designed using Forms Designer)
class DashboardContent extends DesignerContentbase { 

    constructor(props) {
        super(props);
        this.state = {
            pageFilters: []
        };
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
                columns: findLayout.numCols,
                pageFilterFields: findLayout.pageFilterFields && JSON.parse(findLayout.pageFilterFields)
            }
        }
    }

    // This is for debugging only!
    renderDatasetFilters = () => {
        if (!this.props.chartClickFilters || Object.keys(this.props.chartClickFilters).length <= 0) {
            return null;
        }

        return (<table id="dashboardFiltersTable">
            <thead>
                <tr style={{border: "1px solid gray"}}>
                    <td>Dataset ID</td>
                    <td>Control ID</td>
                    <td>Stack ID</td>
                    <td>Own Filter</td>
                    <td>Own Series</td>
                    {/* <td>Carryover Filter</td> */}
                </tr>
            </thead>
            <tbody>
            {
                Object.keys(this.props.chartClickFilters).map((datasetId, iDataset) => {
                    let currDatasetFilters = this.props.chartClickFilters[datasetId];
                    return Object.keys(currDatasetFilters).map((currCtrlId, iCtrl) => {
                        let currControlFilter = currDatasetFilters[currCtrlId];   
                        return Object.keys(currControlFilter).map((currStackStr, iStack) => {
                            let currStackFilter = currControlFilter[currStackStr];
                            let sliceInfo = currStackFilter.sliceInfo;
                            let seriesInfo = currStackFilter.seriesInfo;
                            return <tr key={`filterTable-${iStack}`} style={{border: "1px solid gray"}}>
                                <td>Dataset: {datasetId}, </td>
                                <td>ControlId: {currCtrlId}, </td>
                                <td>Group: {currStackStr}, </td>
                                <td>{JSON.stringify(sliceInfo.origObj)}</td>
                                <td>{JSON.stringify(seriesInfo)}</td>
                                {/* <td>{JSON.stringify(currStackFilter.carryOverFilters)}</td> */}
                            </tr>
                        })
                        
                    })
                })
            }
            </tbody>
        </table>)
    }

    onSubmitFilter = (filterData) => {
        console.log('[dashboard filter submit]', filterData);
    }

    // Renders 1 filter
    renderPageFilter = (filterName, metadata) => {
        // Find the metadata first, then get the datatype, then render the filter based on the datatype
        // TODO: check the metadata
        if (filterName.toLocaleLowerCase() === 'analysisperiod') {
            return <FormDateRange key={'pageFilter_'+filterName} name={filterName} label="Analysis Period:"
            />
        }
        else {
            return <FormFilterInput key={'pageFilter_'+filterName} name={filterName}/>
        }
    }

    setPageFilterControlValues = (setValueFunc, pageFilterFields) => {
        if (!Array.isArray(pageFilterFields)) {
            return;
        }

        pageFilterFields.forEach(filterName => {
            if (filterName.toLocaleLowerCase() === 'analysisperiod') {
                setValueFunc("AnalysisPeriodValue", "Latest value only")
            }
            else {
                // setValueFunc("Pa", "Latest value only")
            }
        });
    }

    renderPageToolbar = (layoutObj, metadata) => {
        debugger
        if (!Array.isArray(layoutObj.layoutData.pageFilterFields)) {
            return null;
        }

        return <Form className="pageToolbar" 
            key='formDataDesigner' 
            onSubmit={(formData) => {this.onSubmitFilter(formData)}} 
            // onSubmit={data => {debugger}}
            setControlValues={this.setPageFilterControlValues}
            // watchedField={[]}
            // // inputObj: set it to the loaded data source when saving is implemented
            inputObj={layoutObj.layoutData.pageFilterFields} 
            // setStateCb={setStateCb}
            >
            <div className="pageToolbarFieldContainer">
            {layoutObj.layoutData.pageFilterFields.map(pageFilter => {
                return (this.renderPageFilter(pageFilter, metadata));
            })}
            </div>    
            <div className="toolbarButtonContainer">
            <Button primary fluid={false} size='small'>Apply Filter</Button>
            </div>  
            </Form>
    }

    renderForm = (layoutName, layoutObj, metadata) => {
        if (!this.props.selectedNode || !this.props.selectedNode.key) {
            return <div className="ui message orange">Please select a node from the treeview on the left!</div>
        }
        return <div>
            {/* {"[DEBUG] Layout Name: " + layoutName} */}
            {this.renderPageToolbar(layoutObj)}
            {this.renderDatasetFilters()}
            <ReportForm
                containerWidth={this.state.rightPixels}
                layoutData={layoutObj.layoutData}
                controls={layoutObj.controls}
                metadata={metadata}
                layoutName={layoutName}
            />
        </div>
    }
    
    // TODO: We need a toolbar to let the user specify the analysis date, and other functions like save to PDF
    render() {
        console.log('render dashboard...', this.props, this.state.rightPixels);
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
            {this.renderForm(layoutName, layoutObj, this.props.metadata)}            
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
        selectedNode: state.dashboard.selectedNode,
        chartClickFilters: state.dashboard.chartClickFilters,
        metadata: state.mainApp.masterMetadata
    }
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators({selectDashboardTree }, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(DashboardContent);