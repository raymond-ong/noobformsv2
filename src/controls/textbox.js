import React from 'react';
import './common.css';
import { Input } from 'semantic-ui-react'
import noobControlHoc from '../hoc/noobControlsHoc';


const Textbox = (props) => {
    console.log('textbox render', props.data.label);
    let classNames = '';
    if (props.selected === true) {
        classNames += ' ctrl-selected'
    }

    return <div className={classNames}>
        <div className="controlLabel">{props.data.label}</div>
        <Input key={props.data.i} 
            size='small'
            fluid
            placeholder={props.data.placeholder}/>
    </div>
}
export default noobControlHoc(Textbox);