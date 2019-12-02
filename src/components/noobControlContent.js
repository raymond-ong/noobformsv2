import React from 'react';
import './noobForm.css'
// controls
import Section from '../controls/section';
import RichText from '../controls/richtext';
import Combobox from '../controls/combo';

import { useDrag } from 'react-dnd'

// Separate the content-part into a standalone component from the control wrapper
// Reason: this will be the only part that will be resized or moved while dragging (moving or resizing)
// We don't want to include the resizer or landing pads in the drag image

export const ControlDragTypes = {
    CONTROL: 'Control'
}

const getContentDiv = (controlData) => {
    // Wrap the contents so that when resizing or moving, they will be together
    // Also this should be floated. We don't want to resize or move the parent
    let content = null;
    switch(controlData.type) {
        case 'section':
            content = <Section {...controlData}></Section>
            break;
        case 'richtext':
            content = <RichText {...controlData}></RichText>
            break;
        case 'combo':
            content = <Combobox {...controlData}></Combobox>
            break;
        case undefined:
            content = <div className="emptyControl"></div>
            break
        default:
            //return <div>{controlData.i}</div>
            content = <div>{controlData.i}</div>
            break;
    }

    return content;
}

const NoobControlContent = (controlData) => {
    const [{ isDragging }, drag] = useDrag({
        item: { type: ControlDragTypes.CONTROL },
        canDrag: !!controlData.type, // Do not allow empty controls to be dragged
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
      });

    const styles = {
        opacity: isDragging? 0 : 1,
    };
    return <div className="contentWrapper" ref={drag} style={styles}>
        {getContentDiv(controlData)}
    </div>        
}

export default NoobControlContent;