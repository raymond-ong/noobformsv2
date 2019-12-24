import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Tree, { TreeNode } from 'rc-tree';
import 'rc-tree/assets/index.css';
import './treeview.css';
//import './basic.less';
import { selectToolPanelTree } from '../actions/index';

const treeDataSample = [
  { key: '0-0', title: 'Plant', children:
    [
      { key: '0-0-0', title: 'Area1', isCollapsed: true, children:
        [
          { key: '0-0-0-0', title: 'Apple' },
        ],
      },
      { key: '0-0-1', title: 'Area2', children:
          [
            { key: '0-0-1-0', title: 'Banana',},
            { key: '0-0-1-1', title: 'Carrot' },
            { key: '0-0-1-2', title: 'Dolphin' },
            { key: '0-0-1-3', title: 'Elephant' },
            { key: '0-0-1-4', title: 'Father' },
            { key: '0-0-1-5', title: 'Germany' },
            { key: '0-0-1-6', title: 'Holland' },
            { key: '0-0-1-7', title: 'India' },
            { key: '0-0-1-8', title: 'Japan' },
            { key: '0-0-1-9', title: 'Kristaps' },
            { key: '0-0-1-10', title: 'Lion' },
            { key: '0-0-1-11', title: 'Mexico' },
            { key: '0-0-1-12', title: 'Nigeria' },
            { key: '0-0-1-13', title: 'Carrot Apple' },
            { key: '0-0-1-14', title: 'Strawberry Banana' },
            { key: '0-0-1-15', title: 'Godfather' },
            { key: '0-0-1-16', title: 'Indian Mango' },
            { key: '0-0-1-17', title: 'Dandelion' },
            { key: '0-0-1-18', title: 'Lionel' },
            { key: '0-0-1-19', title: 'Millionaire' },
            { key: '0-0-1-20', title: 'The quick brown fox jumps over the lazy dog' },
            { key: '0-0-1-21', title: 'abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
            { key: '0-0-1-22', title: '床前明月光,疑是地上霜,举头望明月,低头思故乡' },
          ],
      },
    ],
  },
];

class DemoTree extends React.Component {
  static propTypes = {
    keys: PropTypes.array,
  };
  static defaultProps = {
    keys: ['0-0', '0-0-1', '//Plant'],
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
        this.props.selectToolPanelTree({
          key: selectedKeys[0], 
          ...info.selectedNodes[0].props
        });
    }
    else {
        this.props.selectToolPanelTree(null);
    }

    if (this.tree) {
      console.log(
        'Selected DOM node:',
        selectedKeys.map(key => ReactDOM.findDOMNode(this.tree.domTreeNodes[key])),
      );      
    }
  };
  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };
  onEdit = () => {
    setTimeout(() => {
      console.log('current key: ', this.selKey);
    }, 0);
  };
  onDel = (e) => {
    if (!window.confirm('sure to delete?')) {
      return;
    }
    e.stopPropagation();
  };
  setTreeRef = (tree) => {
    this.tree = tree;
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

  // Sample filter...
  // It only highlights the node, instead of hiding everything else.
  // TODO: change this behaviour
  Filterer = (node) => {
      //console.log('Filterer', node);
    //   if (node.props.title === 'Apple') {
    //       return true
    //   }
      return false;
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

    console.log('render demo tree...', this.props.masterHierarchy);
    return (    
    <div>
        <div className="ui icon input small" style={{margin: "5px", width: "calc(100% - 10px)"}}>
            <input type="text" placeholder="Search tree..."/>
            <i className="inverted circular filter icon"></i>
        </div>
        <Tree style={{overflow: "auto", height: "100%", width: "calc(100%)", padding: "0 0 20 0"}}
            className="myCls"
            showLine
            selectable
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
    </div>
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
    return bindActionCreators({ selectToolPanelTree }, dispatch);
}

//export default DemoTree;
export default connect(mapStateToProps, mapDispatchToProps)(DemoTree)