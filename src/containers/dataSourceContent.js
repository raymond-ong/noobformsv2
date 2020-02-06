import React, {useState} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import Toolbar from '../components/toolbar';
import DesignerContentbase from './designerContentBase';
import NoobSplitter from '../components/noobSplitter';
import Form, {Text as FormText, FormCheckbox, Dropdown as FormDropDown} from '../form/Form';
import {Button, Icon, Label} from 'semantic-ui-react';
import './dataSourceContent.css';

const ID_VALIDATE_BTN = 'validateDataSrcBtn';

const menuItems = {
    'left': [
        {key:'designertb_save', icon: 'save', text: 'Save', type:'submit'},
        {key:'designertb_saveAs', icon: 'save outline', text: 'Save As', type:'submit'},
    ],
}

const DEFAULT_SPLIT_SIZES = [15, 85];

const DataSourceConfigPanel = (state) => {
    let validatingIcon = "question circle";
    let previewText = "Validate Source";
    if (state.fetchingPreview) {
        previewText = "Validating Source...";
        validatingIcon = "hourglass half";
    }

    return <Form 
        className="dataSourceContainer" 
        >        
        <Toolbar 
            menuItems={menuItems}
        />
        <div className="dataSourceForm">
            <FormText key={'dataSourceFormUrl'}
                name={'dataSourceFormUrl'}
                label={'Data Source URL:'}
                placeholder={'For example: http://localhost:60000/'}
            ></FormText>

            <Button id={ID_VALIDATE_BTN} primary disabled={state.validatingSource}>
                <Icon name={validatingIcon}/>
            {previewText}</Button>

            <div className="ui message blue">TODO: should also allow the user to customize the metadata here, then send to server</div>
        </div>        
        </Form>
}

const DataSourcesListPanel = () => {
    return <div>DataSourcesListPanel (TODO)</div>
}

class DataSourceContent extends DesignerContentbase {

    constructor(props) {
        super(props);
        this.state = {
            validatingSource: false
        }
    }

    render() {
        return <NoobSplitter id="hierarchyDesigner" defaultSize={DEFAULT_SPLIT_SIZES}>
            {DataSourcesListPanel()}
            {DataSourceConfigPanel(this.state)}
        </NoobSplitter>    
    }
}

export default DataSourceContent;