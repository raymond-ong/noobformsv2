import React from 'react';
import Tree, {TreeNode} from 'rc-tree';
import {findNodeByKey} from '../helper/treefilter';

import 'rc-tree/assets/index.css';
import './hierarchyTree.css';


class HierarchyDesignerTree extends React.Component {
  static defaultProps = {
    keys: ['//PLANT'],
  };
  constructor(props) {
    super(props);
    const keys = props.keys;
    this.state = {
      defaultExpandedKeys: keys,
      //defaultSelectedKeys: keys,
      defaultSelectedKeys: [],
      defaultCheckedKeys: keys,
      treeData: null,
      expandedKeys: []
    };
  }

  componentDidMount = () => {
    // Auto expand the first level nodes
    let firstLevelKeys = this.getFirstLevelKeys();
    console.log('[DEBUG][Tree] componentDidMount...', firstLevelKeys);
    if (firstLevelKeys && firstLevelKeys.length) {
      this.setState({expandedKeys: [...this.state.expandedKeys, ...firstLevelKeys]});
    }
  }

  componentDidUpdate = (prevProps) => {
    console.log('tree componentDidUpdate');
    if (!!this.props.selectedNodeKey && this.props.selectedNodeKey === prevProps.selectedNodeKey) {
      return;
    }

    // Expand the parent of the (auto-selected) selectedNode if it is not yet expanded
    // Purpose is to automatically expand the parent of the newly insert node.
    // We don't need to recurse upward. 
    // Just the parent node is enough because the parentNode's ancestors for sure is already expanded in order for the user to insert into the parent node
    // Bug: parentArr is just the sibling array, not the parent array. This is not a fool-proof solution, but it will do for now, since we will
    // change the implementation to use a tree list view
    let nodeSelectedObj = findNodeByKey(this.props.treeData, this.props.selectedNodeKey);
    if (!nodeSelectedObj) {
      return;
    }

    let parentObj = nodeSelectedObj.parentArr[nodeSelectedObj.index];
    if (!this.state.expandedKeys.includes(parentObj.key)) {
      this.setState({expandedKeys: [...this.state.expandedKeys, parentObj.key]});
    }
  }

  onExpand = (expandedKeys) => {
    //console.log('onExpand', ...args);
    this.setState({
      expandedKeys,
    });
  };


  Icon = (props) => {
      //console.log('icon', props)
      if (props.nodeType === 'Plant' || props.nodeType === 'Folder' || (props.children && props.children.length > 0) ) {
        return <i className='ui icon folder outline'></i>
      }
      else {
        
        return <i className='ui icon genderless'></i>
      }
      
  }

  getSwitcherIcon = (node) => {
    if (node.isLeaf) {
      return null;
    }

    if (node.expanded) {
      return <i className="ui icon angle down"></i>  
    }
    return <i className="ui icon angle right"></i>
  }

  // No need to do anything for now
  onDragStart(info) {
    //console.log('[tree] onDragStart', info);
  }

  // No need to do anything for now
  // We allow a leaf node to become a folder node if a node was dragged into it.
  // E.g. maybe the user wants to create 2 pages for a single device
  // But we still need to do some validation on max depth, otherwise testers will abuse.
  onDragEnter(info) {
    //console.log('[tree] onDragEnter', info);
  }

  // nodePos sample: '0-0-0-0'
  // Even the top level node format is '0-0' or '0-1'
  getParentPosStr(nodePos) {
    let toks = nodePos.split('-');
    let lastIndex = nodePos.lastIndexOf('-');
    if (lastIndex < 0) {
      return null; // Will never happen, just sanity check
    }

    return nodePos.substr(0, lastIndex);
  }

  // Need to rearrange the state
  // Some validations have already been performed prior to calling this function
  // e.g. Dropping parent to child
  // rc-tree limiation: onDrop does not fire if you drop into the bottom-most element, if the mouse position is outside the bounds of the tree's dom
  // maybe we can draw an imaginary border while dragging
  onDrop = (info) => {
    console.log('[tree] onDrop', info);
    let bUpdated = true;
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dragParentPos = this.getParentPosStr(info.dragNode.props.pos);

    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const isBottomGap = dropPosition === 1;
    const dropParentPos = this.getParentPosStr(info.node.props.pos);

    // [1] TODO Do some validation, e.g. depth

    // Make a copy of the state data
    const data = [...this.props.treeData];

    // [2] Get the dragged node and dropped node
    let dragObj = findNodeByKey(data, dragKey);
    let dropObj = findNodeByKey(data, dropKey);

    // [3] Actual logic to modify the arrays
    // [A] If dropped to a gap
    if (info.dropToGap === true) {
      // Note: This block can handle both [a] reorder in same folder [b] moving to a different folder
      // Remove the object first
      dragObj.parentArr.splice(dragObj.index, 1);
      // Find the new index @ dropped folder
      let newDropIdx = dropObj.parentArr.findIndex((item) => item.key === dropKey);
      if (isBottomGap) {
        newDropIdx++;
      }
      dropObj.parentArr.splice(newDropIdx, 0, dragObj.item);
    }
    // [B] Drop to a tree node (folder or target)
    else {//(!info.dropToGap)
      // [B1] If dropping to the same folder: do nothing
      if (info.node.props.pos === dragParentPos) {
        console.log('Dropped to the same folder: do nothing');
        bUpdated = false;
      }
      // [B2] Dropping to a different folder/target
      else {
        // Remove the object first
        dragObj.parentArr.splice(dragObj.index, 1);
        // Add it to back of the folder or target
        dropObj.item.children = dropObj.item.children || []; // create if necessary
        dropObj.item.children.push(dragObj.item);
      }    
    }

    // Fire redux action to set the new state
    if (bUpdated) {
      this.props.onHierarchyChanged(data);
    }    
  }

  /*
  Filterer = (node) => {
    if (!this.props.searchText) {
      return false;
    }

    return node.props.title.includes(this.props.searchText);
  }
  */

  satisfiesFilter(nodeItem) {
    if (!this.props.searchText || nodeItem.title.includes(this.props.searchText)) {
      return true;
    }

    // If it contains children, and one of the children satisfies
    if (!nodeItem.children) {
      return false
    }

    for (var i = 0; i < nodeItem.children.length; i++) {
      var currChild = nodeItem.children[i];
      if (this.satisfiesFilter(currChild)) {
        return true;
      }
    }

    return false;
  }

  getFirstLevelKeys() {
    if (!this.props.treeData) {
      return [];
    }

    return this.props.treeData.map(item => item.key);
  }

  renderTreeNodes(listNodes) {
    let retList = [];
    if (!listNodes) {
      return null;
    }

    // This function might be called very often, avoid anonymous functions
    for (let i = 0; i < listNodes.length; i++) {
      let currItem = listNodes[i];
      if (!this.satisfiesFilter(currItem)) {
        continue;
      }
      // retList.push(<TreeNode key={currItem.key} title={currItem.title} category={currItem.category} nodeType={currItem.nodeType}>
      let findUserSettings = !!this.props.userSettings && this.props.userSettings.find(x => x.key === currItem.key);
      if (findUserSettings) {
        let tempSettings = {...currItem};
        tempSettings.title = findUserSettings.dispName;
        retList.push(<TreeNode {...tempSettings}>      
          {this.renderTreeNodes(currItem.children)}
        </TreeNode>);      
      }
      else {
        retList.push(<TreeNode {...currItem}>      
                      {this.renderTreeNodes(currItem.children)}
                    </TreeNode>);      
      }
    }

    return retList
  }

  render() {
    console.log('rendering tree', this.props.userSettings);
    if (!this.props.treeData) {
      return <div>Loading...</div>
    }

    return (
      <Tree style={{overflow: "auto", height: "100%", width: "100%", padding: "0 0 20 0"}}
          className="hierarchyTree"
          showLine
          selectable
          draggable={this.props.draggable}
          onDragStart={this.onDragStart}
          onDragEnter={this.onDragEnter}
          onDrop={this.onDrop}
          checkable={false}
          //defaultExpandAll // temp: expand everything by default; no need to config which keys to expand          
          onExpand={this.onExpand}
          expandedKeys={this.state.expandedKeys}
          // defaultExpandedKeys={this.getFirstLevelKeys()}
          selectedKeys={this.props.selectedNodeKey ? [this.props.selectedNodeKey]: []}
          //defaultSelectedKeys={this.state.defaultSelectedKeys}
          //defaultCheckedKeys={this.state.defaultCheckedKeys}
          onSelect={this.props.onSelectCb}
          onCheck={this.onCheck}
        
          // Manually render the tree nodes, so that we can customize the behaviour like hiding filtered out data
          //treeData={[treeDataObj]}
          //treeData={this.props.treeData}
          icon={this.Icon}
          //filterTreeNode={this.Filterer}
          switcherIcon={this.getSwitcherIcon}>
              {this.renderTreeNodes(this.props.treeData)}
      </Tree>
    );
  }
}



export default HierarchyDesignerTree;
// Remove dependency from redux so that this component may be reused.
// By right, low level component must not be aware of redux anyways.
// export default connect(mapStateToProps, mapDispatchToProps)(HierarchyDesignerTree)