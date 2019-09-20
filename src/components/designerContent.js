import React from 'react';
import NoobSplitter from './noobSplitter';
import ToolPanel from './toolPanel';


const designerContent = () => {
    console.log('render designerContent');
    return <NoobSplitter id="designerPanel">
        <ToolPanel/>
    </NoobSplitter>
}

export default designerContent;