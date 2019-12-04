import React, { Component } from 'react';
import {ControlDragTypes} from './noobControlContent';
import { useDrop } from 'react-dnd';
import './noobForm.css';

const LandingPads = ({controlData, resizingControlId, droppingItemType}) => {
    //if this control is not resizing, no need to render the landing pads
    if (resizingControlId !== controlData.i && droppingItemType !== ControlDragTypes.CONTROL) {
        return null;
    }

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
            // retList.push(<div className="landingPadCell" 
            //                 parentctrlid={domParentCtrlId} 
            //                 key={"landingPad"+(i * colSpan + j)}
            //                 {...layoutPos}></div>);
            retList.push(<LandingPad 
                domParentCtrlId={domParentCtrlId}
                layoutPos={layoutPos}
                key={"landingpadcontainer"+(i * colSpan + j)}
                keyIn={"landingpad"+(i * colSpan + j)}
            />);
        }
    }

    return retList;
}

const canDropInLandingPad = (draggedItem, monitor) => {
    // Note: this function will be called for each mouse movement, so make sure this is efficient
    // But, unless there is a change in the value, there won't be a re-render.
    //console.log('canDropMe', controlData, draggedItem.type, draggedItem.minW, draggedItem.minH);
    if (!monitor.isOver()) {
        return false;
    }

    return true;
}

const LandingPad = ({domParentCtrlId, layoutPos, keyIn}) => {

    console.log('render LandingPad for ', keyIn);
    const [{ isOver, canDrop}, drop] = useDrop({
        accept: [ControlDragTypes.CONTROL],
        canDrop: (item, monitor) => canDropInLandingPad(item, monitor),
        drop: (droppedItem) => {console.log('dropped at landing pad', keyIn)},
        collect: monitor => ({
            // these are the fields that will be added to the component's props/state
            // downside is that it needs to execute the function
            isOver: !!monitor.isOver({ shallow: true }),
            canDrop: !!monitor.canDrop(),
		}),
    });

    const styles = {}        
    
    if (isOver) {
        styles.backgroundColor = 'cyan';
    }

    return <div className="landingPadCell" 
        parentctrlid={domParentCtrlId} 
        key={keyIn}
        ref={drop}
        style={styles}
        {...layoutPos}>
    </div>
}

export default LandingPads;