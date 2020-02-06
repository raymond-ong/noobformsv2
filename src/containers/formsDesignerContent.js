import React from 'react';
import { bindActionCreators } from "redux";
import NoobSplitter from '../components/noobSplitter';
import ToolPanel from '../components/toolPanel';
import DesignerForm from '../components/designerForm';
import DesignerContentbase from './designerContentBase';
//import DesignerToolbar from '../components/designerToolbar';
import Toolbar from '../components/toolbar';
import NoobForm from '../components/noobForm';
import './designerCommon.css';
import {saveLayout} from '../actions';
import ShowMessage, {NotifType} from '../helper/notification';

import {connect} from 'react-redux';
import SaveAsDialog from '../components/saveAs';

const DEFAULT_SPLIT_SIZES = [30, 70];

const panelItems = [
    {
        title: 'Toolbox',
        id: 'toolbox',
        isCollapsed: false,
        size: 0,
        helpText: 'Drag an item to the Designer Area'
    },
    {
        title: 'Properties',
        id: 'properties',
        isCollapsed: false,
        size: 0,
        helpText: 'Please select an item from the Designer Area to view the properties'
    },
]


class formsDesignerContent extends DesignerContentbase {
    constructor(props) {
        super(props);
        this.defaultSizes = DEFAULT_SPLIT_SIZES;
        this.menuItems = {
            'left': [
                {key:'designertb_save', icon: 'save', text: 'Save', callback: this.saveCallback},
                {key:'designertb_saveas', icon: 'save outline', text: 'Save As...', callback: this.saveAsCallback},
                {key:'designertb_open', icon: 'open folder outline', text: 'Open...', callback: this.openCallback},
            ],
            'right': [
                {key:'designertb_preview', icon: 'eye', text: 'Hold to Preview', disabled: true},
            ]
        }

        this.state = {
            ...this.state,
            showSaveForm: false
        }
    }

    saveCallback = () => {
        console.log('Save callback');
        // If untitled, call Save As callback
        if (!this.props.layoutData.name) {
            this.saveAsCallback();
        }
        else {
            this.handleSave();
        }
    }
    
    saveAsCallback = () => {
        console.log('Save As callback');
        // Popup the dialog to ask user to input name
        this.setState({
            showSaveForm: true
        })        
    }

    handleSave = async (layoutName) => {
        console.log('Save the layout...', layoutName);
        let result = await this.props.saveLayout(this.props.layout, layoutName, this.props.layoutData); // dispatch redux action
        if (result === true) {
            ShowMessage("Layout Saved!");
        }
        else {
            ShowMessage("Failed to Save Layout!", NotifType.danger, result.message);
        }
        this.handleCloseSave();
    }

    handleCloseSave = () => {
        console.log('handleCloseSave');
        if (this.state.showSaveForm) {
            this.setState({
                showSaveForm: false
            })
        }
    }
    
    openCallback = () => {
        console.log('Open callback');
    }    
    
    render() {
        console.log('render designerContent', this.state.leftPixels);
        return <NoobSplitter id="designerPanel" onDragEnd={this.onSplitDragEnd} defaultSize={DEFAULT_SPLIT_SIZES}>
            <ToolPanel panelItems={panelItems} containerWidth={this.state.leftPixels}/>
            <div id="rightContainer" className="designerContainer">
                {/* <DesignerToolbar containerWidth={this.state.rightPixels}/> */}
                <Toolbar 
                    containerWidth={this.state.rightPixels}
                    menuItems={this.menuItems}
                    title={"Untitled"}
                    titleTooltip={"Form is not yet saved"}
                />
                <div className="layoutEditorContainer">
                    <NoobForm 
                        containerWidth={this.state.rightPixels}
                        layoutData={this.props.layoutData}
                        controls={this.props.layout}/>
                </div>
                <SaveAsDialog showSaveForm={this.state.showSaveForm}
                            title={"Save Layout"}
                            formLabel={"Layout name:"}
                            onSave={this.handleSave}
                            onClose={this.handleCloseSave}
                />
            </div>
        </NoobSplitter>
    }
}

const mapStateToProps = (state) => {
    return {
        layout: state.designer.layout,
        layoutData: state.designer.layoutData,
        metadata: state.designer.metadata
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ saveLayout }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(formsDesignerContent);