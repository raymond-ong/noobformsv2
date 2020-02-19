import React, { PureComponent, useRef, useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,Cell
  } from 'recharts';
  import './barChart.css';  

import '../controls/common.css';
import './rechartsCommon.css';
import noobControlHoc from '../hoc/noobControlsHoc';
import _ from "lodash";

const COLORS = ['green', 'red', 'gold', 'gray', 'cyan', 'magenta', 'black', 'lime', 'teal', 'pink', 'violet', 'orange', 'blue', 'indigo'];

export const sampleData = [
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
        {renderChartContents(true, myState.width, myState.height, sampleData)}
    </div>
  );  
}

// Just specify null for width and height if the BarChart is going to be placed inside a ResponsiveContainer
// Important to set isAnimationActive to false during printing
const renderChartContents = (bAnimate, width, height, data) => {
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

// Notes:
// Maybe let the user to customize the following:
// - interval (ticks)
// - X axis height
// seriesList - must contain the actual names (e.g. "Good", "Bad","Fair")
// This function is for the trial page only
const renderChartContentsTrial = (bAnimate, width, height, data, category, seriesList) => {
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
      <XAxis height={100} dataKey={category} tick={<CustomizedAxisTickTrial />} interval={0} />
      <YAxis axisLine={false}/>
      <Tooltip />
      <Legend  verticalAlign="top" wrapperStyle={{
      paddingTop: "10px"
      }}/>


      <Bar dataKey={seriesList[0]} fill="green" strokeWidth={4} isAnimationActive={true} onClick={(...args) => {
        console.log('Bar clicked first cat', ...args);}
        }>
        {/* {
          data.map((entry, index) => (
            <Cell key={`cell-${index}`} stroke={'black'}  strokeWidth={2} myCellId={secondaryList[0]+index}/>
          ))
        } */}
      </Bar>
      <Bar dataKey={seriesList[1]} fill="gold" onClick={(...args) => {
        console.log('Bar clicked second cat', ...args);}
        }/>      
    </BarChart>
  )
}

const getUniqueValues = (data, seriesName) => {
  return _.uniq(data.map(d => d[seriesName]));
}

const extractName = (groupingArr, data) => {
  let vals = groupingArr.map(g => data[g]);
  return vals.join(' / ');
}

const formatBarchartData = (data, categories, seriesName, aggregation) => {
  let retList = [];
  for (let i = 0; i < data.length; i++) {
    let currData = data[i];
    let currCategoryVal = extractName(categories, currData); //e.g. "Yokogawa / EJA"
    let findRetList = retList.find(r => r.name === currCategoryVal);
    if (!findRetList) {
      findRetList = {name: currCategoryVal};
      retList.push(findRetList);
    }

    let seriesVal = currData[seriesName];
    findRetList[seriesVal] = currData[aggregation];    
  }

  return retList;
}

// For rendering an individual bar inside a barchart
const renderBars = (uniqSeriesNames) => {
  return uniqSeriesNames.map((seriesName, index) => {
    return <Bar key={`bar-${seriesName}-${index}`} dataKey={seriesName} fill={COLORS[index % COLORS.length]} strokeWidth={4} isAnimationActive={true} onClick={(...args) => {
      console.log('Bar clicked first cat', ...args);}
      }>  
    </Bar>
  }
  );      
}

// Input data sample:
// {PRM Device Status: "GOOD", Vendor: "Yokogawa", Model: "EJA", count: 100},
// {PRM Device Status: "BAD", Vendor: "Yokogawa", Model: "EJA", count: 100},
// {PRM Device Status: "FAIR", Vendor: "Yokogawa", Model: "EJA", count: 100},
// {PRM Device Status: "GOOD", Vendor: "Yokogawa", Model: "EJX", count: 100},
// {PRM Device Status: "BAD", Vendor: "Yokogawa", Model: "EJX", count: 100},
// {PRM Device Status: "FAIR", Vendor: "Yokogawa", Model: "EJX", count: 100},
// 
// Need to transform/compress it to:
// {name: "Yokogawa / EJA", GOOD: 100, BAD: 100, FAIR: 100},
// {name: "Yokogawa / EJX", GOOD: 100, BAD: 100, FAIR: 100},
// 
// categories: e.g. ["Vendor", "Model"]
// seriesName: e.g. "PRM Device Status"
// aggregation: "count"
const renderChartContentsUngroupedData = (bAnimate, width, height, data, categories, seriesName, aggregation) => {
  let uniqSeriesNames = getUniqueValues(data, seriesName);
  let formattedData = formatBarchartData(data, categories, seriesName, aggregation)

  return (
    <BarChart
              width={width}
              height={height}
              data={formattedData}
              margin={{
              top: 0, right: 10, left: 5, bottom: 30,
              }}
          >
      <CartesianGrid vertical={false}/>
      <XAxis height={100} dataKey={"name"} tick={<CustomizedAxisTick />} interval={0} />
      <YAxis axisLine={false}/>
      <Tooltip />
      <Legend  verticalAlign="top" wrapperStyle={{
      paddingBottom: "20px"
      }}/>
        {renderBars(uniqSeriesNames)}

    </BarChart>
  )
}

class CustomizedAxisTick extends PureComponent {
  render() {
    const {
      x, y, stroke, payload,
    } = this.props;

   
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-45)">{payload.value}</text>
      </g>
    );
  }
}

class CustomizedAxisTickTrial extends PureComponent {
  render() {
    const {
      x, y, stroke, payload,
    } = this.props;

    let jsonObj = JSON.parse(payload.value);
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-45)">{Object.values(jsonObj).join(' / ')}</text>
      </g>
    );
  }
}

export class BarChartWithData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: null
    }
  }

  render() {

    return (renderChartContentsTrial(true, 600, 400, 
      this.props.apiData, 
      this.props.primary, 
      this.props.secondaryList));
  }
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
        {renderChartContents(true, null, null, sampleData)}
      </ResponsiveContainer>
    </div>
  );
}

const getChartContents = (props) => {
  if (props.dataProps) {
    return renderChartContentsUngroupedData(true, 600, 400, 
      props.apiData.data, 
      props.dataProps.categories, 
      props.dataProps.seriesName,
      props.dataProps.aggregation)
  }
  else {
    return renderChartContents(true, null, null, sampleData);
  }
}


class BarResponsiveDataBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: null
    }
  }

  render() {
    let classNames = 'reChartContainer';
    if (this.props.selected === true) {
        classNames += ' ctrl-selected'
    }

    return (
      <div className={classNames}>
        <div className="controlLabel">{this.props.data.label}</div>
        <ResponsiveContainer width={"100%"} height="100%">        
        {getChartContents(this.props)}        
        </ResponsiveContainer>
      </div>);
  }
}

export const BarResponsiveData = noobControlHoc(BarResponsiveDataBase)



export default noobControlHoc(BarChartResponsive);