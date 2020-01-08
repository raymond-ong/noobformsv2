import React, {useState} from 'react';
import Toolbar from '../components/toolbar';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {saveNodeConfig} from '../actions/index';
import './hierarchyConfigPanel.css';
import Form, {Text as FormText, FormCheckbox} from '../form/Form';
import FormDropDown from '../form/FormDropDown';


// This is the  Right hand panel of the Hierarchy Designer, containing the toolbar and hierarchy page settings

const onSave = () => {

}

const defaultInherit = true;
const defaultPage = null;

const menuItems = {
    'left': [
        {key:'designertb_save', icon: 'save', text: 'Save', type:'submit'},
    ],
}

const dummyPages = ['None - Do not show',
    'Default Page',
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

const renderPageOptions = (name, disabled=false) => {
    // return <select>
    //     {dummyPages.map((page) => <option key={'option_'+page} value={page}>{page}</option>)};
    // </select>
    let options = dummyPages.map((page) => {return {key: `option_${page}`, text: page, value: page}});
    return <FormDropDown
        name={name}
        label={null}
        options={options}    
        disabled={disabled}
    />
}

const setControlValues = (setValueFunc, inputObj) => {
    if (!inputObj || !inputObj.selectedNode) {
        return;
    }

    setValueFunc('key', inputObj.selectedNode.key); // invisible field

    let findUserSettings = null || inputObj.userSettings && inputObj.userSettings.find(x => x.key === inputObj.selectedNode.key);
    if (!findUserSettings) {
        setValueFunc('name', inputObj.selectedNode.title);
        setValueFunc('inherit', defaultInherit);
        setValueFunc('pageAssoc', defaultPage);
        setValueFunc('childDefaultPage', defaultPage);

    }
    else {
        setValueFunc('name', findUserSettings.dispName);
        setValueFunc('inherit', findUserSettings.inherit);
        setValueFunc('pageAssoc', findUserSettings.pageAssoc);
        setValueFunc('childDefaultPage', findUserSettings.childDefaultPage);
    }
}

const onSubmit = (formArgs, action) => {
    console.log('hier config panel submit!', formArgs, action);
    action({
        key: formArgs.key,
        dispName: formArgs.name,
        inherit: formArgs.inherit,
        pageAssoc: formArgs.pageAssoc,
        childDefaultPage: formArgs.childDefaultPage
    });
}

const findInheritedPage = (selectedNode) => {
    console.log('findInheritedPage', selectedNode);
}

const renderHierPanelContent = (selectedNode, userSettings, myState) => {
    console.log('renderHierPanelContent', selectedNode);
    if (!selectedNode || !selectedNode.key) {
        return <div className="ui message orange">No node is selected</div>
    }

    return <div className="hierconfigPanelContent">
        <div className="ui message">Showing properties for: <b>{selectedNode.key}</b></div>        
        <table className="formTable">
            <tbody>
                <tr style={{display: 'none'}}>
                    <th>Key</th>
                    <td>
                        {/* <input defaultValue={selectedNode.title}></input> */}
                        <FormText
                            key={selectedNode.key+'_key'}
                            name={'key'}
                            label={null}
                        />
                    </td>
                </tr>                
                <tr>
                    <th>Display Name</th>
                    <td>
                        {/* <input defaultValue={selectedNode.title}></input> */}
                        <FormText
                            key={selectedNode.key+'_name'}
                            name={'name'}
                            label={null}
                        />
                    </td>
                </tr>
                <tr>
                    <th>Inherit Default Page from Parent</th>
                    <td>
                        <FormCheckbox
                            name='inherit'
                        />
                        {myState.inherit && <span>Inherited Page: </span>}
                        {myState.inherit && <span>{findInheritedPage(selectedNode)}</span>}
                    </td>
                </tr>                
                <tr>
                    <th>Page Associated</th>
                    <td>
                        {renderPageOptions('pageAssoc', myState.inherit)}
                    </td>
                </tr>
                <tr>
                    <th>Children Default Page</th>
                    <td>
                        {renderPageOptions('childDefaultPage')}
                    </td>
                </tr>
            </tbody>
        </table>
        <div className="ui message olive">TODO: Implement this panel as Tree List View to allow bulk edit</div>
    </div>
}

// saveNodeConfig: redux action to save the node settings
// selectedNode: from redux store
// userSettings: from redux store
const HierConfigPanel = ({containerWidth, selectedNode, userSettings, saveNodeConfig}) => {
    console.log('render HierConfigPanel', userSettings);

    const [myState, setMyState] = useState({
        inherit: defaultInherit});

    return <Form 
        className="hierConfigPanelContainer" 
        key='form' 
        onSubmit={(args) => onSubmit(args, saveNodeConfig)} 
        inputObj={{selectedNode, userSettings}} 
        //inputObj={selectedNode} 
        setControlValues={setControlValues}
        watchedField={'inherit'}
        setStateCb={setMyState}
        >        
        <Toolbar 
            containerWidth={containerWidth}
            menuItems={menuItems}
        />
        {renderHierPanelContent(selectedNode, userSettings, myState)}
        </Form>
}

function mapStateToProps(state) {
    return {
        hierarchyTree: state.hierarchyDesigner.hierarchyTree,
        selectedNode: state.hierarchyDesigner.selectedNode,
        userSettings: state.hierarchyDesigner.userSettings
    }
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ saveNodeConfig }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(HierConfigPanel);