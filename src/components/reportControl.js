import React, { Component } from 'react';
import {getContentDiv} from './noobControlContent';
import './reportForm.css'


const ROW_HEIGHT = 40;
const CONTROL_PADDING = 20;
const GRID_GAP = 5;


const ReportControl = ({controlData, additionalStyle}) => {
    
    console.log('render ReportControl');
    

    // [b] Preparations
    let classNames = 'reportControl';
    let ctrlStyle = {
        ...additionalStyle,
        // set the minHeight instead of height. Height will make the height fixed regardless of the content.
        // minHeight allows the parent container to grow depending on content
        //'minHeight': (ROW_HEIGHT * controlData.h) + (CONTROL_PADDING * (controlData.h - 1)) + (GRID_GAP * (controlData.h - 1)), 
        // Maybe no need to include padding and grid gap
        'minHeight': (ROW_HEIGHT * controlData.h), 
    }
    // [b1] - Normal desktop size layout
    ctrlStyle.gridRowEnd = 'span ' + controlData.h;
    ctrlStyle.gridColumnEnd = 'span ' + controlData.w;
   
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
                {getContentDiv(controlData)}
        </div>
}

export default ReportControl;