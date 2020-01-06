import React from 'react';
import Toolbar from '../components/toolbar';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {saveNodeConfig} from '../actions/index';
import './hierarchyConfigPanel.css';
import Form, {Text as FormText, IconSelector, ColorSelector} from '../form/Form';
import FormDropDown from '../form/FormDropDown';


// This is the  Right hand panel of the Hierarchy Designer, containing the toolbar and hierarchy page settings

const onSave = () => {

}

const menuItems = {
    'left': [
        {key:'designertb_save', icon: 'save', text: 'Save', type:'submit'},
    ],
}

const dummyPages = ['<None>',
    'Plant Hierarchy Page',
    'Loops Summary Page',
    'Valves Summary Page',
    'Rotating Equipment Summary Page',
    'Area Summary Page',
    'Loop KPI Page',
    'Loop Details Page',
    'Valve KPI Page',
    'Valve Details Page',
];

const renderPageOptions = () => {
    return <select>
        {dummyPages.map((page) => <option key={'option_'+page} value={page}>{page}</option>)};
    </select>
}

const setControlValues = (selectedNode, setValueFunc) => {
    if (!selectedNode) {
        return;
    }

    setValueFunc('name', selectedNode.title);
}

const onSubmit = (args) => {
    console.log('hier config panel submit!', args);
}

const renderHierPanelContent = (selectedNode) => {
    console.log('renderHierPanelContent', selectedNode);
    if (!selectedNode || !selectedNode.key) {
        return <div className="ui message orange">No node is selected</div>
    }

    return <div className="hierconfigPanelContent">
        <div className="ui message">Showing properties for: <b>{selectedNode.title}</b></div>        
            <table className="formTable">
            <tbody>
                <tr>
                    <th>Display Name</th>
                    <td>
                        {/* <input defaultValue={selectedNode.title}></input> */}
                        <FormText
                            key={selectedNode.key+'_key'}
                            name={'name'}
                            label={null}
                        />
                    </td>
                </tr>
                <tr>
                    <th>Page Associated</th>
                    <td>
                        {renderPageOptions()}
                    </td>
                </tr>
            </tbody>
            </table>
    </div>
}

const HierConfigPanel = ({containerWidth, selectedNode}) => {
    console.log('render HierConfigPanel', containerWidth);
    return <Form className="hierConfigPanelContainer" key='form' onSubmit={onSubmit} inputObj={selectedNode} setControlValues={setControlValues}>        
        <Toolbar 
            containerWidth={containerWidth}
            menuItems={menuItems}
        />
        {renderHierPanelContent(selectedNode)}
        </Form>
}

function mapStateToProps(state) {
    return {
        hierarchyTree: state.hierarchyDesigner.hierarchyTree,
        selectedNode: state.hierarchyDesigner.selectedNode,
    }
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ saveNodeConfig }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(HierConfigPanel);