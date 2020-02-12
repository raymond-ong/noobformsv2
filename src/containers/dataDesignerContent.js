import React, {useState} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import NoobSplitter from '../components/noobSplitter';
import DesignerContentbase from './designerContentBase';
import Form, {Text as FormText, FormCheckbox, Dropdown as FormDropDown, FormTreeDropDown, FormRadio} from '../form/Form';
import { Form as SemanticForm, Segment} from "semantic-ui-react";
import ShowMessage, { NotifType } from '../helper/notification';
import Toolbar from '../components/toolbar';
import 'rc-tree-select/assets/index.css';
import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';
import {findNodeByKey} from '../helper/treefilter';
import _ from "lodash";
import {Button, Icon, Label} from 'semantic-ui-react';

import './dataDesignerContent.css';

const DEFAULT_SPLIT_SIZES = [15, 85];
const defaultScope = 'self';
const ID_PREVIEW_BTN = 'dataDsgnPreview';

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

const addSelectedKpisToArray = (srcArray, destArray) => {
    if (!srcArray || !destArray) {
        return;
    }

    for (let i = 0; i < srcArray.length; i++) {
        let currKpiGrp = srcArray[i];
        
        let findGrpQry = destArray.find(x => x.kpiGrp === currKpiGrp.kpiGrp);
        if (!findGrpQry) {
            destArray.push(currKpiGrp);
            continue;
        }

        // If we find the group, check if it contains all KPI's
        // Note: Do not assume all groups with same name necessarily have same set of KPI's
        for (let j = 0; j < currKpiGrp.kpis.length; j++) {
            if (!findGrpQry.kpis.includes(currKpiGrp.kpis[j])) {
                findGrpQry.kpis.push(currKpiGrp.kpis[j]);
            }
        }        
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
        let kpiGrpsFiltered = filterObj(kpiGrps, selectedKpiGroups); // We only add the KPI's that belong to the selected KPI Groups
        retObj.kpiGrps = Object.keys(kpiGrps);

        retObj.kpis = getKpiObjects(kpiGrpsFiltered);
        //retObj.kpis = [].concat.apply([], Object.values(kpiGrpsFiltered).map(x => Object.values(x)));
    }
    else {
        // Gather all the uniq items from all its children (recursive)
        // Assume that the path is the basis for now
        retObj.kpiGrps = []; // All KPI Groups belonging to the hierarchy
        retObj.kpis = []; // All KPI's belonging to the selected KPI groups only
        for (var key in hierarchyKpi) {
            
            if (key === selectedNode.item.key || !key.includes(selectedNode.item.key)) {
                continue;
            }
            let kpiGrps = hierarchyKpi[key] || [];
            let currKpiGrps = Object.keys(kpiGrps);
            
            addUniqueToArray(currKpiGrps, retObj.kpiGrps);
            
            let kpiGrpsFiltered = filterObj(kpiGrps, selectedKpiGroups);
            let currKpis = getKpiObjects(kpiGrpsFiltered);
            addSelectedKpisToArray(currKpis, retObj.kpis);

            // let currKpis = [].concat.apply([], Object.values(kpiGrpsFiltered).map(x => Object.values(x)));
            // addUniqueToArray(currKpis, retObj.kpis);
        }
    }

    return retObj;
}

// KPI's belonging to different KPI groups may have the same name
// e.g. "Time in Control" can be from "Loop Controllability" or "Valve Controllability"
// To differentiate, we include the KPI Group also.
const getKpiObjects = (kpiGroups) => {
    if (!kpiGroups) {
        return null;
    }

    let retList = [];
    for (let kpiGrp in kpiGroups) {
        if (!kpiGroups.hasOwnProperty(kpiGrp)) {
            continue;
        }

        retList.push({
            kpiGrp: kpiGrp,
            kpis: kpiGroups[kpiGrp]
        });        
    }

    return retList;
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

const renderPreviewTable = () => {

}

// converts the dimensions from metadata into a format the tree-select component expects
const convertApiMetadataDims = (apiMetadataDims, parent=null) => {
    if (!apiMetadataDims) {
        return null;
    }

    return apiMetadataDims.map(x => {
        let {name, items, ...rest} = x;
        return {
            name: parent ? `${parent.name}.${name}` : name,
            value: parent ? `${parent.name}.${name}` : name,
            title: name,
            children: convertApiMetadataDims(items, x),
            ...rest
        }
    });
}

const convertApiMetadataFilters = (apiMetadata) => {
    // Basically, add the Request Params to the front (e.g. )
    let metadataDims = convertApiMetadataDims(apiMetadata.Dimensions);
    // Assume request params is single level only
    let requestItems = apiMetadata.RequestParams.map(r => {
        let {name, ...rest} = r;
        return {
            name: name,
            value: name,
            title: name,
            children: [],
            ...rest
        }
    });
    metadataDims.unshift(...requestItems);    
    return metadataDims;
}

const onTreeSelect = (value, node, extra) => {
    // TODO:
    // [1] If the parent node is selected, unselect all child nodes (implicitly, all child nodes are already included)
}

const renderFilterFields = (state, props) => {
    if (!state || !state.filterFields) {
        return null;
    }

    let filterFields = state.filterFields.map((filter, i) => <div className="filterRow" key={"filterField" + i}>
        <SemanticForm.Field className="filterField">
            <FormTreeDropDown 
                name={"filterField" + i}
                treeData={props.filtersMetadata} 
                isRequired={true}
                label={"Field Name"}                     
            />
        </SemanticForm.Field>
        <SemanticForm.Field className="filterField">
            <FormText
                label={"Filter Value"}
                small
            />
        </SemanticForm.Field>
        <SemanticForm.Field className="filterFieldAligner">
            <Button type="button" className="filterFieldBtn">Delete</Button>
        </SemanticForm.Field>
    </div>);

    return <div className="filterTable">{filterFields}
        </div>
}

const renderFilterSegment = (state, props) => {
    return <Segment><SemanticForm.Field>
        <div className="segmentTitle">Filters:</div>
        {renderFilterFields(state, props)}
        <Button type="button">Add Filter</Button>
    </SemanticForm.Field>
    </Segment>
}

const renderDataDesignerPanelContent = (props, state, errors) => {
    let findSelNode = findNodeByKey(props.hierarchyConso, state.hierarchyTree);
    //let selNodeIsFolder = !!findSelNode && findSelNode.item.unitType !== 'Target';    
    //let kpiGroupOptions = gatherKpiGroupOptions(findSelNode, state.HierarchyScope, props.hierarchyKpi, state.hierDsgnKpiGroup);    

    let previewIcon = "eye";
    let previewText = "Preview Data";
    if (state.fetchingPreview) {
        previewText = "Fetching Preview Data...";
        previewIcon = "hourglass half";
    }

    return <div className="dataDesignerPanelContainer">
        <Segment>
        <div className="segmentTitle">Data Source</div>
        <FormDropDown 
            // label="Select Dimensions:"
            name="dataSource" 
            isRequired={true} 
            onSelect={onTreeSelect}
            options={[]}            
        />
        </Segment>        

        <Segment>
        <div className="segmentTitle">Metadata Name</div>
        <FormDropDown 
            // label="Select Dimensions:"
            name="metadataName" 
            isRequired={true} 
            onSelect={onTreeSelect}
            options={[]}
        />
        </Segment>                

        <Segment>
        <div className="segmentTitle">Dimensions</div>
        <FormTreeDropDown 
            // label="Select Dimensions:"
            name="hierarchyTree" 
            treeData={convertApiMetadataDims(props.metadata.Dimensions)} 
            isRequired={true} 
            multiple
            onSelect={onTreeSelect}
        />
        </Segment>

        {renderFilterSegment(state, props)}

        {state.formInvalid && 
            <div><Label basic color='red' pointing>
            {state.formInvalid}
            </Label></div>
        }

        {/* <button id={ID_PREVIEW_BTN} className={previewBtnClassName} icon="search">{previewText}</button> */}
        <Button id={ID_PREVIEW_BTN} primary disabled={state.fetchingPreview}>
            <Icon name={previewIcon}/>
            {previewText}</Button>
        {renderPreviewTable()}
    </div>
}

const getValidationError = (formData) => {
    if (!formData) {
        return "Form is empty!"
    }

    // Either Dimension or Kpi must be present
    // If both are not present, return error
    if (!formData.dataDsgnDimensions && 
        !((formData.hierDsgnKpiGroup && formData.hierDsgnKpiGroup.length) || 
            (formData.hierDsgnKpi && formData.hierDsgnKpi.length)
        )
    ) {
            return "Either Dimension or Kpi must be selected";
    }

    return null;
}

const onSubmit = (formData, setStateCb) => {
    //debugger
    console.log('Date Designer Submit', formData);
    // [1] Perform some validation first
    let validationError = getValidationError(formData);
    if (validationError) {
        setStateCb({
            formInvalid: validationError
        });
        return;
    }

    if (document.activeElement.id === ID_PREVIEW_BTN) {
        // Assume that if preview button was clicked, that would be the activeElement
        setStateCb({
            fetchingPreview: true,
            formInvalid: null,            
        });
    }
    else {

    }

}

const DataDesignerForm = (props, containerWidth, state, setStateCb) => {
    return <Form 
        className="hierConfigPanelContainer" 
        key='formDataDesigner' 
        onSubmit={(formData) => {onSubmit(formData, setStateCb)}} 
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
            fetchingPreview: false,
            formInvalid: null,
            filterFields: [{
                name: '',
                value: null
            },
            {
                name: '',
                value: null
            },
            {
                name: '',
                value: null
            }],
            ...this.state
        }
    }
    
    render() {
        console.log('render DataDesignerContainer', this.props.metadata);
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
        metadata: state.designer.metadata,
        dimensionsMetadata: convertApiMetadataDims(state.designer.metadata.Dimensions),
        filtersMetadata: convertApiMetadataFilters(state.designer.metadata),
    }
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ }, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(DataDesignerContainer);