import React, { useContext } from "react";
import { FormContext } from "./Form";
import { RHFInput } from "react-hook-form-input";
import { Form as SemanticForm, Label} from "semantic-ui-react";

import 'rc-tree-select/assets/index.css';
import './FormTreeDropDown.css';
import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';

function handleChange([value, props, treeNodeEvt]) {
  debugger
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

export const iconProps = {
  switcherIcon,
};

const iconPropsFunction = {
  //inputIcon: () => inputIcon,
  //clearIcon: () => clearIcon,
  //removeIcon: () => removeIcon,
  switcherIcon,
};


function FormTreeDropDown({ name, label, treeData, isRequired, multiple, defaultValue, value,...rest }) {
  const { register, setValue, unregister, errors } = useContext(FormContext);

  return (<SemanticForm.Field>
        <label key={'label-'+name}>{label}</label>
        <RHFInput
        as={<TreeSelect
          style={{ width: '100%' }}
          // transitionName="rc-tree-select-dropdown-slide-up"
          // choiceTransitionName="rc-tree-select-selection__choice-zoom"
          // dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
          //dropdownPopupAlign={{ overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] }}
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
          defaultValue={defaultValue}
          treeCheckStrictly={true}
          {...iconPropsFunction}
      />}
        name={name}
        register={register}
        unregister={unregister}
        setValue={setValue}
        onChangeEvent={handleChange}
        rules={{required: isRequired }}
        />
      {errors[name] && 
        <div>
        <Label basic color='red' pointing>
          Please select a value
        </Label>
        </div>}
    </SemanticForm.Field>
    );
}

export default FormTreeDropDown;
