import React, {useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {updateControlProps} from '../actions';

import './propertiesPanel.css';
// import useForm from "react-hook-form";
// import { Button, Checkbox, Dropdown } from 'semantic-ui-react';
import {getToolItemByName} from '../components/toolbox';
import splitWord from '../helper/wordSplitter';

import {RenderControlProps as RenderSectionProps} from '../controls/section';
import {sectionProps} from '../controls/section';
import * as constants from '../constants';
import Form, {Text as FormText} from '../form/Form';
import FormDropDown from '../form/FormDropDown';

// const setValues = (selectedControl, setValueFunc) => {
//     if (!selectedControl) {
//         return;
//     }
//     //setValueFunc('controlId', selectedControl.i);
//     Object.keys(selectedControl.data).forEach((key, index) => {
//         setValueFunc(key, selectedControl.data[key]);
//     });
// }

const renderControlProps = (selectedControl, onSubmit)  => {
    let specialProps = [];
    switch(selectedControl.ctrlType) {
        case 'section':
            //return RenderSectionProps(selectedControl, onSubmit);
            specialProps = sectionProps;
        default:
            break;
    }

    return <Form className="propsFormContainer ui small form" key='form' onSubmit={onSubmit} inputObj={selectedControl}>
            <div className="propsForm">
            {renderCommonProps(selectedControl)}
            {renderControlDataProps(specialProps, selectedControl)}
            </div>
            <div className="footerToolbar">
                <button key='deleteBtn' className="ui negative button mini">Delete</button>
                <button key='submitBtn' type="submit" className="ui button secondary mini">Apply</button>
            </div>
        </Form>
}

const renderCommonProps = selectedControl => {
    let toolItemType = getToolItemByName(selectedControl.ctrlType);
    let retList = [];
    retList.push(<FormText key={constants.NAME_CONTROL_TYPE}
                             name={constants.NAME_CONTROL_TYPE}
                            label="Control Type:"
                            readOnly                                                                             
    />);

    retList.push(<FormText key={constants.NAME_CONTROL_ID}
        name={constants.NAME_CONTROL_ID}
        label="Control Id:"
        readOnly
    />);

    return retList;    
}

const renderControlDataProps = (specialProps, selectedControl) => {
    if (!selectedControl) {
        return;
    }

    let retList = [];

    Object.keys(selectedControl.data).forEach((key, index) => {
        let foundSpecialProp = specialProps.find(x => x.name === key);
        if (foundSpecialProp) {
            switch(foundSpecialProp.propType) {
                case 'combo':
                    retList.push(<FormDropDown
                        key={key}
                        name={key}
                        label={splitWord(key)+":"}
                        options={foundSpecialProp.options}
                    />);
                    break;
                default:
                    break;            
            }
        }
        else {
            retList.push(<FormText key={key}
                name={key}
                label={splitWord(key)+':'}
            />);
        }
        // switch(key) {
        //     case 'level':
        //         retList.push(<FormDropDown
        //             key={key}
        //             name={key}
        //             label={splitWord(key)+":"}
        //             options={levelOptions}
        //         />);
        //         break;
        //     default:
        //         retList.push(<FormText key={key}
        //             name={key}
        //             label={splitWord(key)+':'}                                                             
        //         />);
        // }
    });

    return retList;
}

const PropertiesPanel = ({selectedControl, updateControlProps}) => {
    if (!selectedControl) {
        return <div className="ui message warning">No control selected in the Designer</div>
    }

    // Declare this function inline so that it has access to updateControlProps
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

    return renderControlProps(selectedControl, onSubmit);
}

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