import React, { Component } from 'react';
import NoobForm from './noobForm';
import { DragItemTypes } from './toolItem';
import { useDrop } from 'react-dnd';

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
            return <div>{controlData.i}</div>
    }
}

const canDropMe = (controlData) => {
    // console.log('canDropMe', controlData);
    // Note: this function will be called for each mouse movement, so make sure this is efficient
    return !controlData.type;
}

const getBackColor = (isOver, canDrop) => {
    let backColor = 'white';
    if (isOver) {
        if (canDrop) {
            backColor = 'lime'
        }
        else {
            backColor = 'pink'
        }
    }

    return backColor;
}

const NoobControl = ({controlData}) => {

    // [a] Hooks setup for drop
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: DragItemTypes.TOOLITEM,
        canDrop: () => canDropMe(controlData),
        drop: () => console.log('dropped me @', controlData),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
		}),
      })

    // [b] Preparations
    let classNames = 'noobControl';

    let ctrlStyle = {
        // set the minHeight instead of height. Height will make the height fixed regardless of the content.
        // minHeight allows the parent container to grow depending on content
        'minHeight': (ROW_HEIGHT * controlData.h) + (CONTROL_PADDING * (controlData.h - 1)) + (GRID_GAP * (controlData.h - 1)), 
        'gridRowEnd': 'span ' + controlData.h,
        'gridColumnEnd': 'span ' + controlData.w,
        'backgroundColor': getBackColor(isOver, canDrop)
    };
    let contentDiv = getContentDiv(controlData)
    
    // [c] Render:
    // [c.1] return the content first
    // [c.2] followed by the landing pad
    return <div 
            className={classNames} 
            style={ctrlStyle}
            ref={drop}
            >
        {contentDiv}
    </div>
}

export default NoobControl;