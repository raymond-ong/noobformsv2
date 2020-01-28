import { FETCH_HIERARCHYCONSO } from "../actions/index";
  
const defaultState = {
    hierarchyConso: null,
};

// Convert the API treedata to the format needed by rc-tree-select
const convertTreeData = (apiTreeData) => {
    if (!apiTreeData) {
        return {};
    }
    return apiTreeData.map(x => {
        let {fullPath, nodeName, children, ...rest} = x;
        return {
            key: fullPath,
            value: fullPath,
            title: nodeName,
            children: convertTreeData(children),
            ...rest
        }
    })
}

export default function(state=defaultState, action) {
    if ([FETCH_HIERARCHYCONSO].includes(action.type)) {
        console.log('[DEBUG] reducer_datadesigner', action, state);
    }    
    
    switch(action.type) {            
        case FETCH_HIERARCHYCONSO:      
            return {
                ...state,
                hierarchyConso: convertTreeData(action.payload.data)
            }
    }

    return state;
}