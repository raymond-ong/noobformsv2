import React, { Component } from 'react';
import NoobForm from './noobForm';

// controls
import Section from '../controls/section';
import RichText from '../controls/richtext';
import Combobox from '../controls/combo';

const ROW_HEIGHT = 40;
const CONTROL_PADDING = 20;
const GRID_GAP = 5;

const getContentDiv = (controlData) => {
    switch(controlData.type) {
        case 'section':
            return <Section {...controlData}></Section>
        case 'richtext':
            return <RichText {...controlData}></RichText>
        case 'combo':
            return <Combobox {...controlData}></Combobox>
        default:
            return <div>{controlData.title}</div>
    }
}

const NoobControl = ({controlData}) => {
    let classNames = 'noobControl';
    let ctrlStyle = {
        // set the minHeight instead of height. Height will make the height fixed regardless of the content.
        // minHeight allows the parent container to grow depending on content
        // actually we have not accounted for the Grid Gap yet...In case all the controls
        'minHeight': (ROW_HEIGHT * controlData.h) + (CONTROL_PADDING * (controlData.h - 1)) + (GRID_GAP * (controlData.h - 1)), 
        'gridRowEnd': 'span ' + controlData.h,
        'gridColumnEnd': 'span ' + controlData.w,
    };
    let contentDiv = getContentDiv(controlData)
    // return the content first, followed by the landing pad
    return <div className={classNames} style={ctrlStyle}>
        {contentDiv}
    </div>
}

export default NoobControl;