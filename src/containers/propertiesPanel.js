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

const onSubmit = (dispatchFn, submittedData ) => {
    console.log('submit', submittedData);
    let formattedData = {
        i: submittedData.controlId,
        data: submittedData
    }

    delete formattedData.data.controlId;

    // Fire redux action to update
    dispatchFn(formattedData);
};

const setValues = (selectedControl, setValueFunc) => {
    if (!selectedControl) {
        return;
    }
    //setValueFunc('controlId', selectedControl.i);
    Object.keys(selectedControl.data).forEach((key, index) => {
        setValueFunc(key, selectedControl.data[key]);
    });
}

const renderDataProps = (selectedControl, register, setValue)  => {
    switch(selectedControl.ctrlType) {
        case 'section':
            return RenderSectionProps(selectedControl, register, setValue);
        default:
            return null;
    }
}

// updateControlProps: dispatches action to redux
const PropertiesPanel = ({selectedControl, updateControlProps}) => {
    if (!selectedControl) {
        return <div className="ui message warning">No control selected in the Designer</div>
    }

    return renderDataProps(selectedControl, updateControlProps);
}

const levelOptions = [
    { key: 'level-1', text: '1', value: 1 },    
    { key: 'level-2', text: '2', value: 2 },    
    { key: 'level-3', text: '3', value: 3 },    
    { key: 'level-4', text: '4', value: 4 },    
];

// For section only -- testing
const PropertiesPanelTesting = ({selectedControl, updateControlProps}) => {
    const { register, handleSubmit, setValue } = useForm();
    const onSubmit = data => console.log(data);
    const [values, setReactSelectValue] = useState(1);

    const handleMultiChange = selectedOption => {
        // debugger
        setValue("level", 3);
        setReactSelectValue(3);
        //setReactSelectValue({selectedOption: 0});
    }

    React.useEffect(() => {
        //debugger
        register({ name: "level" }); // custom register semantic dropdown

        setValue("level", 4);
        setReactSelectValue(4);
        //setReactSelectValue({selectedOption: 0});
    }, [register])

    return (
    <Form onSubmit={handleSubmit(onSubmit)}>
        <Dropdown
            fluid
            selection
            button
            className='icon small'
            options={levelOptions}
            value={values}
            onChange={handleMultiChange}
        />
        <input type="submit" />
    </Form>
    );
}

const PropertiesPanelOrig = ({selectedControl, updateControlProps}) => {
    const { register, handleSubmit, watch, errors, setValue } = useForm();

    useEffect(() => {
        // Update the document title using the browser API
        console.log('useEffect start');
        setValues(selectedControl, setValue);
      });

    if (!selectedControl) {
        return <div className="ui message warning">No control selected in the Designer</div>
    }

    let toolItemType = getToolItemByName(selectedControl.ctrlType);
    console.log('propsPanel', selectedControl);

    
    const onSubmitBound = onSubmit.bind(this, updateControlProps);

    return (<Form 
        onSubmit={handleSubmit(onSubmitBound, updateControlProps)}
        className="propsForm ui small form">    

        <Form.Field key={'field-'+toolItemType.displayName}>
            <label>Control Type:</label>
            <input className="ui small" value={toolItemType.displayName} readOnly/>
        </Form.Field>

        <Form.Field key={'field-controlId'}>
            <label>Control Id:</label>
            <input  value={selectedControl.i} ref={register} name="controlId" readOnly/>
        </Form.Field>

        {renderDataProps(selectedControl, register, setValue)}

        <input type="submit" value="Apply" className="ui button secondary small"/>
    </Form>);
}

const mapStateToProps = (state) => {
    return {
        selectedControl: state.designer.layout.find(c => c.selected === true)
    }
  }

/* We just let the individual controls take care of everything
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ updateControlProps }, dispatch);
}
*/

export default connect(mapStateToProps)(PropertiesPanel);