import React, {useState, useContext} from 'react';
import '../controls/datepicker.css';
import noobControlHoc from '../hoc/noobControlsHoc';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Label, Dropdown} from "semantic-ui-react";
import { FormContext } from "./Form";
import { RHFInput } from "react-hook-form-input";

export const conditionOptions = [
    { key: 'Equal', text: '=', value: 'Equal' },
    { key: 'Greater', text: '>', value: 'Greater', disabled: true},
    { key: 'LessThan', text: '<', value: 'LessThan', disabled: true },
    { key: 'In', text: 'In', value: 'In', disabled: true },
    { key: 'NotIn', text: 'Not In', value: 'NotIn', disabled: true },
];

const FormFilterInput = ({ name, label, initialValue, ...rest }) => {
    //const [startDate, setStartDate] = useState(new Date());
    // No need to set initial values
    const { register, setValue, unregister, errors } = useContext(FormContext);

    function handleChangeValue([, props]) {
        return { value: props.value};
      }

    return <>
                <div className="dateLabel">Parameter:</div>

                <RHFInput
                    as={<input  
                        key={name} 
                        className="ui small" 
                        defaultValue={name}
                        readOnly
                        {...rest}>                        
                        </input>
                    }

                //name={name}
                register={register}
                unregister={unregister}
                setValue={setValue}
                />
                
                <div className="dateLabel">Condition:</div>
                <div className="datepickerWrapper">
                <RHFInput
                    as={<Dropdown 
                        fluid                 
                        selection   
                        options={conditionOptions} 
                        defaultValue={initialValue ? initialValue : conditionOptions[0].value}         
                     />}

                name={name+"Condition"}
                register={register}
                unregister={unregister}
                setValue={setValue}
                />
            </div>
            <div className="dateLabel">Value:</div>
            <div className="datepickerWrapper datepickerWrapperEnd">
            <RHFInput
            as={<input  
                    key={name} 
                    className="ui small" 
                    {...rest}>                        
                </input>
            }

            defaultValue=""
            name={name}
            register={register}
            unregister={unregister}
            setValue={setValue}

            />
        </div>
        </>
}
export default FormFilterInput;
