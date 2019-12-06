import React from 'react';
import { Dropdown, Icon } from 'semantic-ui-react'
import noobControlHoc from '../hoc/noobControlsHoc';

import './combo.css';

const noobCombo = (props) => {
    console.log('render combo: ', props.data.label);
    let classNames = 'dropdownContainer ';
    if (props.selected === true) {
        classNames += ' ctrl-selected'
    }
    return <div className={classNames}>
        <div className="controlLabel">{props.data.label}</div>
        <Dropdown placeholder={props.data.placeholder}
        fluid
        multiple
        selection
        search
        options={props.data.options}
        button  // Add button and className so that we can control the size
        className='icon small'
        style={{fontWeight:'normal', color: 'gray', right: '0', left: 'auto'}} // Thi
        //inline
        />
    </div>
}

export default noobControlHoc(noobCombo);