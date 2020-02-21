import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {updateControlProps, deleteControl} from '../actions';

import './propertiesPanel.css';
import {getToolItemByName} from '../components/toolbox';
import splitWord from '../helper/wordSplitter';

import {sectionProps} from '../controls/section';
import {labelProps} from '../controls/label';
import {pieProps} from '../charts/pieChart';
import * as constants from '../constants';
import Form, {Text as FormText, IconSelector, ColorSelector} from '../form/Form';
import FormDropDown from '../form/FormDropDown';
import ShowMessage, {NotifType} from '../helper/notification';
import {Divider, Header, Icon} from 'semantic-ui-react';

const renderDivider = (name, icon) => {
    return <Divider horizontal>
        <Header as='h5'>
        <Icon name={icon} />
        {name}
        </Header>
    </Divider>
}

const renderControlProps = (selectedControl, onSubmit, onDelete)  => {
    let specialProps = [];
    switch(selectedControl.ctrlType) {
        case 'section':
            //return RenderSectionProps(selectedControl, onSubmit);
            specialProps = sectionProps;
            break;
        case 'label':
            specialProps = labelProps;
            break;
        case 'pie':
            specialProps = pieProps;
            break;
        default:
            break;
    }

    return <Form className="propsFormContainer ui small form" key='form' onSubmit={onSubmit} inputObj={selectedControl} setControlValues={setControlValues}>
            <div className="propsForm">
            {renderCommonProps(selectedControl)}
            {renderProps(specialProps, selectedControl.data)}
            {selectedControl.data.dataProps && renderDivider("Data Config", "database")}
            {selectedControl.data.dataProps && renderProps(specialProps, selectedControl.data.dataProps)}
            </div>
            <div className="footerToolbar">
                <button key='deleteBtn' type="button" className="ui negative button mini" onClick={onDelete}>Delete</button>
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

// This is the function that will be called when the form component mounts
// Use this function to set the initial values
const setControlValues = (setValueFunc, selectedControl) => {
    if (!selectedControl) {
        return;
    }

    // Common props
    let toolItemType = getToolItemByName(selectedControl.ctrlType);

    setValueFunc(constants.NAME_CONTROL_ID, selectedControl.i);
    setValueFunc(constants.NAME_CONTROL_TYPE, toolItemType.displayName);

    Object.keys(selectedControl.data).forEach((key, index) => {
        setValueFunc(key, selectedControl.data[key]);
    });
}

const renderProps = (specialProps, controlProps, controlId) => {
    if (!controlProps) {
        return;
    }

    let retList = [];

    Object.keys(controlProps).forEach((key, index) => {
        let foundSpecialProp = specialProps.find(x => x.name === key);
        if (foundSpecialProp) {
            switch(foundSpecialProp.propType) {
                case 'combo':
                    retList.push(<FormDropDown
                        key={controlId+'_'+key}
                        name={key}
                        label={splitWord(key)+":"}
                        options={foundSpecialProp.options}
                    />);
                    break;
                case 'icon':
                    retList.push(<IconSelector
                        key={controlId+'_'+key}
                        name={key}
                        label={splitWord(key)+":"}
                        intialicon={controlProps.icon}
                    />);
                    break;
                case 'color':
                    retList.push(<ColorSelector
                        key={controlId+'_'+key}
                        name={key}
                        label={splitWord(key)+":"}
                        intialcolor={controlProps[foundSpecialProp.name]} // can be color or backgroundColor
                    />);
                    break;
                case 'number':
                    retList.push(<FormText key={controlId+'_'+key}
                        numeric
                        name={key}
                        label={splitWord(key)+':'}
                        units={foundSpecialProp.units}
                    />);
                    break;
                case 'section':
                    // Just skip this.
                    // There should be another call to this function to render the contents of that section
                    break;
                default:
                    break;            
            }
        }
        else {
            retList.push(<FormText key={controlId+'_'+key}
                name={key}
                label={splitWord(key)+':'}
            />);
        }
    });

    return retList;
}



const PropertiesPanel = ({selectedControl, updateControlProps, deleteControl}) => {
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
        ShowMessage('Control Properties Applied!', NotifType.success, '');
    }

    let onDelete = () => {
        deleteControl(selectedControl)
        ShowMessage('Control Deleted!', NotifType.success, '');
    };

    return renderControlProps(selectedControl, onSubmit, onDelete);
}

const mapStateToProps = (state) => {
    return {
        selectedControl: state.designer.layout.find(c => c.selected === true)
    }
  }

//We just let the individual controls take care of everything
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ updateControlProps, deleteControl }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(PropertiesPanel);