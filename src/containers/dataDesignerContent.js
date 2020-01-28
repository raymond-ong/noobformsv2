import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import NoobSplitter from '../components/noobSplitter';
import DesignerContentbase from './designerContentBase';
import Form, {Text as FormText, FormCheckbox, Dropdown as FormDropDown, FormTreeDropDown, FormRadio} from '../form/Form';
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

const renderDataDesignerPanelContent = () => {
    return <div className="dataDesignerPanelContainer">
        <table className="formTable">
        <tbody>
            <tr>
                <th>Hierarchy</th>
                <td>
                    <FormTreeDropDown name="HierarchyTree"/>
                    <FormRadio name="HierarchyScope" initialSel="self" radioGroupContents={radioGroupContents}/>
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
        onSubmit={onSubmit} 
        setControlValues={setControlValues}
        inputObj={null} 
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