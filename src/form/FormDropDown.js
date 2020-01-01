import React, { useContext } from "react";
import { FormContext } from "./Form";
import { RHFInput } from "react-hook-form-input";
import { Form as SemanticForm } from "semantic-ui-react";

function FormDropDown({ name, label, ...rest }) {
  const { register, setValue, unregister } = useContext(FormContext);

  function handleChange([, props]) {
    return { value: props.value };
  }

  return (<SemanticForm.Field>
        <label key={'label-'+name}>{label}</label>
        <RHFInput
        as={<SemanticForm.Dropdown 
            key={name}
            fluid 
            selection 
            button  // Add button and className so that we can control the size
            className='icon small'
            style={{fontWeight:'normal', color: 'black', right: '0', left: 'auto'}}
            {...rest} />}
        name={name}
        register={register}
        unregister={unregister}
        setValue={setValue}
        onChangeEvent={handleChange}
        />
    </SemanticForm.Field>
  );
}

export default FormDropDown;
