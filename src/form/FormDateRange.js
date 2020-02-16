import React, {useState, useContext} from 'react';
import '../controls/datepicker.css';
import noobControlHoc from '../hoc/noobControlsHoc';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Label} from "semantic-ui-react";
import { FormContext } from "./Form";
import { RHFInput } from "react-hook-form-input";


const FormDateRange = ({ name, ...rest }) => {
    //const [startDate, setStartDate] = useState(new Date());
    // No need to set initial values
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
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

    return <div className="datepickerGrid">
                <div className className="dateLabel">Start:</div>
                <div className="datepickerWrapper">
                <RHFInput
                    as={<DatePicker
                    selected={startDate}
                    //onChange={date => setStartDate(date)}
                    //onChange={args => {debugger}}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
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
        </div>
}
export default noobControlHoc(FormDateRange);
