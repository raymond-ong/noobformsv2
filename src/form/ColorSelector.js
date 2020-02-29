import React, { useContext, useState } from "react";
import { FormContext } from "./Form";
import { RHFInput } from "react-hook-form-input";
import { Form as SemanticForm, Popup } from "semantic-ui-react";

const fieldWrapperStyle = {
    display: 'inline-block',
};

function FormColorSelector({ name, rules, label, intialcolor, ...rest }) {
  const { register, setValue, unregister } = useContext(FormContext);
  const [myState, setMyState] = useState({
    currVal: intialcolor
  });

  console.log('FormColorSelector render', intialcolor);

  return (<SemanticForm.Field>
            <label key={'label-'+name}>
                <span>{label}</span>
                &nbsp;
                <Popup 
                    inverted
                    basic
                    size='tiny' style={{opacity: '0.8'}} 
                    content='CSS color, e.g. "red", "#abcdef"' 
                    trigger={<div style={{display: 'inline-block', color: 'gray'}}>
                    <i className="ui icon info circle"/>
                    </div>} />
            </label>
            <div className="ui icon input fluid">
            <RHFInput
                as={<input  key={name} 
                    // name={name}
                    style={fieldWrapperStyle}
                    onInput = {(e) => {
                        console.log('FormIconSelector onInput!', );
                        setMyState({
                            currVal: e.target.value
                        })
                    }}
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
            <i className={`ui icon large square`} style={{color: myState.currVal}}/>
            </div>
        </SemanticForm.Field>
  );
}

export default FormColorSelector;
