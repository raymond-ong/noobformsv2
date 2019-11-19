import React from 'react';
import NoobSplitter from '../components/noobSplitter';
import ToolPanel from '../components/toolPanel';
import DesignerForm from '../components/designerForm';
import DesignerContentbase from './designerContentBase';
import DesignerToolbar from '../components/designerToolbar';

const DEFAULT_SPLIT_SIZES = [15, 85];

class formsDesignerContent extends DesignerContentbase {
    constructor(props) {
        super(props);
        this.defaultSizes = DEFAULT_SPLIT_SIZES;
    }
    
    render() {
        console.log('render designerContent');
        return <NoobSplitter id="designerPanel" onDragEnd={this.onSplitDragEnd}>
            <ToolPanel/>
            <div>
                <DesignerToolbar containerWidth={this.state.rightPixels}/>
                <DesignerForm containerWidth={this.state.rightPixels}/>
            </div>
        </NoobSplitter>
    }
}

export default formsDesignerContent;