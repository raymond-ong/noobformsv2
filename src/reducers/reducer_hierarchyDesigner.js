import { FETCH_HIERARCHY, 
  UPDATE_HIER_DESIGNER_TREE, 
  SELECT_HIER_DESIGNER_TREE, 
  INSERT_HIER_DESIGNER_TREE,
  FILTER_HIER_DESIGNER_TREE } from "../actions/index";
import {findNodeByKey, filterTreeEx} from '../helper/treefilter';

const defaultState = {
    hierarchyTree: null, // 2nd copy of hierarchy data, so that if user cancels operation
    selectedNode: null,
};

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
    }
    treeData.children = childNodes;
  
    return treeData;
  }

//https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const handleInsert = (newState) => {
  newState.hierarchyTree = [...newState.hierarchyTree];
  let newNode = {
    key: 'hier-'+uuidv4(),
    title: 'new page',
    nodeType: 'page',
    category: null,
    children: []
  };
  if (!newState.selectedNode || !newState.selectedNode.key) {
    newState.hierarchyTree.push(newNode);
  }
  else 
  {
    // Find the selected node
    let selectedNodeObj = findNodeByKey(newState.hierarchyTree, newState.selectedNode.key);
    if (!!selectedNodeObj) {
      selectedNodeObj.item.children = selectedNodeObj.item.children || [];
      selectedNodeObj.item.children.push(newNode)
    }
  }
}

const handleFilter = (filter, newState) => {
  let filteredData = filterTreeEx(newState.hierarchyTree, filter);
  console.log('handleFilter', filter, filteredData);        
  newState.hierarchyTree = [...filteredData];
}

export default function(state=defaultState, action) {
    if ([FETCH_HIERARCHY, UPDATE_HIER_DESIGNER_TREE, SELECT_HIER_DESIGNER_TREE, INSERT_HIER_DESIGNER_TREE, FILTER_HIER_DESIGNER_TREE].includes(action.type)) {
        console.log('[DEBUG] reducer_hierarchyDesigner', action, state);
    }
    switch (action.type) {
      case FETCH_HIERARCHY:
        return {
          ...state,
          hierarchyTree: [convertMasterDataToKeys(action.payload.data)]
        }
      case UPDATE_HIER_DESIGNER_TREE:
        return {
          ...state,
          hierarchyTree: action.payload
        }
      case SELECT_HIER_DESIGNER_TREE:
        return {
          ...state,
          selectedNode: action.payload
        }
      case INSERT_HIER_DESIGNER_TREE:
        let insertedState = {...state};
        handleInsert(insertedState);
        return insertedState;
      case FILTER_HIER_DESIGNER_TREE:
        let filterState = {...state};
        let filter = action.payload;
        handleFilter(filter, filterState);
        return filterState;
    }
    return state;
  }