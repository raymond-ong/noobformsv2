import React from 'react';
import NoobSplitter from './noobSplitter';
import ToolPanel from './toolPanel';
import DesignerForm from './designerForm';

const DEFAULT_SPLIT_SIZES = [15, 85];

class designerContent extends React.Component {
    
    // TODO: Listen to window resizing events also (not just split drag)
    // call setState()
    constructor(props) {
        super(props);
        this.state = {
            rightPixels: DEFAULT_SPLIT_SIZES[1] * window.innerWidth / 100.0,
        };
    }

    onSplitDragEnd = (sizes) => {
        let rightPixels = sizes[1] / 100.0 * window.innerWidth;    
        console.log('onSplitDragEnd designerContent callback');   
        // if there are differences, call setState. We minimize rerenders
        this.setState({
            rightPixels: rightPixels
        });
    }

    render() {
        console.log('render designerContent');
        return <NoobSplitter id="designerPanel" onDragEnd={this.onSplitDragEnd}>
            <ToolPanel/>
            <DesignerForm containerWidth={this.state.rightPixels}/>
        </NoobSplitter>
    }
}

export default designerContent;