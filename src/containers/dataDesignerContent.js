import React, {useState} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import NoobSplitter from '../components/noobSplitter';
import DesignerContentbase from './designerContentBase';
import Form, {Text as FormText, FormCheckbox, Dropdown as FormDropDown, FormTreeDropDown, FormRadio} from '../form/Form';
import ShowMessage, { NotifType } from '../helper/notification';
import Toolbar from '../components/toolbar';
import 'rc-tree-select/assets/index.css';
import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';
import {findNodeByKey} from '../helper/treefilter';
import _ from "lodash";

import './dataDesignerContent.css';

const DEFAULT_SPLIT_SIZES = [15, 85];
const defaultScope = 'self';

const DataListPanel = () => {
    return <div>
        Data List Panel (Under Construction)
    </div>
}

const menuItems = {
    'left': [
        {key:'datadesignertb_save', icon: 'save', text: 'Save', type:'submit'},
        {key:'datadesignertb_saveas', icon: 'save outline', text: 'Save As', type:'submit'},
    ],
};

/*
const getUniqueKpiLists = (kpiGrps) = {
    if (!kpiGrps) {
        return null;
    }

    let retObj = {
        groups: [],
        kpis: []
    };
    for (let i=0; i < kpiGrps.length; i++) {
        let currGrp = kpiGrps[i];
        if (!retObj.groups.includes(currGrp.kpiGroupName)) {
            retObj.groups.push(currGrp.kpiGroupName);
        }
        if (!retObj.kpis.includes(currGrp.kpiName)) {
            retObj.kpis.push(currGrp.kpiName);
        }
    }

    return retObj;
};
*/

const addUniqueToArray = (srcArray, destArray) => {
    if (!srcArray || !destArray) {
        return;
    }

    for (let i = 0; i < srcArray.length; i++) {
        if (destArray.includes(srcArray[i])) {
            continue;
        }
        destArray.push(srcArray[i]);
    }
}

const filterObj = (obj, fields) => {
    return _.pick(obj, fields);
}

const gatherKpiGroupOptions = (selectedNode, scope, hierarchyKpi, selectedKpiGroups) => {
    // If hierarchy is a target, just render all the KPI groups
    let retObj = {};
    if (!hierarchyKpi || !selectedNode) {
        return retObj;
    }
    console.log('renderKpiGroups', selectedNode, scope);
    
    if (scope === 'self') {
        let kpiGrps = hierarchyKpi[selectedNode.item.key] || [];
        let kpiGrpsFilteed = filterObj(kpiGrps, selectedKpiGroups);
        retObj.kpiGrps = Object.keys(kpiGrps);
        retObj.kpis = [].concat.apply([], Object.values(kpiGrpsFilteed).map(x => Object.values(x)));
    }
    else {
        // Gather all the uniq items from all its children (recursive)
        // Assume that the path is the basis for now
        retObj.kpiGrps = [];
        retObj.kpis = [];
        for (var key in hierarchyKpi) {
            
            if (key === selectedNode.item.key || !key.includes(selectedNode.item.key)) {
                continue;
            }
            debugger
            let kpiGrps = hierarchyKpi[key] || [];
            let kpiGrpsFilteed = filterObj(kpiGrps, selectedKpiGroups);
            let currKpiGrps = Object.keys(kpiGrps);
            let currKpis = [].concat.apply([], Object.values(kpiGrpsFilteed).map(x => Object.values(x)));
            addUniqueToArray(currKpiGrps, retObj.kpiGrps);
            addUniqueToArray(currKpis, retObj.kpis);
        }
    }

    return retObj;
}

/*
const renderKpiGroups = (selectedNode, scope, hierarchyKpi) => {
    // If hierarchy is a target, just render all the KPI groups
    if (!hierarchyKpi || !selectedNode) {
        return null;
    }
    console.log('renderKpiGroups', selectedNode, scope);
    
    if (scope === 'self') {
        let kpiGrps = hierarchyKpi[selectedNode.item.key] || [];
        console.log('renderKpiGroups', kpiGrps);
        let uniqKpiGrps = _.uniq(kpiGrps.map(x => x.kpiGroupName));
        let kpiGrpsOoptions = uniqKpiGrps.map(x => {
            return {
                key: 'dataDsgn_' + x,
                text: x,
                value: x
            }});
        
        return <FormDropDown name="hierDsgnKpiGroup" options={kpiGrpsOoptions} multiple/>
    }
    else {
        let allKpiGroups = [];
        // Gather all the uniq items from all its children (recursive)
        // Assume that the path is the basis for now
        for (var key in hierarchyKpi) {
            if (!key.includes(selectedNode.item.key)) {
                continue;
            }
            let kpiGrps = hierarchyKpi[key] || [];
            let uniqKpiGrps = _.uniq(kpiGrps.map(x => x.kpiGroupName));
            for (let i = 0; i < uniqKpiGrps.length; i++) {
                let currKpiGrp =  uniqKpiGrps[i];
                if (!allKpiGroups.includes(currKpiGrp)) { // add just the unique ones
                    allKpiGroups.push(currKpiGrp);
                }
            }
        }

        let kpiGrpsOoptions = allKpiGroups.map(x => {
            return {
                key: 'dataDsgn_' + x,
                text: x,
                value: x
            }});
        
        return <FormDropDown name="hierDsgnKpiGroup" options={kpiGrpsOoptions} multiple />
    }
}

const renderKpis = (hierarchyKpi, hierDsgnKpiGroup) => {
    // Find all the kpis from the selected kpi groups
    console.log('renderKpis', hierDsgnKpiGroup);
    let allKpis = [];
    hierDsgnKpiGroup.forEach( currGrp => {
        let kpis = hierarchyKpi[currGrp] || [];

        kpis.forEach(kpi => {
            allKpis.push({
                key: 'dataDsgnKpi_' + kpi.kpiName,
                text: kpi.kpiName,
                value: kpi.kpiName
            });    
        });

    });

    debugger
    return allKpis.map(x => <FormDropDown name="hierDsgnKpi" options={allKpis} multiple />)
}
*/

const renderDropdown = (name, listItems) => {
    let dropdownOpts = listItems ? listItems.map(x => {
        return {
        key: 'dataDsgn_' + name + '_' + x,
        text: x,
        value: x
    }}) : [];

    return <FormDropDown name={name} options={dropdownOpts} multiple/>;
}

const radioGroupContents = [
    {label: 'For selected Hierarchy node', name: 'rgrpHierScope', value: 'self', },
    {label: "For selected Hierarchy node's children", name: 'rgrpHierScope', value: 'children', }
];

const renderDataDesignerPanelContent = (props, state) => {
    let findSelNode = findNodeByKey(props.hierarchyConso, state.hierarchyTree);
    let selNodeIsFolder = !!findSelNode && findSelNode.item.unitType !== 'Target';    
    let kpiGroupOptions = gatherKpiGroupOptions(findSelNode, state.HierarchyScope, props.hierarchyKpi, state.hierDsgnKpiGroup);    

    return <div className="dataDesignerPanelContainer">
        <table className="formTable">
        <tbody>
            <tr>
                <th>Hierarchy*</th>
                <td>
                    <FormTreeDropDown name="hierarchyTree" treeData={props.hierarchyConso}/>
                    {selNodeIsFolder && <FormRadio name="HierarchyScope" initialSel={defaultScope} radioGroupContents={radioGroupContents}/>}
                </td>
            </tr>

            <tr>
                <th>Dimension</th>
                <td>
                <FormDropDown
                    name={'dataDsgnDimensions'}
                    label={null}
                    options={props.dimensions}    
                />
                </td>
            </tr>

            <tr>
                <th>Kpi Group</th>
                <td>
                    {/* {renderKpiGroups(findSelNode, state.HierarchyScope, props.hierarchyKpi)} */}
                    {renderDropdown('hierDsgnKpiGroup', kpiGroupOptions.kpiGrps)}
                </td>
            </tr>

            <tr>
                <th>Kpi</th>
                <td>
                    {/* {renderKpis(props.hierarchyKpi, state.hierDsgnKpiGroup)} */}
                    {renderDropdown('hierDsgnKpi', kpiGroupOptions.kpis)}
                </td>
            </tr>

        </tbody>
        </table>
    </div>
}

const onSubmit = (args) => {
    console.log('Date Designer Submit', args);
}

const DataDesignerForm = (props, containerWidth, state, setStateCb) => {
    return <Form 
        className="hierConfigPanelContainer" 
        key='formDataDesigner' 
        onSubmit={onSubmit} 
        setControlValues={setControlValues}
        watchedField={['hierarchyTree', 'HierarchyScope', 'hierDsgnKpiGroup']}
        // inputObj: set it to the loaded data source when saving is implemented
        inputObj={null} 
        setStateCb={setStateCb}
        >        
        <Toolbar 
            containerWidth={containerWidth}
            menuItems={menuItems}
        />
        {renderDataDesignerPanelContent(props, state)}
    </Form>
}

// Called when component mounts
// Purpose is to set the initial values
const setControlValues = (setValueFunc, inputObj) => {
    if (!inputObj) {
        return;
    }

    //setValueFunc('HierarchyScope', 'children');
    //setValueFunc('hierDsgnKpiGroup', []);
}

// This is where the user configures the datasources that can be linked to the controls
class DataDesignerContainer extends DesignerContentbase { 

    constructor(props) {
        super(props);
        this.state = {
            hierarchyTree: null,
            HierarchyScope: defaultScope,
            hierDsgnKpiGroup: [],       // The currently selected KPI Group
            ...this.state
        }
    }
    
    render() {
        console.log('render hierarchyDesigner', this.state.rightPixels);
        // TODO: Put a minsize first. Should make the toolbar buttons responsive.
        return <NoobSplitter id="hierarchyDesigner" onDragEnd={this.onSplitDragEnd} defaultSize={DEFAULT_SPLIT_SIZES} minSize={230}>
            {DataListPanel()}
            {DataDesignerForm(this.props, this.state.rightPixels, this.state, this.setState.bind(this))}
        </NoobSplitter>

    }
}

function mapStateToProps(state) {
    return {
        hierarchyConso: state.dataDesigner.hierarchyConso,
        dimensions: state.dataDesigner.dimensions,
        hierarchyKpi: state.dataDesigner.hierarchyKpi,
    }
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ }, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(DataDesignerContainer);