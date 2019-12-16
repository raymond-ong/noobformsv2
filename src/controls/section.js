import React, {useState, useEffect} from 'react';
import './section.css';
import './common.css';
import noobControlHoc from '../hoc/noobControlsHoc';
//import { Form } from 'semantic-ui-react';
import splitWord from '../helper/wordSplitter';
import { Dropdown, Icon, Button } from 'semantic-ui-react';
import useForm from "react-hook-form";
import { RHFInput } from 'react-hook-form-input'; // this is in beta-phase only now; not stable
import { useDispatch } from 'react-redux'
import {getToolItemByName} from '../components/toolbox';
// import Form, {
//     TextInput,
//     // TextArea,
//     // Select,
//     // Checkbox,
//     // Button,
//     // FileInput
//   } from "../form/Form";
import Form, {Text as FormText} from '../form/Form';
import FormDropDown from '../form/FormDropDown';


const Section = (props) => {
    console.log('section render', props.data.title);
    let classNames = 'section';
    if (props.selected === true) {
        classNames += ' ctrl-selected'
    }

    return <div className={classNames}>
        {props.data.title}
    </div>
}
export default noobControlHoc(Section);


/* This region is for the Props Pane */
const levelOptions = [
    { key: 'level-1', text: '1', value: 1 },    
    { key: 'level-2', text: '2', value: 2 },    
    { key: 'level-3', text: '3', value: 3 },    
    { key: 'level-4', text: '4', value: 4 },    
];

// For controls that are not native / cannot be handled by react-hook-form
// We manually manage the values:
// a. React side (usual databindings)
// b. react-hook-form side: we call setValue() so that we can get the value during submit
const defaultState = {
    level: 1
}

const handleControlChange= (setValue, key, e, data) => {
    setValue(key, data.value);
}

const NAME_CONTROL_ID = 'controlId'
const NAME_CONTROL_TYPE = 'controlType'

export const RenderControlProps = (selectedControl, onSubmit) => {
    if (!selectedControl) {
        return;
    }

    return (<Form className="propsForm ui small form" key='form' onSubmit={onSubmit} inputObj={selectedControl}>
        {renderCommonProps(selectedControl)}   
        {renderDataProps(selectedControl)}   
        <input key='submitBtn' type="submit" value="Apply" className="ui button secondary small"/> 
    </Form>)
}

const renderCommonProps = (selectedControl) => {
    let toolItemType = getToolItemByName(selectedControl.ctrlType);
    let retList = [];
    retList.push(<FormText key={NAME_CONTROL_TYPE}
                             name={NAME_CONTROL_TYPE}
                            label="Control Type:"
                            readOnly                                                                             
    />);

    retList.push(<FormText key={NAME_CONTROL_ID}
        name={NAME_CONTROL_ID}
        label="Control Id:"
        readOnly
        // Default value is useless, it will not update again when another control is selected
        // defaultValue={selectedControl.i}
    />);

    return retList;
}

const renderDataProps = (selectedControl, register, stateValue) => {
    if (!selectedControl) {
        return;
    }

    let retList = [];

    Object.keys(selectedControl.data).forEach((key, index) => {
        switch(key) {
            case 'level':
                retList.push(<FormDropDown
                    key={key}
                    name={key}
                    label={splitWord(key)+":"}
                    options={levelOptions}
                />);
                break;
            default:
                retList.push(<FormText key={key}
                    name={key}
                    label={splitWord(key)+':'}                                                             
                />);
        }
    });

    return retList;
}