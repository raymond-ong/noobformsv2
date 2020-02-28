import React, {useState, useContext} from 'react';
import '../controls/datepicker.css';
import noobControlHoc from '../hoc/noobControlsHoc';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Label, Dropdown} from "semantic-ui-react";
import { FormContext } from "./Form";
import { RHFInput } from "react-hook-form-input";

export const dateRangeDropdownOptions = [
    { key: 'Latest value only', text: 'Latest value only', value: 'Latest value only' },
    { key: 'Last 1 day', text: 'Last 1 day', value: 'Last 1 day' },
    { key: 'Last 7 days', text: 'Last 7 days', value: 'Last 7 days' },
    { key: 'Last 30 days', text: 'Last 30 days', value: 'Last 30 days' },
    { key: 'Custom Range', text: 'Custom Range', value: 'Custom Range' },
];

const FormDateRange = ({ name, label, initialValue, ...rest }) => {
    //const [startDate, setStartDate] = useState(new Date());
    // No need to set initial values
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [disableDatePicker, setDisableDatePicker] = useState(true);
    const { register, setValue, unregister, errors } = useContext(FormContext);

    function handleChangeStart([date, evt]) {
        setStartDate(date);
        return {
            value: date
        }
    }

    function handleChangeEnd([date, evt]) {
        setEndDate(date);
        return {
            value: date
        }
    }

    function handleChangeValue([, props]) {
        if (props.value === 'Custom Range') {
            setDisableDatePicker(false);
        }
        else {
            setStartDate(null);
            setEndDate(null);
        }

        return { value: props.value};
      }

    return <>
                <div className="dateLabel">{label}</div>

                <RHFInput
                    as={<Dropdown 
                        fluid                 
                        selection   
                        options={dateRangeDropdownOptions} 
                        defaultValue={initialValue ? initialValue : dateRangeDropdownOptions[0].value}         
                     />
                    }

                name={name+"Value"}
                //value={name}
                //type="daterange"
                register={register}
                unregister={unregister}
                setValue={setValue}
                onChangeEvent={handleChangeValue}
                />
                
                <div className="dateLabel">Start:</div>
                <div className="datepickerWrapper">
                <RHFInput
                    as={<DatePicker
                    selected={startDate}
                    //onChange={date => setStartDate(date)}
                    //onChange={args => {debugger}}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    disabled={disableDatePicker}
                    />}

                name={name+"Start"}
                //value={name}
                //type="daterange"
                register={register}
                unregister={unregister}
                setValue={setValue}
                onChangeEvent={handleChangeStart}
                />
            </div>
            <div className="dateLabel">End:</div>
            <div className="datepickerWrapper datepickerWrapperEnd">
            <RHFInput
            as={
                <DatePicker
                selected={endDate}
                //onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                disabled={disableDatePicker}
                />}

            name={name + "End"}
            //value={name}
            //type="daterange"
            register={register}
            unregister={unregister}
            setValue={setValue}
            onChangeEvent={handleChangeEnd}

            />
        </div>
        </>
}
export default FormDateRange
