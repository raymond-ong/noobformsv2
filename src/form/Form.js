import React, { createContext, useEffect } from "react";
import useForm from "react-hook-form";
import { Form as SemanticForm } from "semantic-ui-react";
import {getToolItemByName} from '../components/toolbox';
import * as constants from '../constants';

export const FormContext = createContext();

const sanitizeObj = (obj) => {
  if (!obj) {
    return;
  }
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
  return obj;
}

// Nicely designed wrapper class taken from
// https://codesandbox.io/s/dazzling-napier-ne3e6
function Form({ children, onSubmit, inputObj, setControlValues, watchedField, setStateCb, ...rest }) {
  const { register, setValue, handleSubmit, unregister, watch, errors } = useForm();
  const watchedValue = !!watchedField ? watch(watchedField) : null; // no way for us to pass back the value conveniently, but the form will rerender anyways
  const inputObjVals = !! inputObj ? [...Object.values(inputObj)] : null
  console.log('Form rerenders', inputObj, watchedValue);  

    useEffect(() => {
      // Called when input object changes
      // TODO: If the form is for rendering control props, inputObjVals can be different size, which useEffect will complain
      console.log('Form useEffect1', watchedValue);
        // Set the initial values
        // The controls' values are not really bound to any state or props so we have to update it here
        if (setControlValues) {
          setControlValues(setValue, inputObj);
        }
    }, inputObjVals)

    useEffect(() => {
      // Called only when watched value changes
      console.log('Form useEffect2', watchedValue);
      if (setStateCb) {
        if (Array.isArray(watchedField)) {
          setStateCb(sanitizeObj(watchedValue));
        }
        else {
          setStateCb({[watchedField]: watchedValue});
        }        
      }
    }, Array.isArray(watchedField) ? Object.values(watchedValue) : [watchedValue]); // Means if inputObj value does not change, don't run useEffect again.

  return (
    <FormContext.Provider value={{ register, setValue, handleSubmit, unregister, errors }}>
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
export { default as FormTreeDropDown } from "./FormTreeDropDown";
export { default as FormRadio } from "./FormRadio";
export { default as FormDateRange } from "./FormDateRange";
export { default as FormFilterInput } from "./FormFilterInput";
export { default as FormImageCoord} from "./FormImageCoord";
export { default as FormRichText} from "./FormRichText";

export default Form;
