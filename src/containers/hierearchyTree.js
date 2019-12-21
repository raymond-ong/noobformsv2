import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import './hierarchyTree.css';
import { selectHierDesignerTree } from '../actions/index';


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
    };
  }
  onExpand = (...args) => {
    console.log('onExpand', ...args);
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

  render() {
    let treeDataArr = convertMasterDataToKeys(this.props.masterHierarchy);
    if(!treeDataArr) {
      return <div>Loading...</div>
    }

    console.log(convertMasterDataToKeys(this.props.masterHierarchy));
    return (    
      <Tree style={{overflow: "auto", height: "100%", width: "calc(100%)", padding: "0 0 20 0"}}
          className="hierarchyTree"
          showLine
          selectable
          draggable
          checkable={false}
          //defaultExpandAll
          onExpand={this.onExpand}
          defaultExpandedKeys={this.state.defaultExpandedKeys}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          defaultCheckedKeys={this.state.defaultCheckedKeys}
          onSelect={this.onSelect}
          onCheck={this.onCheck}
          //treeData={treeData}
          treeData={[treeDataArr]}
          icon={this.Icon}
          filterTreeNode={this.Filterer}
          switcherIcon={this.getSwitcherIcon}
      />
    );
  }
}

const convertMasterDataToKeys = (apiNode) => {
  if (!apiNode) {
    return null;
  }

  let childNodes = [];
  let treeData = {
    key: apiNode.fullPath,
    title: apiNode.name,
    nodeType: apiNode.nodeType,
    category: apiNode.category
  };

  if (apiNode.children) {
    apiNode.children.forEach(node => {
      childNodes.push(convertMasterDataToKeys(node));
    })

    treeData.children = childNodes;
  }

  return treeData;
}

function mapStateToProps(state) {
  return {
    masterHierarchy: state.mainApp.masterHierarchy
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ selectHierDesignerTree }, dispatch);
}

//export default DemoTree;
export default connect(mapStateToProps, mapDispatchToProps)(HierarchyDesignerTree)