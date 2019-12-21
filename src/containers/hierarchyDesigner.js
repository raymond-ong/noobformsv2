import React from 'react';
import NoobSplitter from '../components/noobSplitter';
import DesignerContentbase from './designerContentBase';
import HierarchyDesignerTree from './hierearchyTree';
import HierarchyToolbar from '../components/hierDesignerToolbar';

import './hierarchyTree.css'; //temp only

class HierarchyDesigner extends DesignerContentbase { 
    
    render() {
        console.log('render hierarchyDesigner', this.state.leftPixels);
        return <NoobSplitter id="hierarchyDesigner" onDragEnd={this.onSplitDragEnd}>
            <div>
                <HierarchyToolbar containerWidth={this.state.leftPixels}/>
                <HierarchyDesignerTree/>
            </div>
            <div>Right</div>
        </NoobSplitter>

    }
}

export default HierarchyDesigner;