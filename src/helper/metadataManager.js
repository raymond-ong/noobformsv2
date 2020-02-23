import React from 'react';
import {Header} from 'semantic-ui-react';

export const getMetadataOptions = (metadata, name) => {
    let fields = metadata[name];
    debugger
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

export const getMetadataTreeDropdownOptions = (metadata, name) => {
    let treeFields = metadata[name];
    return convertApiMetadataDims(treeFields);
}

const convertApiMetadataDims = (apiMetadataDims, parent=null) => {
    if (!apiMetadataDims) {
        return null;
    }

    return apiMetadataDims.map(x => {
        let {name, items, dataType, ...rest} = x;
        return {
            name: parent ? `${parent.name}.${name}` : name,
            value: parent ? `${parent.name}.${name}` : name,
            title: name,
            children: convertApiMetadataDims(items, x),
            disabled: dataType === 'group',
            ...rest
        }
    });
}