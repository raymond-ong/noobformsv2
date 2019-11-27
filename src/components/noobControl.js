import React, { Component } from 'react';
import NoobForm from './noobForm';
import { DragItemTypes } from './toolItem';
import { useDrop } from 'react-dnd';

// controls
import Section from '../controls/section';
import RichText from '../controls/richtext';
import Combobox from '../controls/combo';

const ROW_HEIGHT = 40;
const CONTROL_PADDING = 20;
const GRID_GAP = 5;

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
        default:
            //return <div>{controlData.i}</div>
            content = <div ></div>
            break;
    }

return <div className="contentWrapper">{content}</div>
}

const canDropMe = (controlData) => {
    // console.log('canDropMe', controlData);
    // Note: this function will be called for each mouse movement, so make sure this is efficient
    return !controlData.type;
}

const renderResizer = (controlId, onResizerMouseDown) => {
    return (<div 
            className="resizer" 
            id={"ctrlResizer" + controlId}
            onMouseDown={(e) => {                
                onResizerMouseDown(e, controlId);
            }}></div>
        );
}

const getBackColor = (isOver, canDrop) => {
    let backColor = 'white';
    if (isOver) {
        if (canDrop) {
            backColor = 'lime'
        }
        else {
            backColor = 'pink'
        }
    }

    return backColor;
}

const NoobControl = ({controlData, resizerMouseDown, resizingControlId}) => {

    // [a] Hooks setup for drop
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: DragItemTypes.TOOLITEM,
        canDrop: () => canDropMe(controlData),
        drop: () => console.log('dropped me @', controlData),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
		}),
      })

    // [b] Preparations
    let classNames = 'noobControl';

    let ctrlStyle = {
        // set the minHeight instead of height. Height will make the height fixed regardless of the content.
        // minHeight allows the parent container to grow depending on content
        'minHeight': (ROW_HEIGHT * controlData.h) + (CONTROL_PADDING * (controlData.h - 1)) + (GRID_GAP * (controlData.h - 1)), 
        'gridRowEnd': 'span ' + controlData.h,
        'gridColumnEnd': 'span ' + controlData.w,
        'backgroundColor': getBackColor(isOver, canDrop)
    };
    let contentDiv = getContentDiv(controlData)
    let domCtrlId = "ctrl"+controlData.i;
    
    // [c] Render:
    // [c.1] return the content first
    // [c.2] followed by the small resizer
    // [c.3] followed by the landing pad if the control is being resized
    return <div id={domCtrlId}
            className={classNames} 
            style={ctrlStyle}
            ref={drop}
            >
        {contentDiv}
        {renderResizer(controlData.i, resizerMouseDown)}
    </div>
}

export default NoobControl;