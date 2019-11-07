import React from 'react';
import NoobSplitter from './noobSplitter';
import ToolPanel from './toolPanel';
import DesignerForm from './designerForm';


const designerContent = () => {
    console.log('render designerContent');
    return <NoobSplitter id="designerPanel">
        <ToolPanel/>
        <DesignerForm/>
    </NoobSplitter>
}

export default designerContent;