import React, { useContext } from "react";
import { FormContext } from "./Form";
import { RHFInput } from "react-hook-form-input";
import { Form as SemanticForm } from "semantic-ui-react";

function FormText({ name, rules, label, ...rest }) {
  const { register, setValue, unregister } = useContext(FormContext);

  return (<SemanticForm.Field>
            <label key={'label-'+name}>{label}</label>
            <RHFInput
                as={<input  key={name} 
                            // name={name}
                            className="ui small" 
                            {...rest}></input>
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
