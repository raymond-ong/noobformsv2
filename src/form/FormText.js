import React, { useContext } from "react";
import { FormContext } from "./Form";
import { RHFInput } from "react-hook-form-input";
import { Form as SemanticForm, Popup } from "semantic-ui-react";

function FormText({ name, rules, label, numeric, units, ...rest }) {
  const { register, setValue, unregister } = useContext(FormContext);

  return (<SemanticForm.Field>
            {label && <label>
              <span key={'label-'+name}>{label}</span>
              &nbsp;
              {!!units && <Popup 
                  inverted
                  basic
                  size='tiny' style={{opacity: '0.8'}} 
                  content={`Units: ${units}`}
                  trigger={<div style={{display: 'inline-block', color: 'gray'}}>
                  <i className="ui icon info circle"/>
                  </div>} />
              }
            </label>}
            <RHFInput
                as={<input  
                      key={name} 
                      type={!!numeric ? 'number':'text'}
                      className="ui small" 
                      {...rest}>                        
                      </input>
                }

            defaultValue=""
            name={name}      
            register={register}
            unregister={unregister}
            setValue={setValue}
            rules={rules}
            />
        </SemanticForm.Field>
  );
}

export default FormText;
