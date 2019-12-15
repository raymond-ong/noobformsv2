import React from 'react';
import NoobSplitter from '../components/noobSplitter';
import ToolPanel from '../components/toolPanel';
import DesignerForm from '../components/designerForm';
import DesignerContentbase from './designerContentBase';
import DesignerToolbar from '../components/designerToolbar';
import NoobForm from '../components/noobForm';

import {connect} from 'react-redux';

const DEFAULT_SPLIT_SIZES = [15, 85];

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
    }
    
    render() {
        console.log('render designerContent', this.state.leftPixels);
        return <NoobSplitter id="designerPanel" onDragEnd={this.onSplitDragEnd}>
            <ToolPanel panelItems={panelItems} containerWidth={this.state.leftPixels}/>
            <div>
                <DesignerToolbar containerWidth={this.state.rightPixels}/>
                {/* <DesignerForm 
                    containerWidth={this.state.rightPixels}
                    initialLayout={generateDefaultLayout()}/> */}
                <NoobForm 
                    containerWidth={this.state.rightPixels}
                    layoutData={this.props.layoutData}
                    controls={this.props.layout}/>
            </div>
        </NoobSplitter>
    }
}

const mapStateToProps = (state) => {
    return {
        layout: state.designer.layout,
        layoutData: state.designer.layoutData,
    };
}

export default connect(mapStateToProps)(formsDesignerContent);