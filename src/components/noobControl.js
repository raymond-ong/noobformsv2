import React, { Component } from 'react';
import NoobForm from './noobForm';
import { ToolItemDragTypes } from './toolItem';
import { useDrop } from 'react-dnd';
import NoobControlContent, {ControlDragTypes} from './noobControlContent';
import LandingPads from './noobControlLandingPad';

import {connect} from 'react-redux';
import { bindActionCreators } from "redux";

import {selectedControl} from '../actions/index';
import EditDialog from './editDialog';


export const ROW_HEIGHT = 40;
const CONTROL_PADDING = 20;
const GRID_GAP = 5;


const handleControlSelect = (controlData) => {
    console.log('controlSelected, dispatch action...', this);
    selectedControl(controlData.i);
}

const canDropMe = (controlData, draggedItem, monitor, parentCheckDroppable) => {
    // Note: this function will be called for each mouse movement, so make sure this is efficient
    // But, unless there is a change in the value, there won't be a re-render.
    //console.log('canDropMe', controlData, draggedItem.type, draggedItem.minW, draggedItem.minH);
    if (!monitor.isOver({shallow: true})) {
        //console.log('canDropMe...not over...return false');
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
            }}
            onTouchStart={
                (e) => {  
                    // This event is being called first before the Drag on the control starts
                    // Call preventDefault to disable moving of the control
                    // Resizing is given a higher priority since it covers a very small area
                    onResizerMouseDown(e, controlId);
                    e.preventDefault();
                }
            }
            ></div>
        );
}

const NoobControl = ({controlData, resizerMouseDown, resizingControlId, 
                    parentCheckDroppable, parentDropCallback,
                    selectedControl, containerWidth, numCols}) => {
    
    // [a] Hooks setup for drop
    const [{ isOverShallow, canDrop, droppingItemType, droppingItem }, drop] = useDrop({
        accept: [ToolItemDragTypes.TOOLITEM, ControlDragTypes.CONTROL],
        canDrop: (item, monitor) => canDropMe(controlData, item, monitor, parentCheckDroppable),
        drop: (droppedItem) => parentDropCallback(controlData, droppedItem),
        collect: monitor => ({
            // these are the fields that will be added to the component's props/state
            // downside is that it needs to execute the function
            //isOver: !!monitor.isOver(),
            isOverShallow: !!monitor.isOver({ shallow: true }), // shallow: true means it will give way to landing pads (children)
            canDrop: !!monitor.canDrop(),
            // Add checking first. Without checking, once an item in toolbox starts dragging, all controls will rerender
            //droppingItemType: !!monitor.isOver() && !!monitor.canDrop() ? monitor.getItemType() : null
            droppingItemType: !!monitor.isOver() ? monitor.getItemType() : null,
            droppingItem: !!monitor.isOver() ? monitor.getItem() : null,
		}),
      });

    //console.log('render NoobControl', controlData.i, isOverShallow, canDrop, droppingItemType);
    //console.log('render NoobControl', controlData.i, controlData.x, controlData.y, controlData.w, controlData.h);
    

    // [b] Preparations
    let classNames = 'noobControl';
    let ctrlStyle = {
        // set the minHeight instead of height. Height will make the height fixed regardless of the content.
        // minHeight allows the parent container to grow depending on content
        //'minHeight': (ROW_HEIGHT * controlData.h) + (CONTROL_PADDING * (controlData.h - 1)) + (GRID_GAP * (controlData.h - 1)), 
        // Maybe no need to include padding and grid gap
        'minHeight': (ROW_HEIGHT * controlData.h), 
    }
    // [b1] - Normal desktop size layout
    if (numCols > 1) {
        let usableWidth = containerWidth-20; // 20 for the noobform left and right padding of 10 each
        let widthOfCtrl = usableWidth * controlData.w / 12.0 -5; // 12 is the number of columns; minus 5 for the grid gap
        ctrlStyle.gridRowEnd = 'span ' + controlData.h;
        ctrlStyle.gridColumnEnd = 'span ' + controlData.w;
        if (!document.URL.toLowerCase().endsWith('reporting')) {
            ctrlStyle.maxWidth = `${widthOfCtrl}px`; 
        }
    }
    // [b2] - Show as single column if containerWidth is null (if container size is too small, null is passed)
    else {
        ctrlStyle.maxWidth = `${containerWidth-20 - 5}px`; 
    }

    // Highlighting to green is handled in noobForm. Highlighting to pink is handled here because if !canDrop, the mouseUp event was prevented by React Dnd.
    if (isOverShallow && !canDrop) {
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

    console.log('render NoobControl', controlData.i, ctrlStyle.maxWidth, "containerWidth", containerWidth);
    
    // [c] Render:
    // [c.1] return the landing pad first, which is only shown when the control is being resized
    // [c.2] followed by the content
    // [c.3] followed by the placeholder which will only be visible during resizing. Purpose is maintain the original size of the container while resizing.
    // [c.4] followed by the small resizer.
    // [c.5] followed by the settings button
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
            droppingItem={droppingItem}
            noobControlCanDropCallback={(draggedItem, landingPadInfo) => {
                return parentCheckDroppable(controlData, draggedItem, landingPadInfo)
            }}
            noobControlDropCallback={(droppedItem, landingPadPos) => {
                parentDropCallback(controlData, droppedItem, landingPadPos)
            }}
        />
        <NoobControlContent 
            controlSelected={() => selectedControl(controlData.i)}            
            {...controlData} 
            maxWidth={ctrlStyle.maxWidth}
        />
        <div className="resizePlaceholder"></div>      
        {renderResizer(controlData.i, resizerMouseDown)}  
        {controlData.ctrlType && <EditDialog controlInfo={controlData}/>}                        
    </div>
}

const mapStateToProps = (state, ownProps) => {
    let myId = ownProps.controlData.i;
    let stateControlData = state.designer && state.designer.layout && state.designer.layout.find(control => control.i === myId);
    if (stateControlData) {
        return {
            //isSelected: stateControlData.selected
            controlData: stateControlData
        };    
    }

    return {};
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ selectedControl }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NoobControl);