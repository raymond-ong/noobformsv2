import React from 'react';
import { connect } from 'react-redux';
import './toolAvailableData.css';

const renderAvailableData = (items) => {
    if (!items) {
        return null;
    }
     
    return items.map( (item) => {
        return <div className="ui grey horizontal label large availableData" draggable="true">{item.name}</div>
    })
}

const GetAvailableItems = (key) => {
    return [
        {
            name: "Plant Overall Score"
        },
        {
            name: "Plant Overall Efficiency"
        },
        {
            name: "Top 10 Worst Actors"
        },
        {
            name: "Overall Score per Area"
        },
    ]
}

const ToolAvailableData = (props) => {

    let {selectedNode} = props;
    let availableItems = GetAvailableItems(selectedNode);
    if (!selectedNode) {
        return <div className="ui warning message">
            <i className="ui icon exclamation circle large"></i>
            Please select a target or folder from the Hierarchy tree above
        </div>
    }

    return <div className="dataContainer">
        Showing Available Data for key: {selectedNode}
        {renderAvailableData(availableItems)}
    </div>
}

function mapStateToProps(state) {
    return { selectedNode: state.designer.toolPanelTreeSelected };
}

//export default ToolAvailableData;
export default connect(mapStateToProps)(ToolAvailableData)