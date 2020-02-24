import React, { useContext } from "react";
import { FormContext } from "./Form";
import { RHFInput } from "react-hook-form-input";
import { Form as SemanticForm, Popup } from "semantic-ui-react";

function FormCheckbox({ name, label, toolTip, ...rest }) {
  const { register, setValue, unregister } = useContext(FormContext);

  function handleChange([, props]) {
    return { checked: props.checked };
  }

  return (<SemanticForm.Field>
    {label && <label>
              <span key={'label-'+name}>{label}</span>
              &nbsp;
              {!!toolTip && <Popup 
                  inverted
                  basic
                  size='tiny' style={{opacity: '0.8'}} 
                  content={toolTip}
                  trigger={<div style={{display: 'inline-block', color: 'gray'}}>
                  <i className="ui icon info circle"/>
                  </div>} />
              }
    </label>}    
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
    </SemanticForm.Field>
  );
}

export default FormCheckbox;
