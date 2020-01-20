import React from 'react';

//import dc from 'dc';
//import dc from 'dc';
import crossfilter from 'crossfilter2';
import * as d3 from 'd3/dist/d3';
import "dc/dist/style/dc.css";
import {
    ResponsiveContainer
  } from 'recharts';
import noobControlHoc from '../hoc/noobControlsHoc';


const dc = require("dc");

const generateData = () => {
    let numTargets = 10;
    let diagKpis = {
        "Loop Controllability": ["Time in Control", "Time in Preferred Mode"],
        "Valve Controllability": ["Time in Control", "Total Deviation Time"],
    };
    let kpiStatuses = ["Good", "Bad", "Fair", "Uncertain"];

    let retList = [];

    for (let i = 0; i < numTargets; i++) {
        let diags = Object.keys(diagKpis);
        for (let iDiag = 0; iDiag < diags.length; iDiag++) {
            let kpis = diagKpis[diags[iDiag]];
            for (let iKpi = 0; iKpi < kpis.length; iKpi++) {
                retList.push({
                    targetName: `Target_${i}`,
                    diagName: diags[iDiag],
                    kpiname: kpis[iKpi],
                    kpiStatus: kpiStatuses[i % kpiStatuses.length],
                    kpiValue: i + iDiag + iKpi
                });
            }
        }
    }

    return retList;
}

class DCChart extends React.Component {

    constructor(props) {
        super(props);
        this.myRefChart = React.createRef();
        this.theChart = null;
    }

    componentDidMount = () => {
        var kpis = crossfilter(generateData());
        const dimensionKpi = kpis.dimension(function (data) {
            return data.kpiStatus;
        });
        const groupKpi = dimensionKpi.group();
        //const kpiStatusChart = dc.rowChart(this.myRefChart.current)
        this.theChart = dc.rowChart(this.myRefChart.current)
        .dimension(dimensionKpi)
        .group(groupKpi)    
        .ordinalColors(['#00aa00', '#aa2222', '#999900', '#555555'])   
        // .height(null)         
        // .width(null)     
        // .elasticY(true)
        .elasticX(true)  
        .render();
    }

    componentDidUpdate = (prevProps) => {
        console.log('DC JS componentDidUpdate');
        if (prevProps.w === this.props.w &&
            prevProps.h === this.props.h) {
                return;
        }

        //debugger
        //this.myRefChart.current.render();
        // dc.renderAll(this.myRefChart.current);
        this.theChart.render();
    }

    render() {
        let classNames = '';
        if (this.props.selected === true) {
            classNames += ' ctrl-selected'
        }
      
        console.log('DC JS', this.props.w);
        return <div style={{width: '100%', height: '100%'}} className={classNames}>
        <div id="myDcBarChart" style={{width: '100%', height: '100%'}} ref={this.myRefChart}/>
        </div>
    }
}

export default noobControlHoc(DCChart);
//export default DCChart;