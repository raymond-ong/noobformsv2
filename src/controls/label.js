import React from 'react';
import './common.css';
import './label.css';
import { Input } from 'semantic-ui-react'
import noobControlHoc from '../hoc/noobControlsHoc';


const Label = (props) => {
    console.log('textbox render', props.data.label);
    let classNames = 'ctrlLabel';
    if (props.selected === true) {
        classNames += ' ctrl-selected'
    }

    let labelStyles = {height: '100%'};
    if (!!props.data.color) {
        labelStyles.color = props.data.color;
    }
    if (!!props.data.backgroundColor) {
        labelStyles.backgroundColor = props.data.backgroundColor;
    }
    if (!!props.data.fontSize) {
        labelStyles.fontSize = props.data.fontSize + 'px';
    }

    return <div className={classNames} style={labelStyles}>
        {props.data.icon && <i className={`ui icon ${props.data.icon}`} style={{paddingLeft: '5px'}}/> }
        <span style={{marginLeft: '5px'}}>{props.data.label}</span>
    </div>
}
export default noobControlHoc(Label);


export const labelProps = [
    {
        // label prop: no need to include if no need to customize. Will automatically title-ize the 'name'
        name: 'icon', 
        propType: 'icon',
    },
    {
        name: 'color', 
        propType: 'color',
    },
    {
        name: 'backgroundColor', 
        propType: 'color',
    },
    {
        name: 'fontSize', 
        propType: 'number',
        units: 'px'
    },
]