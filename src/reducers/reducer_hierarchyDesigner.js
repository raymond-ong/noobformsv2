import { FETCH_HIERARCHY, UPDATE_HIER_DESIGNER_TREE, SELECT_HIER_DESIGNER_TREE, INSERT_HIER_DESIGNER_TREE } from "../actions/index";
import {findNodeByKey} from '../helper/treefilter';

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
  
      treeData.children = childNodes;
    }
  
    return treeData;
  }

const handleInsert = (newState) => {
  newState.hierarchyTree = [...newState.hierarchyTree];
  if (!newState.selectedNode || !newState.selectedNode.fullPath) {
    newState.hierarchyTree.push({
      key: 'testing',
      title: 'new node',
      nodeType: 'new node',
      category: null
    });
  }
}

export default function(state=defaultState, action) {
    if ([FETCH_HIERARCHY, UPDATE_HIER_DESIGNER_TREE, SELECT_HIER_DESIGNER_TREE, INSERT_HIER_DESIGNER_TREE].includes(action.type)) {
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
    }
    return state;
  }