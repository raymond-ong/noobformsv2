import React, { useContext } from "react";
import { FormContext } from "./Form";
import { RHFInput } from "react-hook-form-input";
import { Form as SemanticForm } from "semantic-ui-react";

import 'rc-tree-select/assets/index.css';
import './FormTreeDropDown.css';
import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';

function handleChange([value, props, treeNodeEvt]) {
  return {
    value: value
  }
}

const Icon = (props) => {
  //console.log('icon', props)
  return <i className='ui icon genderless'></i>
}

const arrowPath = 'M765.7 486.8L314.9 134.7c-5.3-4.1' +
  '-12.9-0.4-12.9 6.3v77.3c0 4.9 2.3 9.6 6.1 12.6l36' +
  '0 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6' +
  '.7 7.7 10.4 12.9 6.3l450.8-352.1c16.4-12.8 16.4-3' +
  '7.6 0-50.4z';

const getSvg = (path, iStyle = {}, style = {}) => {
  return (
    <i style={iStyle}>
      <svg
        viewBox="0 0 1024 1024"
        width="1em"
        height="1em"
        fill="currentColor"
        style={{ verticalAlign: '-.125em', ...style }}
      >
        <path d={path} />
      </svg>
    </i>
  );
}


const switcherIcon = (obj) => {
  if (obj.isLeaf) {
    return null;
  }
  return getSvg(arrowPath,
    { cursor: 'pointer', backgroundColor: 'white' },
    { transform: `rotate(${obj.expanded ? 90 : 0}deg)` });
};

const iconProps = {
  switcherIcon,
};

const iconPropsFunction = {
  //inputIcon: () => inputIcon,
  //clearIcon: () => clearIcon,
  //removeIcon: () => removeIcon,
  switcherIcon,
};

  // Mode 1: Flat data "simple mode"
const simpleTreeData = [
  { key: 1, pId: 0, label: 'test1', value: 'test1' },
  { key: 121, pId: 0, label: 'test2', value: 'test2' },
  { key: 11, pId: 1, label: 'test11', value: 'test11' },
  { key: 12, pId: 1, label: 'test12', value: 'test12' },
  { key: 111, pId: 11, label: 'test111', value: 'test111' },
];

const treeDataSimpleMode = {
  id: 'key',
  rootPId: 0,
};

// Mode 2: traditional data
const treeDataSample = [
  { key: '0-0', value: '0-0', title: 'Plant', children:
    [
      { key: '0-0-0', value: '0-0-0', title: 'Area1', isCollapsed: true, children:
        [
          { key: '0-0-0-0', value: '0-0-0-0', title: 'Apple' },
        ],
      },
      { key: '0-0-1', value: '0-0-1', title: 'Area2', children:
          [
            { key: '0-0-1-0', value: '0-0-1-0', title: 'Banana',},
            { key: '0-0-1-1', value: '0-0-1-1', title: 'Carrot' },
            { key: '0-0-1-2', value: '0-0-1-2', title: 'Dolphin' },
            { key: '0-0-1-3', value: '0-0-1-3', title: 'Elephant' },
            { key: '0-0-1-4', value: '0-0-1-4', title: 'Father' },
            { key: '0-0-1-5', value: '0-0-1-5', title: 'Germany' },
            { key: '0-0-1-6', value: '0-0-1-6', title: 'Holland' },
            { key: '0-0-1-7', value: '0-0-1-7', title: 'India' },
            { key: '0-0-1-8', value: '0-0-1-8', title: 'Japan' },
            { key: '0-0-1-9', value: '0-0-1-9', title: 'Kristaps' },
            { key: '0-0-1-10', value: '0-0-1-10', title: 'Lion' },
            { key: '0-0-1-11', value: '0-0-1-11', title: 'Mexico' },
            { key: '0-0-1-12', value: '0-0-1-12', title: 'Nigeria' },
            { key: '0-0-1-13', value: '0-0-1-13', title: 'Carrot Apple' },
            { key: '0-0-1-14', value: '0-0-1-14', title: 'Strawberry Banana' },
            { key: '0-0-1-15', value: '0-0-1-15', title: 'Godfather' },
            { key: '0-0-1-16', value: '0-0-1-16', title: 'Indian Mango' },
            { key: '0-0-1-17', value: '0-0-1-17', title: 'Dandelion' },
            { key: '0-0-1-18', value: '0-0-1-18', title: 'Lionel' },
            { key: '0-0-1-19', value: '0-0-1-19', title: 'Millionaire' },
            { key: '0-0-1-20', value: '0-0-1-20', title: 'The quick brown fox jumps over the lazy dog' },
            { key: '0-0-1-21', value: '0-0-1-21', title: 'abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
            { key: '0-0-1-22', value: '0-0-1-22', title: '床前明月光,疑是地上霜,举头望明月,低头思故乡' },
            { key: '0-0-1-23', value: '0-0-1-23', title: 'last element' },
          ],
      },
    ],
  },
];

function FormTreeDropDown({ name, label, treeData, ...rest }) {
  const { register, setValue, unregister } = useContext(FormContext);

  return (<SemanticForm.Field>
        <label key={'label-'+name}>{label}</label>
        <RHFInput
        as={<TreeSelect
          style={{ width: 300 }}
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          dropdownPopupAlign={{ overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] }}
          placeholder={<div style={{color: "gray"}}>Please select...</div>}
          searchPlaceholder="Search..."
          // treeLine
          showSearch
          allowClear
          maxTagTextLength={10}
          treeData={treeData}
          treeNodeFilterProp="title"            
          multiple={false}
          treeIcon
          {...iconPropsFunction}
      />}
        name={name}
        register={register}
        unregister={unregister}
        setValue={setValue}
        onChangeEvent={handleChange}
        />
    </SemanticForm.Field>
    );
}

export default FormTreeDropDown;
