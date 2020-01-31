import React, { useContext } from "react";
import { FormContext } from "./Form";
import { RHFInput } from "react-hook-form-input";
import { Form as SemanticForm } from "semantic-ui-react";

function FormDropDown({ name, label, multiple,...rest }) {
  const { register, setValue, unregister } = useContext(FormContext);

  function handleChange([, props]) {
    return { value: props.value};
  }

  // TODO: If multiple is set, there is a console log that says value must be an array instead
  // of undefined. Check if the problem still exists after getting rid of RHF.
  let defaultValue = multiple ? [] : null;

  return (<SemanticForm.Field>
        <label key={'label-'+name}>{label}</label>
        <RHFInput
        as={<SemanticForm.Dropdown 
            key={name}
            fluid 
            multiple={multiple}
            search
            selection 
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
