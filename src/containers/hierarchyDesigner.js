import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import NoobSplitter from '../components/noobSplitter';
import DesignerContentbase from './designerContentBase';
import HierarchyDesignerTree from './hierearchyTree';
import HierarchyToolbar from '../components/hierDesignerToolbar';
import HierConfigPanel from './hierarchyConfigPanel';
import { selectHierDesignerTree, updateHierDesignerTree, insertNewNode, filterHierDesignerTree } from '../actions/index';
import {findNodeByKey, filterTree, filterTreeEx} from '../helper/treefilter';


import './hierarchyTree.css'; //temp only
import './hierarchyDesigner.css';

const DEFAULT_SPLIT_SIZES = [25, 75];

const ToolbarPanel = ({children, onDelete, onInsert, onSave, onSearchText, bEnableDelete}) => {
    //console.log('[render] AccordionPanel, id: ', id);
    return <div className="toolbarPanel">        
        <div className="toolbarContainer">
            <HierarchyToolbar 
                onDelete={onDelete} 
                onInsert={onInsert} 
                onSave={onSave} 
                onSearchText={onSearchText}
                bEnableDelete={bEnableDelete}/>
        </div>
        <div className="toolbarPanelBody">
            {children}
        </div>
    </div>;
}

const HierarchyPropsPanel = (containerWidth) => {
    return <HierConfigPanel containerWidth={containerWidth}/>
}

// This will be the intelligent class that will hold
// the state of the hierarchy tree, to handle deletion and insertion of new nodes
class HierarchyDesigner extends DesignerContentbase { 

    constructor(props) {
        super(props);
        this.state = {
            searchText: null,
            treeData: null, // make a copy for filtering purposes
            ...this.state
        }
    }

    // When a tree node is selected
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
        this.selKey = info.node.props.eventKey;
        // Fire an action to save the selected node to Redux
        //this.props.selectToolPanelTree(this.selKey);
        if (selectedKeys.length > 0) {
            this.props.selectHierDesignerTree({
              key: selectedKeys[0], 
              ...info.selectedNodes[0].props
            });
        }
        else {
            this.props.selectHierDesignerTree(null);
        }
      };

    onHierarchyChanged = (data) => {
        this.props.updateHierDesignerTree(data);
    }

    onSave = () => {
        console.log('onSave');
    }

    onInsert = () => {
        console.log('onInsert');
        // popup a dialog to ask the user to specify the title?
        // for now, just implement the edit page

        // For the underlying structure: just implement the logic in the reducer
        this.props.insertNewNode();
    }

    onDelete = () => {
        console.log('onDelete');
        // Actually the logic can also be implemented @reducer side. Anyways, we save one more redux action to create.
        let deletedNode = this.props.selectedNode;
        let data = [...this.props.hierarchyTree]; // make a new copy
        let deletedNodeObj = findNodeByKey(data, deletedNode.key);
        if (!deletedNodeObj) {
            return; // sanity only
        }

        deletedNodeObj.parentArr.splice(deletedNodeObj.index, 1);
        this.props.updateHierDesignerTree(data);
    }

    onSearchText = (e) => {        
        this.setState({
            searchText: e.currentTarget.value
        });
        // this.props.filterHierDesignerTree(e.currentTarget.value);        
    }
    
    render() {
        console.log('render hierarchyDesigner', this.state.rightPixels);
        // TODO: Put a minsize first. Should make the toolbar buttons responsive.
        return <NoobSplitter id="hierarchyDesigner" onDragEnd={this.onSplitDragEnd} defaultSize={DEFAULT_SPLIT_SIZES} minSize={230}>
            <ToolbarPanel 
                onDelete={this.onDelete}
                onInsert={this.onInsert}
                onSave={this.onSave}
                onSearchText={this.onSearchText}
                bEnableDelete={!!this.props.selectedNode && !!this.props.selectedNode.key}                
            >
                <HierarchyDesignerTree 
                    onSelectCb={this.onSelect} 
                    onHierarchyChanged={this.onHierarchyChanged}
                    treeData={this.props.hierarchyTree}
                    searchText={this.state.searchText}
                    />                
            </ToolbarPanel>
            {HierarchyPropsPanel(this.state.rightPixels)}
        </NoobSplitter>

    }
}

function mapStateToProps(state) {
    return {
        hierarchyTree: state.hierarchyDesigner.hierarchyTree,
        selectedNode: state.hierarchyDesigner.selectedNode,
    }
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ selectHierDesignerTree, updateHierDesignerTree, insertNewNode, filterHierDesignerTree }, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(HierarchyDesigner);