import React, {useState} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {updateControlProps, deleteControl, updateLayoutProps} from '../actions';

import './propertiesPanel.css';
import {getToolItemByName} from '../components/toolbox';
import splitWord from '../helper/wordSplitter';

import {sectionProps} from '../controls/section';
import {labelProps} from '../controls/label';
import {pieProps} from '../charts/pieChart';
import {barProps} from '../charts/barChart';
import {tableProps} from '../controls/table';
import {imageMapProps} from '../controls/imageMap';
import {richTextProps} from '../controls/richtext';
import * as constants from '../constants';
import Form, {Text as FormText, IconSelector, ColorSelector, FormTreeDropDown, FormCheckbox, FormRichText} from '../form/Form';
import FormDropDown from '../form/FormDropDown';
import ShowMessage, {NotifType} from '../helper/notification';
import {Divider, Header, Icon, Message, Button} from 'semantic-ui-react';
import {getMetadataOptions, getMetadataTreeDropdownOptions} from '../helper/metadataManager';
import ImageMapConfigDialog from '../components/imageMapConfigDialog';

const PREFIX_DATAPROPS = 'dataProps.'; // Purpose: React hook form, during form submit, will nest the controls with this prefix inside dataProps field.

const renderDivider = (name, icon) => {
    return <Divider horizontal>
        <Header as='h5'>
        <Icon name={icon} />
        {name}
        </Header>
    </Divider>
}

const renderControlProps = (selectedControl, metadata, onSubmit, onDelete, onCloseOpenConfigDialog, showConfigDialog)  => {
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
        case 'barchart':
            specialProps = barProps;
            break;
        case 'table':
            specialProps = tableProps;
            break;
        case 'imageMap':
            specialProps = imageMapProps;
            break;
        case 'richtext':
            specialProps = richTextProps;
            break;
        default:
            break;
    }

    return <>
            <Form className="propsFormContainer ui small form" 
            key='formControlProps' 
            onSubmit={onSubmit} 
            inputObj={selectedControl} 
            setControlValues={setControlValues}>
            <div className="propsForm">
            {renderCommonProps(selectedControl)}
            {renderProps(specialProps, selectedControl.data, selectedControl.i, metadata, '', onCloseOpenConfigDialog)}
            {selectedControl.data.dataProps && renderDivider("Data Config", "database")}
            {selectedControl.data.dataProps && renderProps(specialProps, selectedControl.data.dataProps, selectedControl.i, metadata, PREFIX_DATAPROPS, onCloseOpenConfigDialog)}
            </div>
            <div className="footerToolbar">
                <button key='deleteBtn' type="button" className="ui negative button mini" onClick={onDelete}>Delete</button>
                <button key='submitBtn' type="submit" className="ui button secondary mini">Apply</button>
            </div>
        </Form>
        {selectedControl.ctrlType === 'imageMap' && <ImageMapConfigDialog 
        //onClose={}
        showOpenForm={showConfigDialog}
        onCloseOpenConfigDialog={onCloseOpenConfigDialog}
        selectedControl={selectedControl}
        />}
        </>
    
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
        // skip the dataProps
        if (key === 'dataProps') {
            return;
        }
        setValueFunc(key, selectedControl.data[key]);
    });

    if (selectedControl.data.dataProps) {
        Object.keys(selectedControl.data.dataProps).forEach((key, index) => {
            setValueFunc(PREFIX_DATAPROPS+key, selectedControl.data.dataProps[key]);
        });
    }
}

// namePrefix: set to 'dataProps.' for dataProps. Purpose is to nest the value.
const renderProps = (specialProps, controlProps, controlId, metadata, namePrefix, onCloseOpenConfigDialog) => {
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
                        name={namePrefix+key}
                        label={splitWord(key)+":"}
                        options={foundSpecialProp.options}
                    />);
                    break;
                case 'icon':
                    retList.push(<IconSelector
                        key={controlId+'_'+key}
                        name={namePrefix+key}
                        label={splitWord(key)+":"}
                        intialicon={controlProps.icon}
                    />);
                    break;
                case 'color':
                    retList.push(<ColorSelector
                        key={controlId+'_'+key}
                        name={namePrefix+key}
                        label={splitWord(key)+":"}
                        intialcolor={controlProps[foundSpecialProp.name]} // can be color or backgroundColor
                    />);
                    break;
                case 'number':
                    retList.push(<FormText key={controlId+'_'+key}
                        numeric
                        name={namePrefix+key}
                        label={splitWord(key)+':'}
                        toolTip={foundSpecialProp.toolTip}
                    />);
                    break;
                case 'bool':
                    retList.push(<FormCheckbox key={controlId+'_'+key}
                        name={namePrefix+key}
                        label={splitWord(key)+':'}
                    />);
                    break;
                case 'section':
                    // Just skip this.
                    // There should be another call to this function to render the contents of that section
                    break;
                case 'metadata':
                    retList.push(renderMetadataField(key, metadata, foundSpecialProp, controlId, namePrefix));
                    break;
                case 'popupConfig':
                    retList.push(<Button 
                        type="button" 
                        key={`${foundSpecialProp.name}Btn`} 
                        primary
                        onClick={() => onCloseOpenConfigDialog(true)}
                        >{foundSpecialProp.buttonName}</Button>);
                    break;
                case 'richText':
                    retList.push(<FormRichText 
                        label={splitWord(key)+':'}
                        name={namePrefix+key}
                        key={`${foundSpecialProp.name}Btn`}
                        initialData={controlProps.richTextData}
                    />);
                    break;
                default:
                    break;            
            }
        }
        else {
            retList.push(<FormText key={controlId+'_'+key}
                name={namePrefix+key}
                label={splitWord(key)+':'}
            />);
        }
    });

    return retList;
}

const renderMetadataField = (metaFieldName, metadata, metaSpecialProps, controlId, namePrefix) => {
    switch(metaSpecialProps.metadataPropType) {
        case 'dropdown':
            return <FormDropDown
                    key={controlId+'_'+metaFieldName}
                    name={namePrefix+metaFieldName}
                    label={splitWord(metaFieldName)+":"}
                    options={getMetadataOptions(metadata, metaSpecialProps.metadataField)}                    
                />
        case 'treeDropdown':
            return <FormTreeDropDown
                key={controlId+'_'+metaFieldName}
                name={namePrefix+metaFieldName}
                treeData={getMetadataTreeDropdownOptions(metadata, [metaSpecialProps.metadataField])} 
                isRequired={false}
                label={splitWord(metaFieldName)+":"}
                dropdownStyle={{ height: 300, overflow: 'auto' }}
                multiple={metaSpecialProps.multiple}
                />
        case 'textbox':
            return <FormText
                key={controlId+'_'+metaFieldName}
                name={namePrefix+metaFieldName}
                label={splitWord(metaFieldName)+":"}
                toolTip={metaSpecialProps.toolTip}
                readOnly={metaSpecialProps.readOnly}
                />
        default:
            break;
    }

    return null;
}

// This is the function that will be called when the form component mounts
// Use this function to set the initial values
const setLayoutValues = (setValueFunc, layoutData) => {
    if (!layoutData || !setValueFunc) {
        return;
    }

    for (var prop in layoutData) {
        setValueFunc(prop, layoutData[prop]);
    }
}

const renderLayoutPropsForm = (layoutData, metadata, onSubmit) => {
    return <Form className="propsFormContainer ui small form" key='formLayoutProps' onSubmit={onSubmit} inputObj={layoutData} setControlValues={setLayoutValues}>
            <div className="propsForm">
            {renderLayoutProps(layoutData, metadata)}
            </div>
            <div className="footerToolbar">
                <button key='submitBtn' type="submit" className="ui button secondary mini">Apply</button>
            </div>
    </Form>
}

const renderLayoutProps = (layoutData, metadata) => {
    let retList = [];
    for (var prop in layoutData) {
        switch(prop) {
            case 'name':
                retList.push(<FormText key={`layout_${prop}_prop`}
                name={prop}
                label={splitWord(prop)+':'}
                readOnly
                />);
                break;
            case 'columns':
                retList.push(<FormText key={`layout_${prop}_prop`}
                numeric
                name={prop}
                label={splitWord(prop)+':'}
                readOnly
                toolTip={"For this version, column size cannot be changed"}
                />);
                break;
            case 'rows':
                retList.push(<FormText key={`layout_${prop}_prop`}
                numeric
                name={prop}
                label={splitWord(prop)+':'}
                toolTip={"For now, there is no validation. Make sure the value provided is sufficient. Otherwise some existing controls might be deleted."}
                />);
                break;
            case 'pageFilterFields':
                // get the items from the metadata
                retList.push(<FormTreeDropDown 
                    key='pageFilterFields'
                    name='pageFilterFields'
                    treeData={getMetadataTreeDropdownOptions(metadata, ['requestParams', 'dimensions',])} 
                    isRequired={false}
                    label={"Page Filter Fields:"}
                    dropdownStyle={{ height: 300, overflow: 'auto' }}
                    multiple
                    />);
                break;
            default:
                break;
        }
    }

    return retList;
}

// TODO: Refactor this class
// Nest all functions inside this big function so that they have access to the props and state, and no need to pass each time
const PropertiesPanel = ({selectedControl, metadata, updateControlProps, deleteControl, selectedPage, layoutData, updateLayoutProps}) => {
    const [showConfigDialog, setShowConfigDialog] = useState(false);

    const onCloseOpenConfigDialog = (bShow) => {
        setShowConfigDialog(bShow);
    }

    // Declare this function inline so that it has access to updateControlProps
    const onSubmit = (submittedData, evt) => {
        console.log('submit control props', submittedData);
        let formattedData = {
            i: submittedData.controlId,
            data: submittedData
        }
    
        delete formattedData.data.controlId;
        delete formattedData.data.controlType;
        if (selectedControl.data.imageProps) {
            // manually bring back the imageProps because the data is not found inside this form
            formattedData.data.imageProps = {...selectedControl.data.imageProps};
        }
    
        // Fire redux action to update store
        updateControlProps(formattedData);
        ShowMessage('Control Properties Applied!', NotifType.success, '');
    }

    const onSubmitLayoutForm = (submittedData) => {
        console.log('submit layout props', submittedData);   
        // Fire redux action to update store
        updateLayoutProps(submittedData);
        ShowMessage('Layout Properties Applied!', NotifType.success, '');        
    }

    const onDelete = () => {
        deleteControl(selectedControl)
        ShowMessage('Control Deleted!', NotifType.success, '');
    };

    if (!selectedControl && !selectedPage) {
        // return <div className="ui message warning">No object selected in the Designer. Please select any control or click [Configure Page Settings] button to see the layout settings</div>
        return <Message header='No object selected in the Designer' 
                        content='Please select either any control or click [Configure Page Settings] button to configure the layout'/>
    }

    if (selectedPage) {
        return renderLayoutPropsForm(layoutData, metadata, onSubmitLayoutForm);
    }

    return renderControlProps(selectedControl, metadata, onSubmit, onDelete, onCloseOpenConfigDialog, showConfigDialog);
}

const mapStateToProps = (state) => {
    return {
        selectedControl: state.designer.layout.find(c => c.selected === true),
        selectedPage: state.designer.pageSelected,
        layoutData: state.designer.layoutData, // This just contains the number of rows, cols and filterFields selected by the user
        metadata: state.mainApp.masterMetadata
    }
  }

//We just let the individual controls take care of everything
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ updateControlProps, deleteControl, updateLayoutProps }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(PropertiesPanel);