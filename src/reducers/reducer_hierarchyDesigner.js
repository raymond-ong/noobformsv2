import { FETCH_HIERARCHY, 
  UPDATE_HIER_DESIGNER_TREE, 
  SELECT_HIER_DESIGNER_TREE, 
  INSERT_HIER_DESIGNER_TREE,
  FILTER_HIER_DESIGNER_TREE,
  SAVE_HIER_DESIGN_NODE,
  FETCH_HIERARCHYVIEWS } from "../actions/index";
import {findNodeByKey, filterTreeEx} from '../helper/treefilter';

const defaultState = {
    hierarchyMaster: null, // Just a backup copy of the hierarchy master data, in case the user haven't saved anything yet.
    hierarchyTree: null,   // This is the tree that the designer will be working on
    selectedNode: null,
    userSettings: [], 
    /*
    {
      key: '',
      dispName: '',
      inherit: true/false // if true, pageAssoc should be null/ignored
      pageAssoc: '', 
      childDefaultPage: '',
    }
    */
};

const convertMasterDataToKeys = (apiNode, index=0, stack=[], parent=null) => {
    if (!apiNode) {
      return null;
    }
  
    let childNodes = [];
    let treeData = {
      key: apiNode.fullPath,
      title: apiNode.name,
      nodeType: apiNode.nodeType,
      category: apiNode.category,
      hierStack: [...stack, index], // stack of index positions...maybe not needed anymore, but implementation is OK
      parent: parent
    };
  
    if (apiNode.children) {
      for(let i = 0; i < apiNode.children.length; i++) {
        let currNode = apiNode.children[i];
        childNodes.push(convertMasterDataToKeys(currNode, i, treeData.hierStack, treeData));
      }
      // apiNode.children.forEach(node => {
      //   childNodes.push(convertMasterDataToKeys(node));
      // })      
    }
    treeData.children = childNodes;
  
    return treeData;
}

const reconstructHierarchyStack = (apiNodes, stack=[], parent=null) => {
  if (!apiNodes) {
    return null;
  }

  for(let i = 0; i < apiNodes.length; i++) {
    let apiNode = apiNodes[i];
    apiNode.hierStack = [...stack, i];
    apiNode.parent = parent;
    reconstructHierarchyStack(apiNode.children, apiNode.hierStack, apiNode);
  }

  return apiNodes;
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
    // Means no node is selected, so add it the first level
    newNode.parent = null;
    newNode.hierStack = [newState.hierarchyTree.length];
    newState.hierarchyTree.push(newNode);
  }
  else 
  {
    // Find the selected node
    let selectedNodeObj = findNodeByKey(newState.hierarchyTree, newState.selectedNode.key);
    if (!!selectedNodeObj) {
      if (selectedNodeObj.item.children.length > 0) {
        let lastIndex = selectedNodeObj.item.children.length;
        newNode.hierStack = selectedNodeObj.item.children[0].hierStack;
        newNode.hierStack[newNode.hierStack.length - 1] = lastIndex;        
      }
      else {
        selectedNodeObj.item.children = [];
        newNode.hierStack = [...selectedNodeObj.item.hierStack, 0];
      }
      newNode.parent = selectedNodeObj.item;
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
  let userSettingsFindIdx = state.userSettings.findIndex(x => x.key === inputSetting.key);
  if (userSettingsFindIdx >= 0) {
    state.userSettings.splice(userSettingsFindIdx, 1);    
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
          hierarchyMaster: action.payload.data
          //hierarchyTree: [convertMasterDataToKeys(action.payload.data)]
        }
      case UPDATE_HIER_DESIGNER_TREE:
        let reformatted = reconstructHierarchyStack(action.payload);
        return {
          ...state,
          hierarchyTree: reformatted
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
      case FETCH_HIERARCHYVIEWS:
        let fetchedViewState = {...state};           
        if ((!action.payload.data || action.payload.data.length === 0) && !!fetchedViewState.hierarchyMaster) {
          fetchedViewState.hierarchyTree = [convertMasterDataToKeys(fetchedViewState.hierarchyMaster)];
        }
        else {
          // Assume [0], for the default
          fetchedViewState.hierarchyTree = JSON.parse(action.payload.data[0].hierarchyJson);
          fetchedViewState.userSettings = JSON.parse(action.payload.data[0].nodeSettingsJson);  
        }
        return fetchedViewState;
    }
    return state;
  }