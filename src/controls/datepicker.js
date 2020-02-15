import React, {useState} from 'react';
import './datepicker.css';
import noobControlHoc from '../hoc/noobControlsHoc';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const DateSelector = (props) => {
    //return <div>Hello</div>
    // const [startDate, setStartDate] = useState(new Date());
    // return (<DatePicker selected={startDate} onChange={date => setStartDate(date)} />);    

    let classNames = props.selected === true ? 'ctrl-selected' : '';

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    return <div className={classNames}>
        <div className="controlLabel">{props.data.label}</div>
        <div className="datepickerGrid">
        <div className className="dateLabel">Start:</div>
        <div className="datepickerWrapper">
            <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            />
        </div>

        <div className="dateLabel">End:</div>
        <div className="datepickerWrapper">
            <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            />        
        </div>
        </div>
    </div>
}
export default noobControlHoc(DateSelector);
