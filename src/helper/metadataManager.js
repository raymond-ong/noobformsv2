import React from 'react';
import {Header} from 'semantic-ui-react';

export const getMetadataOptions = (metadata, name) => {
    let fields = metadata[name];
    return fields.map(field => {
        let descriptionJsx = field.description && <Header content={field.name} as="h5" subheader={field.description}/>
        return {
            key: field.name,
            text: field.name,
            value: field.name,
            content: descriptionJsx
        };
    });
}

export const getMetadataTreeDropdownOptions = (metadata, names) => {
    let retList = [];
    if (!Array.isArray(names)) {
        return retList;
    }
    
    names.forEach(name => {        
        let treeFields = metadata[name];
        let treeOptions = convertApiMetadataDims(treeFields);
        retList = retList.concat(treeOptions);        
    });    

    return retList;
}

const convertApiMetadataDims = (apiMetadataDims, parent=null) => {
    if (!apiMetadataDims) {
        return null;
    }

    return apiMetadataDims.map(x => {
        let {name, items, dataType, ...rest} = x;
        let currItem = {
            name: parent ? `${parent.name}.${name}` : name,
            //value: parent ? `${parent.name}.${name}` : name,
            value: name,
            title: name,
            parent,
            stackValue: parent ? [...parent.stackValue, name] : [name],
            disabled: dataType === 'group',
            ...rest
        };

        currItem.children = convertApiMetadataDims(items, currItem);

        return currItem;
    });
}

const findInTree = (arrTree, name) => {
    if (!Array.isArray(arrTree)) {
        return null;
    }

    for(let i = 0; i < arrTree.length; i++) {
        let currItem = arrTree[i];
        if (currItem.name === name) {
            return currItem;
        }

        let findChildren = findInTree(currItem.items, name);
        if (!!findChildren) {
            return findChildren;
        }
    }

    return null;
}

export const getMetadataDimTreeDropdownOptions = (dimName, metadata) => {
    let metaDim = metadata.dimensions;
    let findDimName = findInTree(metaDim, dimName);
    if (!findDimName) {
        return [];
    }
    
    return convertApiMetadataDims([findDimName]);
}