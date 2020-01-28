import React, {useState} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import NoobSplitter from '../components/noobSplitter';
import DesignerContentbase from './designerContentBase';
import Form, {Text as FormText, FormCheckbox, Dropdown as FormDropDown, FormTreeDropDown, FormRadio} from '../form/Form';
import ShowMessage, { NotifType } from '../helper/notification';
import Toolbar from '../components/toolbar';
import 'rc-tree-select/assets/index.css';
import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';
import {findNodeByKey} from '../helper/treefilter';

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

const renderPageOptions = () => {
    //let options = savedLayouts.map((layout) => {return {key: `option_${layout.name}`, text: layout.name, value: layout.name}});
    return <FormDropDown
        // name={name}
        // label={null}
        options={null}    
        // disabled={disabled}
    />
}

const radioGroupContents = [
    {label: 'For selected Hierarchy node', name: 'rgrpHierScope', value: 'self', },
    {label: "For selected Hierarchy node's children", name: 'rgrpHierScope', value: 'children', }
];

const renderDataDesignerPanelContent = (props, state) => {
    debugger
    let findSelNode = findNodeByKey(props.hierarchyConso, state.hierarchyTree);
    let selNodeIsFolder = !!findSelNode && findSelNode.item.unitType !== 'Target';
    return <div className="dataDesignerPanelContainer">
        <table className="formTable">
        <tbody>
            <tr>
                <th>Hierarchy</th>
                <td>
                    <FormTreeDropDown name="hierarchyTree" treeData={props.hierarchyConso}/>
                    {selNodeIsFolder && <FormRadio name="HierarchyScope" initialSel="self" radioGroupContents={radioGroupContents}/>}
                </td>
            </tr>

            <tr>
                <th>Dimension</th>
                <td>
                    {renderPageOptions('pageAssoc')}
                </td>
            </tr>

            <tr>
                <th>Measure</th>
                <td>
                    {renderPageOptions('pageAssoc')}
                </td>
            </tr>

        </tbody>
        </table>
    </div>
}

const onSubmit = (args) => {
    console.log('Date Designer Submit', args);
}

const DataDesignerForm = (props, containerWidth, state, setStateCb) => {
    return <Form 
        className="hierConfigPanelContainer" 
        key='formDataDesigner' 
        onSubmit={onSubmit} 
        setControlValues={setControlValues}
        watchedField={'hierarchyTree'}
        inputObj={null} 
        setStateCb={setStateCb}
        >        
        <Toolbar 
            containerWidth={containerWidth}
            menuItems={menuItems}
        />
        {renderDataDesignerPanelContent(props, state)}
    </Form>
}

// Called when component mounts
// Purpose is to set the initial values
const setControlValues = (setValueFunc, inputObj) => {
    // if (!inputObj || !inputObj.selectedNode) {
    //     return;
    // }

    setValueFunc('HierarchyScope', 'children');
}

// This is where the user configures the datasources that can be linked to the controls
class DataDesignerContainer extends DesignerContentbase { 

    constructor(props) {
        super(props);
        this.state = {
            hierarchyTree: null,
            ...this.state
        }
    }
    
    render() {
        console.log('render hierarchyDesigner', this.state.rightPixels);
        // TODO: Put a minsize first. Should make the toolbar buttons responsive.
        return <NoobSplitter id="hierarchyDesigner" onDragEnd={this.onSplitDragEnd} defaultSize={DEFAULT_SPLIT_SIZES} minSize={230}>
            {DataListPanel()}
            {DataDesignerForm(this.props, this.rightPixels, this.state, this.setState.bind(this))}
        </NoobSplitter>

    }
}

function mapStateToProps(state) {
    return {
        hierarchyConso: state.dataDesigner.hierarchyConso,
    }
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ }, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(DataDesignerContainer);