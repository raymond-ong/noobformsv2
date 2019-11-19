import React from 'react';
import NoobSplitter from '../components/noobSplitter';
import ToolPanel from '../components/toolPanel';
import DesignerForm from '../components/designerForm';
import DesignerContentbase from './designerContentBase';

const DEFAULT_SPLIT_SIZES = [15, 85];

const initialLayout = [
    {i: 'a', x: 0, y: 2, w: 4, h: 10},
    {i: 'b', x: 4, y: 2, w: 4, h: 10},
    {i: 'c', x: 0, y: 0, w: 12, h: 2},
    {i: 'd', x: 8, y: 2, w: 4, h: 10},
];

class dashboardDesignerContent extends DesignerContentbase {
    
    constructor(props) {
        super(props);
        this.defaultSizes = DEFAULT_SPLIT_SIZES;
    }

    render() {
        console.log('render designerContent');
        return <NoobSplitter id="designerPanel" onDragEnd={this.onSplitDragEnd}>
            <ToolPanel/>
            <DesignerForm containerWidth={this.state.rightPixels}/>
        </NoobSplitter>
    }
}

export default dashboardDesignerContent;