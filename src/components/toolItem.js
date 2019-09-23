import React from 'react';
import "../styles/ToolBox.css";

const toolItem = (props) => {
    let iconClass = `icon ${props.controlType.icon}`
    return <div className="toolItem">
        <i className={iconClass}></i>
        {props.controlType.displayName}
    </div>
}

export default toolItem;