import React, { useContext, useState } from "react";
import { FormContext } from "./Form";
import { RHFInput } from "react-hook-form-input";
import { Form as SemanticForm } from "semantic-ui-react";
import './FormRadio.css';

function FormRadio({ name, initialSel, radioGroupContents, ...rest }) {
  const { register, setValue, unregister } = useContext(FormContext);

  function handleChange(args, {value}) {
    setMyState({value});
    setValue(name, value);
  }

  const [myState, setMyState] = useState({
    value: initialSel,
  });

  const renderRadioBtn = (radio) => {
    return <SemanticForm.Radio 
    key={'radio_' + radio.value}
    label={radio.label}
    name={radio.name} // radio group name
    value={radio.value}
    checked={myState.value === radio.value}
    onChange={handleChange} />
  }

  return (
    <RHFInput
      as={<div className="radioGroupContainer">
          {radioGroupContents.map(radio => renderRadioBtn(radio))}
        </div>
      }
      name={name}
      register={register}
      unregister={unregister}
      setValue={setValue}
      onChangeEvent={handleChange}
    />
  );
}

export default FormRadio;
