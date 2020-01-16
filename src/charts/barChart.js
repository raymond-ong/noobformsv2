import React, { PureComponent, useRef, useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
  } from 'recharts';
  import './barChart.css';  

import '../controls/common.css';
import './rechartsCommon.css';
import noobControlHoc from '../hoc/noobControlsHoc';

const data = [
  {
    date: '2000-01', "Time in Preferred Mode": 4000, "Time in Control": 2400, "Time MV out of Limits": 2400,
  },
  {
    date: '2000-02', "Time in Preferred Mode": 3000, "Time in Control": 1398, "Time MV out of Limits": 2210,
  },
  {
    date: '2000-03', "Time in Preferred Mode": 2000, "Time in Control": 9800, "Time MV out of Limits": 2290,
  },
  {
    date: '2000-04', "Time in Preferred Mode": 2780, "Time in Control": 3908, "Time MV out of Limits": 2000,
  },
  {
    date: '2000-05', "Time in Preferred Mode": 1890, "Time in Control": 4800, "Time MV out of Limits": 2181,
  },
  {
    date: '2000-06', "Time in Preferred Mode": 2390, "Time in Control": 3800, "Time MV out of Limits": 2500,
  },
  {
    date: '2000-07', "Time in Preferred Mode": 3490, "Time in Control": 4300, "Time MV out of Limits": 2100,
  },
  {
    date: '2000-08', "Time in Preferred Mode": 4000, "Time in Control": 2400, "Time MV out of Limits": 2400,
  },
  {
    date: '2000-09', "Time in Preferred Mode": 3000, "Time in Control": 1398, "Time MV out of Limits": 2210,
  },
  {
    date: '2000-10', "Time in Preferred Mode": 2000, "Time in Control": 9800, "Time MV out of Limits": 2290,
  },
  {
    date: '2000-11', "Time in Preferred Mode": 2780, "Time in Control": 3908, "Time MV out of Limits": 2000,
  },
  {
    date: '2000-12', "Time in Preferred Mode": 1890, "Time in Control": 4800, "Time MV out of Limits": 2181,
  },
];

const monthTickFormatter = (tick) => {
  const date = new Date(tick);

  return date.getMonth() + 1;
};

const renderQuarterTick = (tickProps) => {
  const { x, y, payload } = tickProps;
  const { value, offset } = payload;
  const date = new Date(value);
  const month = date.getMonth();
  const quarterNo = Math.floor(month / 3) + 1;
  const isMidMonth = month % 3 === 1;

  if (month % 3 === 1) {
    return <text x={x + offset} y={y - 4} textAnchor="middle">{`Q${quarterNo}`}</text>;
  }

  const isLast = month === 11;

  if (month % 3 === 0 || isLast) {
    const pathX = Math.floor(isLast ? x + offset * 2 : x) + 0.5;

    return <path d={`M${pathX},${y - 4}v${-35}`} stroke="darkgray" />;
  }
  return null;
};

export const BarChartForReport = (props) => {
  const chartContainerEl = useRef();
  const [myState, setMyState] = useState({
    height: 0,
    width: 0
  });

  useEffect(() => {
    console.log('[DEBUG] useEffect bar', chartContainerEl);
    if (!chartContainerEl || !chartContainerEl.current) {
      return;
    }
    let rect = chartContainerEl.current.getClientRects()[0]
    setMyState({
      height: rect.height,
      width: rect.width
    })
    
  }, []);

  return (
    <div className="reChartContainer" ref={chartContainerEl}>
      <div className="controlLabel">{props.data.label}</div>
        {renderChartContents(true, myState.width, myState.height)}
    </div>
  );  
}

// Just specify null for width and height if the BarChart is going to be placed inside a ResponsiveContainer
// Important to set isAnimationActive to false during printing
const renderChartContents = (bAnimate, width, height) => {
  return (
    <BarChart
              width={width}
              height={height}
              data={data}
              margin={{
              top: 20, right: 10, left: 5, bottom: 30,
              }}
          >
      <CartesianGrid vertical={false}/>
      <XAxis dataKey="date" tickFormatter={monthTickFormatter} />
      <XAxis dataKey="date" axisLine={false} tickLine={false} interval={0} tick={renderQuarterTick} height={1} scale="band" xAxisId="quarter" />
      <YAxis axisLine={false}/>
      <Tooltip />
      <Legend  wrapperStyle={{
      paddingTop: "10px"
      }}/>
      <Bar dataKey="Time in Control" fill="green" stackId="a" isAnimationActive={false} onClick={(args) => {
        console.log(args);}
        }/>
      <Bar isAnimationActive={bAnimate} dataKey="Time in Preferred Mode" fill="gold" stackId="a"/>      
      <Bar isAnimationActive={bAnimate} dataKey="Time MV out of Limits" fill="gray" stackId="a"/>      
    </BarChart>
  )
}

function BarChartResponsive(props) {
  let classNames = 'reChartContainer';
  if (props.selected === true) {
      classNames += ' ctrl-selected'
  }

  return (
    <div className={classNames}>
      <div className="controlLabel">{props.data.label}</div>
      <ResponsiveContainer width={"100%"} height="100%">
        {renderChartContents(true, null, null)}
      </ResponsiveContainer>
    </div>
  );
}

export default noobControlHoc(BarChartResponsive);