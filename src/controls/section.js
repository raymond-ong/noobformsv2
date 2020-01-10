import React, {useState, useEffect} from 'react';
import './section.css';
import './common.css';
import noobControlHoc from '../hoc/noobControlsHoc';

const getFontSize = (level) => {
    if (!!level) {
        return 26 - level * 2;
    }    

    return 20;
}

const Section = (props) => {
    console.log('section render', props.style);
    let styles = {
        fontSize: getFontSize(props.data.level)
    };
    let classNames = 'section';
    if (props.selected === true) {
        classNames += ' ctrl-selected'
    }

    let combinedStyle = {...props.style, ...styles};

    return <div className={classNames} style={combinedStyle}>
        {props.data.title}
    </div>
}
export default noobControlHoc(Section);


/* This region is for the Props Pane */
const levelOptions = [
    { key: 'level-1', text: '1', value: 1 },    
    { key: 'level-2', text: '2', value: 2 },    
    { key: 'level-3', text: '3', value: 3 },    
    { key: 'level-4', text: '4', value: 4 },    
];

// Include the unique props that need to be customized only
// Props that are not included will be automatically rendered as textbox
// Common props like control type and id will be taken care of by the Properties Panel
export const sectionProps = [
    {
        // label prop: no need to include if no need to customize. Will automatically title-ize the 'name'
        name: 'level', 
        propType: 'combo',
        options: levelOptions
    },
]