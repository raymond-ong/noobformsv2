import React, { Component } from 'react';
import {ControlDragTypes} from './noobControlContent';
import { useDrop } from 'react-dnd';
import './noobForm.css';

const LandingPads = ({controlData, resizingControlId, droppingItemType, droppingItem, 
                    noobControlCanDropCallback, noobControlDropCallback}) => {
    // If this control is not resizing, no need to render the landing pads
    if (resizingControlId !== controlData.i && droppingItemType !== ControlDragTypes.CONTROL) {
        return null;
    }

    // If this control is not moving, no need to render the landing pads also
    // If dropping a control, and it's not the same as the dragged control, no need to render also
    if (droppingItemType === ControlDragTypes.CONTROL && controlData.i !== droppingItem.i) {
        return null
    }

    console.log('renderLandingPads for ', controlData);

    let landingPadStyle = {
        gridTemplateColumns: `repeat(${controlData.w}, 1fr)`,
        gridTemplateRows: `repeat(${controlData.h}, 1fr)`,
    }

    return (<div className="landingPadContainer" style={landingPadStyle}>
        {createLandingPads(controlData, noobControlCanDropCallback, noobControlDropCallback)}
    </div>)
}

// Create a landing pad to allow the user to reduce the size of the control
//function createLandingPads(rowSpan, colSpan, domParentCtrlId, parentX, parentY) {
function createLandingPads(controlData, noobControlCanDropCallback, noobControlDropCallback) {    
    let retList = [];
    for (let i=0; i < controlData.h; i++) {
        for (let j=0; j < controlData.w; j++) {
            let layoutPos = {
                'data-layoutx': j + controlData.x,
                'data-layouty': i + controlData.y,
            }
            retList.push(<LandingPad 
                domParentCtrlId={'ctrl'+controlData.i}
                layoutPos={layoutPos}
                key={"landingpadcontainer"+(i * controlData.w + j)}
                keyLandingPad={"landingpad"+(i * controlData.w + j)}
                canDropParentCallback={noobControlCanDropCallback}
                dropParentCallback={noobControlDropCallback}
            />);
        }
    }

    return retList;
}

const canDropInLandingPad = (draggedItem, monitor, keyLandingPad, layoutPosIn, canDropCallback) => {
    // Note: this function will be called for each mouse movement, so make sure this is efficient
    // But, unless there is a change in the value, there won't be a re-render.
    //console.log('canDropMe', controlData, draggedItem.type, draggedItem.minW, draggedItem.minH);
    if (!monitor.isOver()) {
        return false;
    }

    let landingPadInfo = {
        key: keyLandingPad,
        layoutPos: layoutPosIn
    }

    return canDropCallback(draggedItem, landingPadInfo);
}

// need a try-catch because inside monitor.canDrop(), it is trying to find the DOM ID first
// however, the monitor function is still being fired even if the element is no longer rendered
// -> The landing pads are only rendered during resizing or moving.
//    No issue with resizing since everything is implemented manually
//    But for moving, the dom id is required by react-dnd
const canDropCollectHandler = (monitor, keyLandingPad) => {
    //console.log('[collect] canDrop for landingPad', keyLandingPad, 'already dropped:', monitor.didDrop());
    let retVal = false;
    try {
        return !!monitor.canDrop();
    }
    catch(ex) {
        console.log('[collect] canDrop landingPad exception for (note: this exception is expected)', keyLandingPad, 'exception:', ex.name, ex.message);
    }
    return false;
}

const LandingPad = ({domParentCtrlId, layoutPos, keyLandingPad, canDropParentCallback, dropParentCallback}) => {

    //console.log('render LandingPad for ', keyLandingPad);
    const [{ isOver, canDrop}, drop] = useDrop({
        accept: [ControlDragTypes.CONTROL],
        canDrop: (item, monitor) => canDropInLandingPad(item, monitor, keyLandingPad, layoutPos, canDropParentCallback),
        drop: (droppedItem) => dropParentCallback(droppedItem, layoutPos),
        collect: monitor => ({
            // these are the fields that will be added to the component's props/state
            // downside is that it needs to execute the function
            isOver: !!monitor.isOver({ shallow: true }),
            //canDrop: !!monitor.canDrop(),            
            canDrop: canDropCollectHandler(monitor, keyLandingPad),
		}),
    });

    const styles = {}        
    
    if (isOver) {
        if (!canDrop) {
            styles.backgroundColor = 'red';
        }
    }

    return <div className="landingPadCell" 
        parentctrlid={domParentCtrlId} 
        key={keyLandingPad}
        ref={drop}
        style={styles}
        {...layoutPos}>
    </div>
}

export default LandingPads;