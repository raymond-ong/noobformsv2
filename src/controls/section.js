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

const onSubmit = (data, e) => {
    console.log('onSubmit', data, e);
}



export const RenderControlProps = (selectedControl) => {
    if (!selectedControl) {
        return;
    }

    // useEffect(() => {
    //     // Set the initial values
    //     // The controls' values are not really bound to any state or props so we have to update it here
    //     console.log('useEffect start');
    //     setControlValues(selectedControl, setValue);
    //   }, [selectedControl]); // Means if selectedControl value does not change, don't run useEffect again.

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

/*
const renderCommonProps = (selectedControl, register) => {
    // Just render the control type and ID
    let toolItemType = getToolItemByName(selectedControl.ctrlType);
    console.log('propsPanel', selectedControl);

    let retList = [];
    retList.push(<Form.Field key={'field-ctrlType'}>
            <label>Control Type:</label>
            <input value={toolItemType.displayName} readOnly/>
        </Form.Field>);

    // Add ref and name, so that it will be included in the submit data
    retList.push(<Form.Field key={'field-controlId'}>
            <label>Control Id:</label>
            <input defaultValue={selectedControl.i} readOnly ref={register} name={NAME_CONTROL_ID}/>
        </Form.Field>);

    return retList;
}


//setValue is from react-hook-form
const setControlValues = (selectedControl, setValueFunc) => {
    if (!selectedControl) {
        return;
    }

    // Common props
    setValueFunc(NAME_CONTROL_ID, selectedControl.i);

    Object.keys(selectedControl.data).forEach((key, index) => {
        setValueFunc(key, selectedControl.data[key]);
    });
}

const renderDataProps = (selectedControl, register, stateValue) => {
    if (!selectedControl) {
        return;
    }

    let retList = [];

    Object.keys(selectedControl.data).forEach((key, index) => {
        switch(key) {
            case 'level':
                retList.push(<Form.Field key={'field-'+key}>
                <label>{splitWord(key)}</label>
                <Dropdown 
                    fluid
                    selection
                    button
                    // defaultValue={selectedControl.data[key]}
                    className='icon small'
                    options={levelOptions}
                    style={{fontWeight:'normal', color: 'gray', right: '0', left: 'auto'}} // This affects the text/placeholder
                    //onChange={handleControlChange.bind(this, setValue, key)}
                    onChange={handleControlChange}
                    // ref={register} name={key}
                    value={stateValue.level}
                />
                </Form.Field>);
                break;
            default:
                retList.push(<Form.Field key={'field-'+key}>
                    <label>{splitWord(key)}</label>
                    <input defaultValue={selectedControl.data[key]} ref={register} name={key}/>
                </Form.Field>);
        }
    });

    return retList;
}

export const RenderControlProps = (selectedControl) => {
    const [stateValue, setStateValue] = useState(defaultState);
    const { register, handleSubmit, watch, errors, setValue } = useForm();
    const dispatch = useDispatch();

    const onSubmit = (data, e) => {
        debugger
    }

    useEffect(() => {
        // Set the initial values
        console.log('useEffect start');
        setStateValue({
            level: selectedControl.data.level
        })
        setControlValues(selectedControl, setValue);
      }, [selectedControl]); // Means if selectedControl value does not change, don't run useEffect again.

    return <Form 
            onSubmit={handleSubmit(onSubmit)}
            className="propsForm ui small form">
            {renderCommonProps(selectedControl, register)}
            {renderDataProps(selectedControl, register, stateValue)}
            <input type="submit" value="Apply" className="ui button secondary small"/>
        </Form>
}
*/

/*
export const renderDataProps2 = (selectedControl, register, setValue) => {
    let retList = [];
    // const [values, setSemanticValue] = useState({ selectedOption: [] });

    // const handleMultiChange = (e, data) => {
    //     setValue("reactSelect", data.value);
    //     setSemanticValue(data.value);
    //   }
    Object.keys(selectedControl.data).forEach((key, index) => {
        let newField;
        switch(key) {
            case 'level':
                newField = (<Form.Field key={'field-'+key}>
                    <label>{splitWord(key)}</label>
                    {/* <RHFInput
                    as={<Dropdown 
                        fluid
                        selection
                        button
                        // defaultValue={selectedControl.data[key]}
                        className='icon small'
                        options={levelOptions}
                        style={{fontWeight:'normal', color: 'gray', right: '0', left: 'auto'}} // This affects the text/placeholder
                        />}
                    name={key}
                    register={register}
                    setValue={setValue}
                    />
                    <Dropdown 
                        fluid
                        selection
                        button
                        // defaultValue={selectedControl.data[key]}
                        className='icon small'
                        options={levelOptions}
                        style={{fontWeight:'normal', color: 'gray', right: '0', left: 'auto'}} // This affects the text/placeholder
                        onChange={handleLevelChange.bind(this, setValue, key)}
                        // ref={register} name={key}
                        // value={values.selectedOption}
                    />                
                </Form.Field>)
                break;
            default:
                newField = (<Form.Field key={'field-'+key}>
                    <label>{splitWord(key)}</label>
                    <input defaultValue={selectedControl.data[key]} ref={register} name={key}/>
                </Form.Field>)
                break;
        }
        retList.push(newField);
    })
    return retList;
}
*/