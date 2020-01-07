import { FETCH_HIERARCHY, 
  UPDATE_HIER_DESIGNER_TREE, 
  SELECT_HIER_DESIGNER_TREE, 
  INSERT_HIER_DESIGNER_TREE,
  FILTER_HIER_DESIGNER_TREE,
  SAVE_HIER_DESIGN_NODE } from "../actions/index";
import {findNodeByKey, filterTreeEx} from '../helper/treefilter';

const defaultState = {
    hierarchyTree: null, // 2nd copy of hierarchy data, so that if user cancels operation
    selectedNode: null,
    userSettings: [], 
    /*
    {
      key: '',
      dispName: '',
      inheritDefault: true/false // if true, pageAssoc should be null/ignored
      pageAssoc: '', 
      childPage: '',
    }
    */
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
  if (!newState || !newState.hierarchyTree) {
    return;
  }
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

  return newNode;
}

// Not used anymore...there is no way to bring back filtered out nodes
const handleFilter = (filter, newState) => {
  let filteredData = filterTreeEx(newState.hierarchyTree, filter);
  console.log('handleFilter', filter, filteredData);        
  newState.hierarchyTree = [...filteredData];
}

const handleSaveHierDesignNode = (state, inputSetting) => {
  state.userSettings = state.userSettings || [];
  let userSettingsFind = state.userSettings.findIndex(x => x.key === inputSetting.key);
  if (userSettingsFind >= 0) {
    state.userSettings.splice(state.userSettings, 1);    
  }
  state.userSettings.push({...inputSetting});
}

export default function(state=defaultState, action) {
    if ([FETCH_HIERARCHY, UPDATE_HIER_DESIGNER_TREE, SELECT_HIER_DESIGNER_TREE, INSERT_HIER_DESIGNER_TREE, FILTER_HIER_DESIGNER_TREE, SAVE_HIER_DESIGN_NODE].includes(action.type)) {
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
        let newNode = handleInsert(insertedState);
        insertedState.selectedNode = newNode;
        return insertedState;
      case FILTER_HIER_DESIGNER_TREE:
        // Action Not used anymore...we don't manipulate the model anymore
        // Just let the tree control filter out (do not show) nodes that do not satisfy the search string
        let filterState = {...state};
        let filter = action.payload;
        handleFilter(filter, filterState);
        return filterState;
      case SAVE_HIER_DESIGN_NODE:
        let saveNodeState = {...state};
        saveNodeState.userSettings = [...state.userSettings];
        handleSaveHierDesignNode(saveNodeState, action.payload)
        
        return saveNodeState;
    }
    return state;
  }