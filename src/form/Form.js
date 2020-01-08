import React, { createContext, useEffect } from "react";
import useForm from "react-hook-form";
import { Form as SemanticForm } from "semantic-ui-react";
import {getToolItemByName} from '../components/toolbox';
import * as constants from '../constants';

export const FormContext = createContext();



// Nicely designed wrapper class taken from
// https://codesandbox.io/s/dazzling-napier-ne3e6
function Form({ children, onSubmit, inputObj, setControlValues, watchedField, setStateCb, ...rest }) {
  const { register, setValue, handleSubmit, unregister, watch } = useForm();
  const watchedValue = watch(watchedField); // no way for us to pass back the value conveniently, but the form will rerender anyways
  console.log('Form rerenders', inputObj, watchedValue);  

    useEffect(() => {
      // Called when input object changes
      console.log('Form useEffect1', watchedValue);
        // Set the initial values
        // The controls' values are not really bound to any state or props so we have to update it here
        setControlValues(setValue, inputObj);

    }, [...Object.values(inputObj)])

    useEffect(() => {
      // Called only when watched value changes
      console.log('Form useEffect2', watchedValue);
      if (setStateCb) {
        setStateCb({[watchedField]: watchedValue});
      }
    }, [watchedValue]); // Means if inputObj value does not change, don't run useEffect again.

  return (
    <FormContext.Provider value={{ register, setValue, handleSubmit, unregister }}>
      <SemanticForm onSubmit={handleSubmit(onSubmit)} {...rest}>
        {children}
      </SemanticForm>
    </FormContext.Provider>
  );
}

export { default as Text } from "./FormText";
export { default as FormCheckbox } from "./FormCheckbox";
export { default as Dropdown } from "./FormDropDown";
export { default as IconSelector } from "./IconSelector";
export { default as ColorSelector } from "./ColorSelector";

export default Form;
