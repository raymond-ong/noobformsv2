import React, { Component, useState, useEffect } from 'react';
import {getContentDiv} from './noobControlContent';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import {fetchData} from './chartApiManager';
import axios from 'axios';
import './reportForm.css'

import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import {clickChartSlice, selectChartGroup} from '../actions/index';


const ROW_HEIGHT = 40;
const CONTROL_PADDING = 20;
const GRID_GAP = 5;

// a. sliceInfo: the category(ies) of pie chart/bar chart (e.g. vendor="Yokogawa"+model="EJA")
// b.seriesInfo: only applicable to bar chart, e.g. PRM device status = Normal
// c. groupingStackStr: e.g. "[vendor,model]"
// For sending request to API, we only need a and b
// For calculating the active index, we need a, b and c
const handleChartClick = (sliceInfo, seriesInfo, groupingStackStr, controlData, clickChartSlice) => {
    // Fire a redux action
    clickChartSlice(sliceInfo, seriesInfo, groupingStackStr, controlData.data.dataProps.datasetId, controlData.i);
}

const handleGroupSelect = (groupingValue, controlData, selectChartGroup) => {
    selectChartGroup(groupingValue, controlData);
}

const ReportControl = ({layoutName, controlData, containerWidth, clickChartSlice, selectChartGroup, datasetFilters, currControlGrouping, metadata, pageFilters}) => {
    // [a] Data Preparations
    const [apiData, setApiData] = useState();
    const [isLoading, setIsLoading] = useState(!!controlData.dataProps);

    useEffect(() => {     
        debugger   
        if (controlData.data && controlData.data.dataProps) {                        
            fetchData(controlData, setIsLoading, setApiData, datasetFilters, currControlGrouping, metadata, pageFilters);
        }
    }, [datasetFilters, currControlGrouping, layoutName, pageFilters]); 


    // [b] UI Preparations    
    if (controlData.data && controlData.data.dataProps && !isLoading) {
        // TODO: not sure if this would affect the global object (permanently stored to the global object)
        // If yes, just clone this object
        controlData.apiData = apiData;
        controlData.datasetFilters = datasetFilters; // don't put this inside dataProps to avoid sending it over the network
        controlData.currControlGrouping = currControlGrouping;
        controlData.handleChartClick = (sliceInfo, seriesInfo, groupingStackStr) => handleChartClick(sliceInfo, seriesInfo, groupingStackStr, controlData, clickChartSlice);
        controlData.handleGroupSelect = (groupValue) => handleGroupSelect(groupValue, controlData, selectChartGroup);
        controlData.metadata = metadata;
        controlData.layoutName = layoutName;
    }

    let classNames = 'reportControl';
    let usableWidth = containerWidth; // 20 for the noobform left and right padding of 10 each
    let widthOfCtrl = usableWidth * controlData.w / 12.0; // 12 is the number of columns; minus 5 for the grid gap
    if (controlData.w < 12) {
        widthOfCtrl -= 5;
    }
    
    let ctrlStyle = {
        // set the minHeight instead of height. Height will make the height fixed regardless of the content.
        // minHeight allows the parent container to grow depending on content
        //'minHeight': (ROW_HEIGHT * controlData.h) + (CONTROL_PADDING * (controlData.h - 1)) + (GRID_GAP * (controlData.h - 1)), 
        // Maybe no need to include padding and grid gap
        'minHeight': (ROW_HEIGHT * controlData.h), 
    }
    // [b1] - Normal desktop size layout
    ctrlStyle.gridRowEnd = 'span ' + controlData.h;
    ctrlStyle.gridColumnEnd = 'span ' + controlData.w;
    ctrlStyle.maxWidth = `${widthOfCtrl}px`; 
    
    controlData.selected = false; // Override...so that it won't show up as selected
    controlData.maxWidth = `${widthOfCtrl}px`; 
    console.log('render ReportControl', controlData.i, widthOfCtrl, containerWidth);
    // [c] Render:
    // [c.1] return the landing pad first, which is only shown when the control is being resized
    // [c.2] followed by the content
    // [c.3] followed by the placeholder which will only be visible during resizing. Purpose is maintain the original size of the container while resizing.
    // [c.4] followed by the small resizer.
    // [c.5] followed by the settings button
    //       This order must be followed to avoid the need for z-index
    return <div 
                className={classNames} 
                style={ctrlStyle}
            >
                {isLoading && <Dimmer active inverted>
                    <Loader>{`Fetching ${controlData.ctrlType} data`}</Loader>
                    </Dimmer>
                }
                {getContentDiv(controlData, "dashboard")}
        </div>
}

const mapStateToProps = (state, ownProps) => {
    let controlData = ownProps.controlData;
    if (!controlData || !controlData.data || !controlData.data.dataProps) {
        return {};    // to avoid re-rendering controls that do not have dataProps
    }

    // We are only concerned about changes in the datasetId this control belongs to
    return {
        // Contains the slices/bars clicked by the user
        datasetFilters: state.dashboard.chartClickFilters[controlData.data.dataProps.datasetId],
        currControlGrouping: state.dashboard.chartTempGroupings[controlData.i]
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ clickChartSlice, selectChartGroup }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportControl);