
import React, {useState, useContext} from 'react';
import '../controls/datepicker.css';
import noobControlHoc from '../hoc/noobControlsHoc';
import DatePicker from 'react-datepicker';
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

const FormImageCoord = ({ name, x, y, color, ...rest }) => {
    //const [startDate, setStartDate] = useState(new Date());
    // No need to set initial values
    const { register, setValue, unregister, errors } = useContext(FormContext);
    const [currColor, setCurrColor] = useState(color);

    function handleChangeValue([, props]) {
        return { value: props.value};
      }

    return <>
                <div className="dateLabel">Name:</div>
                <RHFInput
                    as={<input  
                        key={name} 
                        className="ui small" 
                        defaultValue={name}
                        readOnly
                        {...rest}>
                        </input>
                    }

                name={name+".name"}
                register={register}
                unregister={unregister}
                setValue={setValue}
                />
                
                <div className="dateLabel">X:</div>
                <RHFInput
                    as={<input  
                        key={name} 
                        className="ui small" 
                        defaultValue={x}
                        readOnly
                        {...rest}>
                        </input>
                    }

                name={name + ".x"}
                register={register}
                unregister={unregister}
                setValue={setValue}
                />
                
                <div className="dateLabel">Y:</div>
                <RHFInput
                    as={<input  
                        key={name} 
                        className="ui small" 
                        defaultValue={y}
                        readOnly
                        {...rest}>
                        </input>
                    }

                name={name + ".y"}
                register={register}
                unregister={unregister}
                setValue={setValue}
                />

                <div className="dateLabel">Color:</div>
                <div className="ui icon input fluid">
                <RHFInput
                    as={<input  
                        key={name} 
                        className="ui small" 
                        defaultValue={color}
                        onInput = {(e) => {
                            setCurrColor(e.target.value);
                        }}
                        {...rest}>
                        </input>
                    }

                name={name + ".color"}
                register={register}
                unregister={unregister}
                setValue={setValue}
                />
                <i className={`ui icon large square`} style={{color: currColor}}/>
                </div>

                <i className="ui icon trash alternate btnImageFormCoordDelete" />

        </>
}
export default FormImageCoord;
