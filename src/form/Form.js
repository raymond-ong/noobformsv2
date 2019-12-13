import React, { createContext, useEffect } from "react";
import useForm from "react-hook-form";
import { Form as SemanticForm } from "semantic-ui-react";
import {getToolItemByName} from '../components/toolbox';

export const FormContext = createContext();

const NAME_CONTROL_ID = 'controlId' // todo put this in common place
const NAME_CONTROL_TYPE = 'controlType'

const setControlValues = (selectedControl, setValueFunc) => {
    if (!selectedControl) {
        return;
    }

    debugger
    // Common props
    let toolItemType = getToolItemByName(selectedControl.ctrlType);

    setValueFunc(NAME_CONTROL_ID, selectedControl.i);
    setValueFunc(NAME_CONTROL_TYPE, toolItemType.displayName);

    Object.keys(selectedControl.data).forEach((key, index) => {
        setValueFunc(key, selectedControl.data[key]);
    });
}

// Nicely designed wrapper class taken from
// https://codesandbox.io/s/dazzling-napier-ne3e6
function Form({ children, onSubmit, inputObj, ...rest }) {
  const { register, setValue, handleSubmit } = useForm();

    useEffect(() => {
        // Set the initial values
        // The controls' values are not really bound to any state or props so we have to update it here
        console.log('Form useEffect start');
        setControlValues(inputObj, setValue);
    }, [inputObj]); // Means if inputObj value does not change, don't run useEffect again.

  return (
    <FormContext.Provider value={{ register, setValue, handleSubmit }}>
      <SemanticForm onSubmit={handleSubmit(onSubmit)} {...rest}>
        {children}
      </SemanticForm>
    </FormContext.Provider>
  );
}

export { default as Text } from "./FormText";
export { default as FormCheckbox } from "./FormCheckbox";
export { default as Dropdown } from "./FormDropDown";

export default Form;
