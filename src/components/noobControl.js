import React, { Component } from 'react';
import NoobForm from './noobForm';
import { ToolItemDragTypes } from './toolItem';
import { useDrop } from 'react-dnd';
import NoobControlContent, {ControlDragTypes} from './noobControlContent';
import LandingPads from './noobControlLandingPad';

const ROW_HEIGHT = 40;
const CONTROL_PADDING = 20;
const GRID_GAP = 5;

const canDropMe = (controlData, draggedItem, monitor, parentCheckDroppable) => {
    // Note: this function will be called for each mouse movement, so make sure this is efficient
    // But, unless there is a change in the value, there won't be a re-render.
    //console.log('canDropMe', controlData, draggedItem.type, draggedItem.minW, draggedItem.minH);
    if (!monitor.isOver()) {
        return false;
    }
    //console.log('canDropMe', controlData, draggedItem.type, monitor.isOver());
    let canDrop = parentCheckDroppable(controlData, draggedItem);
    return canDrop;
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

/*
const renderLandingPads = (controlData, resizingControlId, droppingItemType) => {
    // if this control is not resizing, no need to render the landing pads
    // if (resizingControlId !== controlData.i && droppingItemType !== ControlDragTypes.CONTROL) {
    //     return null;
    // }

    console.log('renderLandingPads for ', controlData);

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
*/

const NoobControl = ({controlData, resizerMouseDown, resizingControlId, 
                    parentCheckDroppable, parentDropCallback}) => {
    
    // [a] Hooks setup for drop
    const [{ isOver, canDrop, droppingItemType }, drop] = useDrop({
        accept: [ToolItemDragTypes.TOOLITEM, ControlDragTypes.CONTROL],
        canDrop: (item, monitor) => canDropMe(controlData, item, monitor, parentCheckDroppable),
        drop: (droppedItem) => parentDropCallback(controlData, droppedItem),
        collect: monitor => ({
            // these are the fields that will be added to the component's props/state
            // downside is that it needs to execute the function
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
            // Add checking first. Without checking, once an item in toolbox starts dragging, all controls will rerender
            droppingItemType: !!monitor.isOver() && !!monitor.canDrop() ? monitor.getItemType() : null
		}),
      })

    console.log('render NoobControl', controlData.i, isOver, canDrop, droppingItemType);

    // [b] Preparations
    let classNames = 'noobControl';
    let ctrlStyle = {
        // set the minHeight instead of height. Height will make the height fixed regardless of the content.
        // minHeight allows the parent container to grow depending on content
        //'minHeight': (ROW_HEIGHT * controlData.h) + (CONTROL_PADDING * (controlData.h - 1)) + (GRID_GAP * (controlData.h - 1)), 
        // Maybe no need to include padding and grid gap
        'minHeight': (ROW_HEIGHT * controlData.h), 
        'gridRowEnd': 'span ' + controlData.h,
        'gridColumnEnd': 'span ' + controlData.w,        
    };
    // Highlighting to green is handled in noobForm. Highlighting to pink is handled here because if !canDrop, the mouseUp event was prevented by React Dnd.
    if (isOver && !canDrop) {
        ctrlStyle.backgroundColor = 'pink';
    }

    // access these in Javascript by x.dataset.layoutx (Note: all lowercase - javascript/html rule)
    // Purpose: convenience when processing resize operations
    let layoutPos = {
        'data-layoutx': controlData.x,
        'data-layouty': controlData.y,
        'data-layouth': controlData.h,
        'data-layoutw': controlData.w,
        'data-controltype': controlData.ctrlType,
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
            onMouseUp={() => {console.log('onMouseUp control level')}}
            {...layoutPos}
            >
        {/* {renderLandingPads(controlData, resizingControlId, droppingItemType)} */}
        <LandingPads 
            controlData={controlData}
            resizingControlId={resizingControlId}
            droppingItemType={droppingItemType}
        />
        <NoobControlContent {...controlData}></NoobControlContent>
        {renderResizer(controlData.i, resizerMouseDown)}        
    </div>
}

export default NoobControl;