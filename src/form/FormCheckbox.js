import React, { useContext } from "react";
import { FormContext } from "./Form";
import { RHFInput } from "react-hook-form-input";
import { Form as SemanticForm } from "semantic-ui-react";

function FormCheckbox({ name, ...rest }) {
  const { register, setValue, unregister } = useContext(FormContext);

  function handleChange([, props]) {
    return { checked: props.checked };
  }

  return (
    <RHFInput
      as={<SemanticForm.Checkbox {...rest} />}
      name={name}
      value={name}
      type="checkbox"
      register={register}
      unregister={unregister}
      setValue={setValue}
      onChangeEvent={handleChange}
    />
  );
}

export default FormCheckbox;
