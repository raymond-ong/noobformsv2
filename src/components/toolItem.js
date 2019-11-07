import React from 'react';
import "../styles/ToolBox.css";
import 'react-grid-layout/css/styles.css';

const toolItem = (props) => {
    let iconClass = `icon ${props.controlType.icon}`
    return <div className="toolItem droppable-element" draggable={true} unselectable="on">
        <i className={iconClass}></i>
        {props.controlType.displayName}
    </div>
}

export default toolItem;