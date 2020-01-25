import React, { useContext } from "react";
import { FormContext } from "./Form";
import { RHFInput } from "react-hook-form-input";
import { Form as SemanticForm } from "semantic-ui-react";

import 'rc-tree-select/assets/index.css';
import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';


function FormTreeDropDown({ name, label, ...rest }) {
  const { register, setValue, unregister } = useContext(FormContext);

function handleChange([event, props]) {
  debugger
  return { value: props.value };
}

function handleChange2([value, props, treeNodeEvt]) {
  //debugger
  // if (!treeNodeEvt || !treeNodeEvt.triggerNode || !treeNodeEvt.triggerNode.props) {
  //   return null;
  // }

  // return { value: treeNodeEvt.triggerNode.props.title };
  return {
    value: value
  }
}

const Icon = (props) => {
  //console.log('icon', props)
  return <i className='ui icon genderless'></i>
}

const bubblePath = 'M632 888H392c-4.4 0-8 3.6-8 8v32c0 ' +
  '17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-3' +
  '2c0-4.4-3.6-8-8-8zM512 64c-181.1 0-328 146.9-3' +
  '28 328 0 121.4 66 227.4 164 284.1V792c0 17.7 1' +
  '4.3 32 32 32h264c17.7 0 32-14.3 32-32V676.1c98' +
  '-56.7 164-162.7 164-284.1 0-181.1-146.9-328-32' +
  '8-328z m127.9 549.8L604 634.6V752H420V634.6l-3' +
  '5.9-20.8C305.4 568.3 256 484.5 256 392c0-141.4' +
  ' 114.6-256 256-256s256 114.6 256 256c0 92.5-49' +
  '.4 176.3-128.1 221.8z';

const clearPath = 'M793 242H366v-74c0-6.7-7.7-10.4-12.9' +
  '-6.3l-142 112c-4.1 3.2-4.1 9.4 0 12.6l142 112c' +
  '5.2 4.1 12.9 0.4 12.9-6.3v-74h415v470H175c-4.4' +
  ' 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h618c35.3 0 64-' +
  '28.7 64-64V306c0-35.3-28.7-64-64-64z';

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

const inputIcon = getSvg(bubblePath);
const clearIcon = getSvg(clearPath);
const removeIcon = getSvg(clearPath);

const iconProps = {
  inputIcon,
  clearIcon,
  removeIcon,
  switcherIcon,
};

const iconPropsFunction = {
  //inputIcon: () => inputIcon,
  // inputIcon: () => {
  //   return <div>A</div>
  // },
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

  return (<SemanticForm.Field>
        <label key={'label-'+name}>{label}</label>
        <RHFInput
        as={<TreeSelect
          style={{ width: 300 }}
          transitionName="rc-tree-select-dropdown-slide-up"
          choiceTransitionName="rc-tree-select-selection__choice-zoom"
          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
          dropdownPopupAlign={{ overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] }}
          placeholder={<i>Please select...</i>}
          searchPlaceholder="Search..."
          // treeLine
          //treeDataSimpleMode={treeDataSimpleMode}
          showSearch
          allowClear
          maxTagTextLength={10}
          //value={value}
          //treeData={simpleTreeData}
          treeData={treeDataSample}
          treeNodeFilterProp="title"            
          multiple={false}
          treeIcon
          {...iconPropsFunction}
          //onChange={this.onChange}
          //onSelect={this.onSelect}
      />}
        name={name}
        register={register}
        unregister={unregister}
        setValue={setValue}
        onChangeEvent={handleChange2}
        />
    </SemanticForm.Field>
  );
}

export default FormTreeDropDown;
