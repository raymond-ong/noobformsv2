import React, { PureComponent, Component } from 'react';
import {
  PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend
} from 'recharts';
import '../controls/common.css';
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

const PieChartSample = (props) => {
  console.log('render pie!', props);
  let classNames = 'reChartContainer';
  if (props.selected === true) {
      classNames += ' ctrl-selected'
  }
  return (
    <div className={classNames}>
      <div className="controlLabel">{props.data.label}</div>
      <ResponsiveContainer  width="100%" height="100%">
        <PieChart margin={{top: 20, right: 10, left: 10, bottom: 40}}
            >
          <Pie
            data={data}
            labelLine={true}
          //   label={renderCustomizedLabel}
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
          </Pie>
          <Legend verticalAlign="top" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );  
}

export default noobControlHoc(PieChartSample);

// TODO: Try to remove the ResponsiveContainer
// Just make it semi-static
// Size will be fixed while there is no re-render
// E.g. If neighbour controls cause resizing of row height(e.g. combo selections by user), this chart will remain same height
// Only resize of this control will cause the width and height to be recomputed

// Try also nivo, since it also has Reponsive Support. But it does not allow much svg customization.

// class Example extends PureComponent {
//   static jsfiddleUrl = 'https://jsfiddle.net/alidingling/c9pL8k61/';

//   render() {
//     console.log('render pie', this.props);
//     let classNames = 'pieChartContainer';
//     if (this.props.selected === true) {
//         classNames += ' ctrl-selected'
//     }
//     return (
//       <div className={classNames}
//       ref={(node) => { this.container = node; }}>
//         <div className="controlLabel">{this.props.data.label}</div>
//         <ResponsiveContainer  width="90%" height="90%">
//           <PieChart 
//             //width={200} height={200}
//             margin={{top: 10, right: 20, left: 20, bottom: 10}}
//               >
//             <Pie
//               data={data}
//               labelLine={true}
//             //   label={renderCustomizedLabel}
//             label
//             //label={renderLabel}
//             //   outerRadius={100}
//               fill="#8884d8"
//               dataKey="value"
//               isAnimationActive={false}
//             >
//               {
//                 data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
//               }
//             </Pie>
//             <Legend verticalAlign="top" height={36}/>
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     );
//   }
// }

// export default noobControlHoc(Example);