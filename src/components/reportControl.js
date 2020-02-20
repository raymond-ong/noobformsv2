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


const handleChartClick = (sliceInfo, groupingStackStr, controlData, clickChartSlice) => {
    // Fire a redux action
    clickChartSlice(sliceInfo, groupingStackStr, controlData.dataProps.datasetId, controlData.i);
}

const handleGroupSelect = (groupingValue, controlData, selectChartGroup) => {
    selectChartGroup(groupingValue, controlData);
}

const ReportControl = ({controlData, containerWidth, numCols, clickChartSlice, selectChartGroup, datasetFilters, currControlGrouping}) => {
    // [a] Data Preparations
    const [apiData, setApiData] = useState();
    const [isLoading, setIsLoading] = useState(!!controlData.dataProps);

    useEffect(() => {        
        if (controlData.dataProps) {                        
            fetchData(controlData, setIsLoading, setApiData, datasetFilters, currControlGrouping);
        }
    }, [datasetFilters, currControlGrouping]); 


    // [b] UI Preparations
    if (controlData.dataProps && !isLoading) {
        // TODO: not sure if this would affect the global object (permanently stored to the global object)
        // If yes, just clone this object
        controlData.apiData = apiData;        
        controlData.datasetFilters = datasetFilters; // don't put this inside dataProps to avoid sending it over the network
        controlData.currControlGrouping = currControlGrouping;
        controlData.handleChartClick = (sliceInfo, groupingStackStr) => handleChartClick(sliceInfo, groupingStackStr, controlData, clickChartSlice);
        controlData.handleGroupSelect = groupValue => handleGroupSelect(groupValue, controlData, selectChartGroup);
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

    console.log('render ReportControl', controlData.i, isLoading);
    controlData.selected = false; // Override...so that it won't show up as selected
    controlData.maxWidth = `${widthOfCtrl}px`; 
   
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
    if (!controlData || !controlData.dataProps) {
        return {};    // to avoid re-rendering controls that do not have dataProps
    }

    // We are only concerned about changes in the datasetId this control belongs to
    return {
        // Contains the slices/bars clicked by the user
        datasetFilters: state.dashboard.chartClickFilters[controlData.dataProps.datasetId],
        currControlGrouping: state.dashboard.chartTempGroupings[controlData.i]
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ clickChartSlice, selectChartGroup }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportControl);