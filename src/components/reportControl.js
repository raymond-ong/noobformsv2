import React, { Component, useState, useEffect } from 'react';
import {getContentDiv} from './noobControlContent';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';


import axios from 'axios';
import './reportForm.css'


const ROW_HEIGHT = 40;
const CONTROL_PADDING = 20;
const GRID_GAP = 5;


const renderLoader = (controlData) => {
    return <Segment style={{width: '100%'}}>
            <Dimmer active inverted>
                <Loader>{`Fetching ${controlData.ctrlType} data`}</Loader>
            </Dimmer>
            </Segment>;
}

const ReportControl = ({controlData, containerWidth, numCols}) => {
    console.log('[DEBUG] render ReportControl', controlData.i);
    // [a] Data Preparations
    const [apiData, setApiData] = useState();
    const [isLoading, setIsLoading] = useState(!!controlData.dataProps);

    useEffect(() => {        
        const fetchData = async (dataProps) => {
            console.log('[DEBUG] useEffect ReportControl', controlData.i);
            setIsLoading(true);
            const result = await axios
                .post('http://localhost:60000/api/data', {HierarchyPath: "test"})
                .catch(error => {
                    console.error("Error fetching control data", controlData.i, error);

                });

            if (result && result.data) {
                setApiData(result.data);
            }
            setIsLoading(false);
        };

        if (controlData.dataProps) {                        
            fetchData(controlData.dataProps);
        }
    }, []); 


    // [b] UI Preparations
    if (controlData.dataProps && !isLoading) {
        controlData.apiData = apiData
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

    console.log('render ReportControl', controlData.i, widthOfCtrl);
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
                {controlData.dataProps && isLoading && renderLoader(controlData)}
                {(!controlData.dataProps || (controlData.dataProps && !isLoading)) && getContentDiv(controlData)}
        </div>
}

export default ReportControl;