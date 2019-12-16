import React from 'react';
import { connect } from 'react-redux';
import './toolAvailableData.css';

const renderAvailableData = (items) => {
    if (!items) {
        return null;
    }
     
    return items.map( (item) => {
        //debugger
        return <div key={item.name} className="ui grey horizontal label large availableData" draggable="true">{item.name}</div>
    })
}

const GetAvailableItems = (node, masterAvailableData) => {
    let retList = [];
    if (!masterAvailableData || !node) {
        return retList;
    }
   
    // [1] Check if there is any hierarchy that matches
    let findMatchHierarchy = masterAvailableData.find(m => m.selectionType === 'HierarchyName' && m.hierarchy === node.fullPath);
    if (!!findMatchHierarchy) {
        retList = retList.concat(findMatchHierarchy.kpiNameList);    
    }
    

    // [2] Check Categories that match
    if (!!node.category) {
        let findMatchCategory = masterAvailableData.find(m => m.selectionType === 'Category' && m.category === node.category);
        if (!!findMatchCategory) {
            retList = retList.concat(findMatchCategory.kpiNameList);    
        }
    }

    // [3] Check Node Types that match
    if (!!node.nodeType) {
        let findMatchNodeType = masterAvailableData.find(m => m.selectionType === 'NodeType' && m.nodeType === node.nodeType);
        if (!!findMatchNodeType) {
            retList = retList.concat(findMatchNodeType.kpiNameList);  
        }
    }

    console.log('GetAvailableItems', retList);
    return retList.map(kpi => {return {name: kpi}});
}

const ToolAvailableData = (props) => {

    let {selectedNode} = props;
    if (!selectedNode) {
        return <div className="ui warning message">
            <i className="ui icon exclamation circle large"></i>
            Please select a target or folder from the Hierarchy tree above
        </div>
    }

    let availableItems = GetAvailableItems(selectedNode, props.masterAvailableData);
    return <div className="dataContainer">
        Showing Available Data for key: {selectedNode.fullPath}
        {renderAvailableData(availableItems)}
    </div>
}

function mapStateToProps(state) {
    return { 
        selectedNode: state.designer.toolPanelTreeSelected ,
        masterAvailableData: state.mainApp.masterAvailableData,
    };
}

//export default ToolAvailableData;
export default connect(mapStateToProps)(ToolAvailableData)