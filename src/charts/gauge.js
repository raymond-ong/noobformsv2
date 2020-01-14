import React from 'react';
import '../controls/common.css';
import './gauge.css'
import {ResponsiveContainer} from 'recharts';
import noobControlHoc from '../hoc/noobControlsHoc';
import GaugeChart from 'react-gauge-chart';

const Gauge = (props) => {
    console.log('gauge render', props.h);
    let classNames = 'gauge';
    if (props.selected === true) {
        classNames += ' ctrl-selected'
    }

    // Bug: This chart does not respect the height; only the width
    return <div className={classNames}>
        <div className="controlLabel">{props.data.label}</div>
        <ResponsiveContainer  width="100%" height="90%">
            <GaugeChart id={props.i}
            nrOfLevels={20} 
            percent={props.data.percent} 
            textColor={"black"}
            colors={['red', 'gold', 'green']}
            marginInPercent={0.055}
            style={{width: '100%'}}
            />
        </ResponsiveContainer>

    </div>
}
export default noobControlHoc(Gauge);