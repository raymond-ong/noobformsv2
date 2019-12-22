import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import './hierarchyTree.css';
import { selectHierDesignerTree, updateHierDesignerTree } from '../actions/index';


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
      treeData: null
    };
  }
  onExpand = (...args) => {
    //console.log('onExpand', ...args);
  };
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    this.selKey = info.node.props.eventKey;
    // Fire an action to save the selected node to Redux
    //this.props.selectToolPanelTree(this.selKey);
    if (selectedKeys.length > 0) {
        this.props.selectHierDesignerTree({
          fullPath: selectedKeys[0], 
          ...info.selectedNodes[0].props
        });
    }
    else {
        this.props.selectHierDesignerTree(null);
    }
  };

  Icon = (props) => {
      //console.log('icon', props)
      if (props.nodeType === 'Plant' || props.nodeType === 'Folder' || props.children.length > 0) {
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
    console.log('[tree] onDragStart', info);
  }

  // No need to do anything for now
  // We allow a leaf node to become a folder node if a node was dragged into it.
  // E.g. maybe the user wants to create 2 pages for a single device
  // But we still need to do some validation on max depth, otherwise testers will abuse.
  onDragEnter(info) {
    console.log('[tree] onDragEnter', info);
  }

  // recursively finds the node
  // Returns: the node and the containing array
  findNodeByKey(data, key) {
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      if (item.key === key) {        
        return {
          item,
          index: i,
          parentArr: data
        };
      }
      if (item.children) {
        let childFind = this.findNodeByKey(item.children, key);
        if (childFind) {
          return childFind;
        }
      }
    }
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

  // business logic
  findNodeByPosStr(data, posStr) {
    let toks = posStr.split('-');

  }

  swapArrayItems (arr, x,y) {
    var b = arr[x];
    arr[x] = arr[y];
    arr[y] = b;
    return arr;
  }

  moveArr (arr, from, to) {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
  }

  // Need to rearrange the state
  // Some validations have already been performed prior to calling this function
  // e.g. Dropping parent to child
  onDrop = (info) => {
    console.log('[tree] onDrop', info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dragParentPos = this.getParentPosStr(info.dragNode.props.pos);

    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const isBottomGap = dropPosition === 1;
    const dropParentPos = this.getParentPosStr(info.node.props.pos);

    // [1] Do some validation, e.g. depth

    // Make a copy of the state data
    const data = [...this.props.masterHierarchy];

    // [2] Get the dragged node
    let dragObj = this.findNodeByKey(data, dragKey);
    // [3] Get the dropped node
    let dropObj = this.findNodeByKey(data, dropKey);

    // [A] If drag and drop position belongs to the same parent (just a reorder)
    if (dragParentPos === dropParentPos && info.dropToGap === true) {
      //let dropIndex = dropObj.index;
      //if ()
      //this.moveArr(dragObj.parentArr, dragObj.index, );
      // Remove the object first      
      dragObj.parentArr.splice(dragObj.index, 1);
      // Find the new index of drop
      let newDropIdx = dragObj.parentArr.findIndex((item) => item.key === dropKey);
      if (isBottomGap) {
        newDropIdx++;
      }
      dragObj.parentArr.splice(newDropIdx, 0, dragObj.item);
    }

    // [B] Different parents; Drag to a gap


    // [C] Different parents; Drag to a folder

    // [D] Different parents; Drag to a leaf node

    


    if (!info.dropToGap) {
      dropObj.children.push(dragObj);
    }

    // Fire redux action to set the new state
    this.props.updateHierDesignerTree(data);
  }

  render() {
    console.log('rendering tree', this.props.masterHierarchy);
    if (!this.props.masterHierarchy) {
      return <div>Loading...</div>
    }

    return (    
      <Tree style={{overflow: "auto", height: "100%", width: "calc(100%)", padding: "0 0 20 0"}}
          className="hierarchyTree"
          showLine
          selectable
          draggable
          onDragStart={this.onDragStart}
          onDragEnter={this.onDragEnter}
          onDrop={this.onDrop}
          checkable={false}
          defaultExpandAll // temp: expand everything by default; no need to config which keys to expand          
          onExpand={this.onExpand}
          //defaultExpandedKeys={this.state.defaultExpandedKeys}
          //defaultSelectedKeys={this.state.defaultSelectedKeys}
          //defaultCheckedKeys={this.state.defaultCheckedKeys}
          onSelect={this.onSelect}
          onCheck={this.onCheck}
          //treeData={[treeDataObj]}
          treeData={this.props.masterHierarchy}
          icon={this.Icon}
          filterTreeNode={this.Filterer}
          switcherIcon={this.getSwitcherIcon}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    masterHierarchy: state.hierarchyDesigner.hierarchyTree
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ selectHierDesignerTree, updateHierDesignerTree }, dispatch);
}

//export default DemoTree;
export default connect(mapStateToProps, mapDispatchToProps)(HierarchyDesignerTree)