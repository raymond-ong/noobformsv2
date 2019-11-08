import React from 'react';
import "../styles/ToolBox.css";
import 'react-grid-layout/css/styles.css';

import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import {toolItemDragged} from '../actions/index';


let onDragStart = (e) => {
    console.log("onDragStart!");
    // temporary code: we tell redux that this item started dragging.
    // This code will not be needed once react-grid-layout code has been updated to pass the mouse event in the onDrop function
}

const toolItem = (props) => {
    let iconClass = `icon ${props.controlType.icon}`
    return <div className="toolItem droppable-element" draggable={true} unselectable="on" 
            onDragStart={(e) => props.toolItemDragged(props.controlType)}>
        <i className={iconClass}></i>
        {props.controlType.displayName}
    </div>
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ toolItemDragged }, dispatch);
}

//export default toolItem;
export default connect(null, mapDispatchToProps)(toolItem);