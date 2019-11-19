import React from 'react';
import './section.css';
import noobControlHoc from '../hoc/noobControlsHoc';

const Section = (props) => {
    let classNames = 'section';
    if (props.selected === true) {
        classNames += ' selected'
    }

    return <div className={classNames}>
        {props.data.title}
    </div>
}

export default noobControlHoc(Section);