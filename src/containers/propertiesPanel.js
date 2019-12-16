import React, {useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {updateControlProps} from '../actions';

import './propertiesPanel.css';
import useForm from "react-hook-form";
import { Button, Checkbox, Form, Dropdown } from 'semantic-ui-react';
import {getToolItemByName} from '../components/toolbox';
import splitWord from '../helper/wordSplitter';

import {RenderControlProps as RenderSectionProps} from '../controls/section';

/*
const onSubmit = (submittedData, evt ) => {
    debugger
    console.log('submit', submittedData);
    let formattedData = {
        i: submittedData.controlId,
        data: submittedData
    }

    delete formattedData.data.controlId;

    // Fire redux action to update
    dispatchFn(formattedData);
};
*/

const setValues = (selectedControl, setValueFunc) => {
    if (!selectedControl) {
        return;
    }
    //setValueFunc('controlId', selectedControl.i);
    Object.keys(selectedControl.data).forEach((key, index) => {
        setValueFunc(key, selectedControl.data[key]);
    });
}

const renderDataProps = (selectedControl, onSubmit)  => {
    switch(selectedControl.ctrlType) {
        case 'section':
            return RenderSectionProps(selectedControl, onSubmit);
        default:
            return null;
    }
}

const PropertiesPanel = ({selectedControl, updateControlProps}) => {
    if (!selectedControl) {
        return <div className="ui message warning">No control selected in the Designer</div>
    }

    let onSubmit = (submittedData, evt) => {
        console.log('submit', submittedData);
        let formattedData = {
            i: submittedData.controlId,
            data: submittedData
        }
    
        delete formattedData.data.controlId;
        delete formattedData.data.controlType;
    
        // Fire redux action to update store
        updateControlProps(formattedData);
    }

    return renderDataProps(selectedControl, onSubmit);
}

const levelOptions = [
    { key: 'level-1', text: '1', value: 1 },    
    { key: 'level-2', text: '2', value: 2 },    
    { key: 'level-3', text: '3', value: 3 },    
    { key: 'level-4', text: '4', value: 4 },    
];

const mapStateToProps = (state) => {
    return {
        selectedControl: state.designer.layout.find(c => c.selected === true)
    }
  }

//We just let the individual controls take care of everything
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ updateControlProps }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(PropertiesPanel);