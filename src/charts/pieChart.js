import React, { PureComponent, Component, useRef, useEffect, useState } from 'react';
import {
  PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend, Tooltip
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

const COLORS = ['green', 'red', 'gold', 'gray', 'cyan', 'magenta', 'black', 'lime', 'teal', 'pink', 'violet', 'orange', 'blue', 'indigo'];

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

// Visual cue to identify which wedge is the active one.
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      {/* <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text> */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 3}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      {/* <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text> */}
    </g>
  );
};

export class PieWithData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: props.activeIndex
    };
  }

  onPieClick = (sectorInfo, index) => {
    //let sectorIndex = args[1];
    this.setState({
      activeIndex: index
    });

    if (this.props.pieClickCallback) {
      this.props.pieClickCallback(sectorInfo);
    }
  }

  componentDidUpdate(previousProps, previousState) {
  }

  renderPieWithData = (props) => {
    return <Pie
      data={props.data}
      labelLine={true}
      //label={renderCustomizedLabel}
      label
      //label={renderLabel}
      //   outerRadius={100}
      fill="#8884d8"
      dataKey="value"
      isAnimationActive={false}
      onClick={this.onPieClick}
      activeIndex={this.props.activeIndex}
      activeShape={renderActiveShape}
    >
      {
        props.data.map((entry, index) => {
          return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        })
      }
    </Pie>;    
  }

  render() {
    return <PieChart margin={{top: 20, right: 20, left: 20, bottom: 40}} width={400} height={400}>
      {this.renderPieWithData(this.props)}
      {renderLegend()}
      <Tooltip />
    </PieChart>
  }
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