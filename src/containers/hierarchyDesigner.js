import React from 'react';
import NoobSplitter from '../components/noobSplitter';
import DesignerContentbase from './designerContentBase';
import HierarchyDesignerTree from './hierearchyTree';
import HierarchyToolbar from '../components/hierDesignerToolbar';

import './hierarchyTree.css'; //temp only
import './hierarchyDesigner.css';

const ToolbarPanel = ({title, panelContent}) => {
    //console.log('[render] AccordionPanel, id: ', id);
    return <div className="toolbarPanel">        
        <div className="toolbarContainer">
            <HierarchyToolbar/>
        </div>
        <div className="toolbarPanelBody">
            {panelContent}
        </div>
    </div>;
}

class HierarchyDesigner extends DesignerContentbase { 
    
    render() {
        console.log('render hierarchyDesigner', this.state.leftPixels);
        return <NoobSplitter id="hierarchyDesigner" onDragEnd={this.onSplitDragEnd}>
            {/* <div>
                <HierarchyToolbar containerWidth={this.state.leftPixels}/>
                <HierarchyDesignerTree/>
            </div> */}            
            <ToolbarPanel 
                title="Hello" 
                panelContent={<HierarchyDesignerTree/>}
            />
            <div>Right</div>
        </NoobSplitter>

    }
}

export default HierarchyDesigner;