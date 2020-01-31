import { FETCH_HIERARCHYCONSO, FETCH_DIMENSIONS, FETCH_HIERARCHYKPI } from "../actions/index";
  
const defaultState = {
    hierarchyConso: null,
    dimensions: null,
    hierarchyKpi: null
};

// Convert the API treedata to the format needed by rc-tree-select
const convertTreeData = (apiTreeData) => {
    if (!apiTreeData) {
        return [];
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

// Convert dimensions from API into a format dropdown expects
const convertDropDownOptions = (apiDropdowns) => {
    if (!apiDropdowns) {
        return [];
    }

    return apiDropdowns.map(x => {
        return {
            key: x.columnName,
            text: x.columnName,
            value: x.columnName,
            datatype: x.dataType // datatype, lowercase t, because it will be included into DOM by semantic UI
        }
    });
}

export default function(state=defaultState, action) {
    if ([FETCH_HIERARCHYCONSO, FETCH_DIMENSIONS, FETCH_HIERARCHYKPI].includes(action.type)) {
        console.log('[DEBUG] reducer_datadesigner', action, state);
    }    
    
    switch(action.type) {            
        case FETCH_HIERARCHYCONSO:      
            return {
                ...state,
                hierarchyConso: convertTreeData(action.payload.data)
            }
        case FETCH_DIMENSIONS:
            return {
                ...state,
                dimensions: convertDropDownOptions(action.payload.data)
            }
        case FETCH_HIERARCHYKPI:
            return {
                ...state,
                hierarchyKpi: action.payload.data
            }
    }

    return state;
}