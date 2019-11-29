import React, { Component } from 'react';
import NoobForm from './noobForm';
import { ToolItemDragTypes } from './toolItem';
import { useDrop } from 'react-dnd';
import NoobControlContent, {ControlDragTypes} from './noobControlContent';

const ROW_HEIGHT = 40;
const CONTROL_PADDING = 20;
const GRID_GAP = 5;

const canDropMe = (controlData) => {
    // console.log('canDropMe', controlData);
    // Note: this function will be called for each mouse movement, so make sure this is efficient
    // A. If it's a tool item, just check whether it's empty or not
    // B. [TODO] If it's a control, make sure their dimensions are the same

    return !controlData.type;
}

const renderResizer = (controlId, onResizerMouseDown) => {
    return (<div 
            className="resizer" 
            id={"ctrlResizer" + controlId}
            onMouseDown={(e) => {  
                // This event is being called first before the Drag on the control starts
                // Call preventDefault to disable moving of the control
                // Resizing is given a higher priority since it covers a very small area
                onResizerMouseDown(e, controlId);
                e.preventDefault();
            }}></div>
        );
}

const getBackColor = (isOver, canDrop) => {
    let backColor = 'white';
    if (isOver) {
        if (canDrop) {
            backColor = 'lightgreen'
        }
        else {
            backColor = 'pink'
        }
    }

    return backColor;
}

const renderLandingPads = (controlData, resizingControlId) => {
    // if this control is not resizing, no need to render the landing pads
    if (resizingControlId !== controlData.i) {
        return null;
    }

    let landingPadStyle = {
        gridTemplateColumns: `repeat(${controlData.w}, 1fr)`,
        gridTemplateRows: `repeat(${controlData.h}, 1fr)`,
    }

    return (<div className="landingPadContainer" style={landingPadStyle}>
        {createLandingPads(controlData.h, controlData.w, 'ctrl'+controlData.i, controlData.x, controlData.y)}
    </div>)
}

// Create a landing pad to allow the user to reduce the size of the control
function createLandingPads(rowSpan, colSpan, domParentCtrlId, parentX, parentY) {
    let retList = [];
    for (let i=0; i < rowSpan; i++) {
        for (let j=0; j < colSpan; j++) {
            let layoutPos = {
                'data-layoutx': j + parentX,
                'data-layouty': i + parentY,
            }
            retList.push(<div className="landingPadCell" 
                            parentctrlid={domParentCtrlId} 
                            key={"landingPad"+(i * colSpan + j)}
                            {...layoutPos}></div>);
        }
    }

    return retList;
}

const NoobControl = ({controlData, resizerMouseDown, resizingControlId}) => {

    // [a] Hooks setup for drop
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: [ToolItemDragTypes.TOOLITEM, ControlDragTypes.CONTROL],
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

    // access these in Javascript by x.dataset.layoutx (Note: lowercase)
    // Purpose: convenience when processing resize operations
    let layoutPos = {
        'data-layoutx': controlData.x,
        'data-layouty': controlData.y,
        'data-layouth': controlData.h,
        'data-layoutw': controlData.w,
        'data-controlType': controlData.type,
    }
    let domCtrlId = "ctrl"+controlData.i;
    
    // [c] Render:
    // [c.1] return the landing pad first, which is only shown when the control is being resized
    // [c.2] followed by the content
    // [c.3] followed by the small resizer.
    //       This order must be followed to avoid the need for z-index
    return <div id={domCtrlId}
            className={classNames} 
            style={ctrlStyle}
            ref={drop}
            {...layoutPos}
            >
        {renderLandingPads(controlData, resizingControlId)}
        <NoobControlContent {...controlData}></NoobControlContent>
        {renderResizer(controlData.i, resizerMouseDown)}        
    </div>
}

export default NoobControl;