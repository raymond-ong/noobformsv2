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
        <NoobControlContent {...controlData}></NoobControlContent>
        {renderResizer(controlData.i, resizerMouseDown)}
    </div>
}

export default NoobControl;