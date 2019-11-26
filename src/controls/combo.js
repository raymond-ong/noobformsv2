import React from 'react';
import { Dropdown } from 'semantic-ui-react'
import noobControlHoc from '../hoc/noobControlsHoc';

import './combo.css';

const noobCombo = (props) => {
    let classNames = 'dropdownContainer ';
    if (props.selected === true) {
        classNames += ' ctrl-selected'
    }
    return <div className={classNames}>
        <div className="label">{props.data.label}</div>
        <div className="dropdownWrapper">
            <Dropdown placeholder={props.data.placeholder}
            fluid
            multiple
            selection
            options={props.data.options}/>
        </div>
    </div>
}

export default noobControlHoc(noobCombo);