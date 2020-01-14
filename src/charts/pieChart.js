import React, { PureComponent, Component, useRef, useEffect, useState } from 'react';
import {
  PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend
} from 'recharts';
import '../controls/common.css';
import './pieChart.css';
import './rechartsCommon.css';
import noobControlHoc from '../hoc/noobControlsHoc';

const data = [
  { name: 'Good', value: 400 },
  { name: 'Bad', value: 300 },
  { name: 'Fair', value: 300 },
  { name: 'Uncertain', value: 200 },
];

const COLORS = ['green', 'red', 'gold', 'gray'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index, name
}) => {
   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${name} - ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

let renderLabel = function(entry) {
    return `${entry.name} - ${(entry.percent*100).toFixed(1)}%`;
}


// The ResponsiveContainer from recharts is buggy during printing
// We manually set the height and width of the container by querying the DOM
export const PieForReport = (props) => {
  const chartContainerEl = useRef();
  const [myState, setMyState] = useState({
    height: 0,
    width: 0
  });

  useEffect(() => {
    console.log('[DEBUG] useEffect pie', chartContainerEl);
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
      <div className="controlLabel">{props.data.label + ' width: ' + myState.width}</div>
      <PieChart 
          margin={{top: 20, right: 15, left: 15, bottom: 40}}
          height={myState.height}
          width={myState.width}
      >
        {renderPie()}
        {renderLegend()}
      </PieChart>
    </div>
  );  
}

// The ResponsiveContainer from recharts is OK when viewing from the web browser,
// but buggy during PDF generation (e.g. not taking entire width and height of the container)
const PieResponsive = (props) => {
  let classNames = 'reChartContainer';
  if (props.selected === true) {
      classNames += ' ctrl-selected'
  }
  let width = props.containerWidth ? props.containerWidth : '100%'
  return (
    <div id="pieContainer1" className={classNames}>
      <div className="controlLabel">{props.data.label}</div>
      <ResponsiveContainer  width="100%" height="100%">
        <PieChart margin={{top: 20, right: 20, left: 20, bottom: 40}}>
          {renderPie()}
          {renderLegend()}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );  
}

// Common function
// Renders Pie Chart and Legends
const renderPie = () => {
  return <Pie
      data={data}
      labelLine={true}
      //label={renderCustomizedLabel}
      label
      //label={renderLabel}
      //   outerRadius={100}
      fill="#8884d8"
      dataKey="value"
      isAnimationActive={false}
    >
      {
        data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
      }
    </Pie>;    
}

const renderLegend = () => {
  return <Legend 
    margin={{top: 10, right: 10, left: 10, bottom: 10}}
    verticalAlign="bottom" height={36}/>
}


// const PieChartSample = (props) => {
//   console.log('render pie!', props);

//   const pieContainerEl = useRef();
//   const [myState, setMyState] = useState({
//     height: 0,
//     width: 0
//   });

//   useEffect(() => {
//     console.log('[DEBUG] useEffect pie', pieContainerEl);
//     if (!pieContainerEl || !pieContainerEl.current) {
//       return;
//     }
//     let rect = pieContainerEl.current.getClientRects()[0]
//     setMyState({
//       height: rect.height,
//       width: rect.width
//     })
    
//   }, []);

//   let classNames = 'reChartContainer';
//   if (props.selected === true) {
//       classNames += ' ctrl-selected'
//   }
//   let width = props.containerWidth ? props.containerWidth : '100%'
//   return (
//     <div id="pieContainer1" className={classNames} ref={pieContainerEl}>
//       <div className="controlLabel">{props.data.label}</div>
//       {/* <ResponsiveContainer  width={width} height="100%"> */}
//         <PieChart 
//           id="thePie" 
//           margin={{top: 20, right: 10, left: 10, bottom: 40}}
//           height={myState.height}
//           width={myState.width}
//         >
//           <Pie
//             data={data}
//             labelLine={true}
//           //   label={renderCustomizedLabel}
//           label
//           //label={renderLabel}
//           //   outerRadius={100}
//             fill="#8884d8"
//             dataKey="value"
//             isAnimationActive={false}
//           >
//             {
//               data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
//             }
//           </Pie>
//           <Legend verticalAlign="top" height={36}/>
//         </PieChart>
//       {/* </ResponsiveContainer> */}
//     </div>
//   );  
// }

export default noobControlHoc(PieResponsive);

// export default noobControlHoc(Example);