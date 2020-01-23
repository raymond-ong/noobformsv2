import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import NoobSplitter from '../components/noobSplitter';
import DesignerContentbase from './designerContentBase';
import Form, {Text as FormText, FormCheckbox, Dropdown as FormDropDown} from '../form/Form';
import ShowMessage, { NotifType } from '../helper/notification';
import Toolbar from '../components/toolbar';
import 'rc-tree-select/assets/index.css';
import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';

import './dataDesignerContent.css';

const DEFAULT_SPLIT_SIZES = [15, 85];

const DataListPanel = () => {
    return <div>
        Data List Panel (Under Construction)
    </div>
}

const menuItems = {
    'left': [
        {key:'datadesignertb_save', icon: 'save', text: 'Save', type:'submit'},
        {key:'datadesignertb_saveas', icon: 'save outline', text: 'Save As', type:'submit'},
    ],
};

const simpleTreeData = [
    { key: 1, pId: 0, label: 'a', value: 'a' },
    { key: 11, pId: 1, label: 'a12', value: 'a12', disabled: true },
    { key: 111, pId: 11, label: 'a00', value: 'a00', selectable: false },
    { key: 2, pId: 0, label: 'b', value: 'b' },
    { key: 20, pId: 2, label: 'b10', value: 'b10' },
    { key: 21, pId: 2, label: 'b1', value: 'b1' },
    { key: 22, pId: 2, label: 'b12', value: 'b12' },
  ];

const renderDataDesignerPanelContent = () => {
    return <div className="dataDesignerPanelContainer">
        <TreeSelect
            style={{ width: 300 }}
            transitionName="rc-tree-select-dropdown-slide-up"
            choiceTransitionName="rc-tree-select-selection__choice-zoom"
            dropdownStyle={{ height: 200, overflow: 'auto' }}
            dropdownPopupAlign={{ overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] }}
            placeholder={<i>Please select...</i>}
            searchPlaceholder="Search..."
            treeLine
            maxTagTextLength={10}
            //value={value}
            treeData={simpleTreeData}
            treeNodeFilterProp="title"
            treeCheckable
            //onChange={this.onChange}
            //onSelect={this.onSelect}
        />
    </div>
}

const DataDesignerForm = (containerWidth) => {
    // return <div>
    //     <div>Hierarchy combobox (single select)</div>
    //     <div>Radio button: choose whether for itself (use case: dial gauges), or for children if Hierarchy selected is a folder</div>
    //     <div>Dimensions combobox (multi, optional)</div>
    //     <div>KPI Group combobox (multi, optional, default to use Count aggregation first)</div>
    //     <div>KPI combobox (multi, optional, default to use Count aggregation first)</div>
    //     <div>&nbsp;&nbsp;A. If for itself (e.g. Loop Performance Summary)</div>
    //     <div>&nbsp;&nbsp;B. If for children (e.g. Loop Controllability)</div>
    //     <div>Table+button: Data Preview</div>
    // </div>

    return <Form 
        className="hierConfigPanelContainer" 
        key='formDataDesigner' 
        // onSubmit={(args) => onSubmit(args, saveNodeConfig)} 
        // inputObj={{selectedNode, userSettings}} 
        // //inputObj={selectedNode} 
        // setControlValues={setControlValues}
        // watchedField={'inherit'}
        // setStateCb={setMyState}
        >        
        <Toolbar 
            containerWidth={containerWidth}
            menuItems={menuItems}
        />
        {renderDataDesignerPanelContent()}
    </Form>
}

// This is where the user configures the datasources that can be linked to the controls
class DataDesignerContainer extends DesignerContentbase { 

    constructor(props) {
        super(props);
        this.state = {
            ...this.state
        }
    }
    
    render() {
        console.log('render hierarchyDesigner', this.state.rightPixels);
        // TODO: Put a minsize first. Should make the toolbar buttons responsive.
        return <NoobSplitter id="hierarchyDesigner" onDragEnd={this.onSplitDragEnd} defaultSize={DEFAULT_SPLIT_SIZES} minSize={230}>
            {DataListPanel()}
            {DataDesignerForm(this.state.rightPixels)}
        </NoobSplitter>

    }
}

function mapStateToProps(state) {
    return {

    }
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ }, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(DataDesignerContainer);