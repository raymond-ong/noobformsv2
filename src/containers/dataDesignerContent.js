import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import NoobSplitter from '../components/noobSplitter';
import DesignerContentbase from './designerContentBase';
import Form, {Text as FormText, FormCheckbox, Dropdown as FormDropDown, FormTreeDropDown} from '../form/Form';
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

// Mode 1: Flat data "simple mode"
const simpleTreeData = [
    { key: 1, pId: 0, label: 'test1', value: 'test1' },
    { key: 121, pId: 0, label: 'test2', value: 'test2' },
    { key: 11, pId: 1, label: 'test11', value: 'test11' },
    { key: 12, pId: 1, label: 'test12', value: 'test12' },
    { key: 111, pId: 11, label: 'test111', value: 'test111' },
  ];

const treeDataSimpleMode = {
    id: 'key',
    rootPId: 0,
  };

// Mode 2: traditional data
const treeDataSample = [
    { key: '0-0', title: 'Plant', children:
      [
        { key: '0-0-0', title: 'Area1', isCollapsed: true, children:
          [
            { key: '0-0-0-0', title: 'Apple' },
          ],
        },
        { key: '0-0-1', title: 'Area2', children:
            [
              { key: '0-0-1-0', title: 'Banana',},
              { key: '0-0-1-1', title: 'Carrot' },
              { key: '0-0-1-2', title: 'Dolphin' },
              { key: '0-0-1-3', title: 'Elephant' },
              { key: '0-0-1-4', title: 'Father' },
              { key: '0-0-1-5', title: 'Germany' },
              { key: '0-0-1-6', title: 'Holland' },
              { key: '0-0-1-7', title: 'India' },
              { key: '0-0-1-8', title: 'Japan' },
              { key: '0-0-1-9', title: 'Kristaps' },
              { key: '0-0-1-10', title: 'Lion' },
              { key: '0-0-1-11', title: 'Mexico' },
              { key: '0-0-1-12', title: 'Nigeria' },
              { key: '0-0-1-13', title: 'Carrot Apple' },
              { key: '0-0-1-14', title: 'Strawberry Banana' },
              { key: '0-0-1-15', title: 'Godfather' },
              { key: '0-0-1-16', title: 'Indian Mango' },
              { key: '0-0-1-17', title: 'Dandelion' },
              { key: '0-0-1-18', title: 'Lionel' },
              { key: '0-0-1-19', title: 'Millionaire' },
              { key: '0-0-1-20', title: 'The quick brown fox jumps over the lazy dog' },
              { key: '0-0-1-21', title: 'abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
              { key: '0-0-1-22', title: '床前明月光,疑是地上霜,举头望明月,低头思故乡' },
            ],
        },
      ],
    },
  ];
  
const renderDataDesignerPanelContent = () => {
    return <div className="dataDesignerPanelContainer">
        {/* <TreeSelect
            style={{ width: 300 }}
            transitionName="rc-tree-select-dropdown-slide-up"
            choiceTransitionName="rc-tree-select-selection__choice-zoom"
            dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
            dropdownPopupAlign={{ overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] }}
            placeholder={<i>Please select...</i>}
            searchPlaceholder="Search..."
            treeLine
            //treeDataSimpleMode={treeDataSimpleMode}
            showSearch
            allowClear
            maxTagTextLength={10}
            //value={value}
            //treeData={simpleTreeData}
            treeData={treeDataSample}
            treeNodeFilterProp="title"            
            multiple={false}
            //onChange={this.onChange}
            //onSelect={this.onSelect}
        /> */}
        <FormTreeDropDown/>
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