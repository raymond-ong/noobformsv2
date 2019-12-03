import React from 'react';
import "../styles/ToolBox.css";
import 'react-grid-layout/css/styles.css';

//import {connect} from 'react-redux';
//import { bindActionCreators } from "redux";
import {toolItemDragged} from '../actions/index';

import { useDrag } from 'react-dnd';
import ShowMessage, {NotifType} from '../helper/notification';

export const ToolItemDragTypes = {
    TOOLITEM: 'toolItem'
}


let onDragStart = (e) => {
    console.log("onDragStart!");
    // temporary code: we tell redux that this item started dragging.
    // This code will not be needed once react-grid-layout code has been updated to pass the mouse event in the onDrop function
}

/* Original function, without using React-dnd
const toolItem = (props) => {
    let iconClass = `icon ${props.controlType.icon}`
    return <div className="toolItem droppable-element" draggable={true} unselectable="on" 
            onDragStart={(e) => props.toolItemDragged(props.controlType)}>
        <i className={iconClass}></i>
        {props.controlType.displayName}
    </div>
}
*/

const handleEndDrag = (item, monitor) => {
    if (monitor.didDrop()) {
        return;
    }

    ShowMessage('Control was not added', 
    NotifType.info, 
    'Please drop the control into an empty cell, or make sure there is sufficient space for larger controls')
}

const ToolItem = (props) => {

    const [{ isDragging }, drag] = useDrag({
        item: {
            type: ToolItemDragTypes.TOOLITEM,
            minW: props.controlType.minW,
            minH: props.controlType.minH,
            toolItemTypeName: props.controlType.name
        },
        end: (item, monitor) => handleEndDrag(item, monitor),
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
      })

    let iconClass = `icon ${props.controlType.icon}`
    return <div className="toolItem" ref={drag} style={{
        backgroundColor: isDragging ? 'lightblue' : '#cacaca',
      }}>
        <i className={iconClass}></i>
        {props.controlType.displayName}
    </div>
}

// const mapDispatchToProps = dispatch => {
//     return bindActionCreators({ toolItemDragged }, dispatch);
// }

//export default toolItem;
//export default connect(null, mapDispatchToProps)(toolItem);
export default ToolItem;