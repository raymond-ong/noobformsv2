import React from 'react';
import 'rc-tree-select/assets/index.css';
import '../form/FormTreeDropDown.css';
import {iconProps} from '../form/FormTreeDropDown';
import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';

// Version that is not inside of a Form, so that we can easily control the value
// Use this if there is no need to collect the value like during form submit; 
const TreeDropdown = ({treeData, multiple, value, onSelect, ...rest}) => {
    return <TreeSelect
    style={{ width: '100%' }}
    // transitionName="rc-tree-select-dropdown-slide-up"
    // choiceTransitionName="rc-tree-select-selection__choice-zoom"
    dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
    dropdownPopupAlign={{ overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] }}
    placeholder={<div style={{color: "gray"}}>Please select...</div>}
    searchPlaceholder="Search..."
    // treeLine
    showSearch={!multiple}
    allowClear
    maxTagTextLength={10}
    treeData={treeData}
    treeNodeFilterProp="title"            
    multiple={multiple}
    treeIcon
    treeCheckStrictly={true}
    value={value}
    onSelect={onSelect}    
    {...iconProps}
    {...rest}
    />
}

export default TreeDropdown;