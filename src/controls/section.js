import React from 'react';
import './section.css';
import './common.css';
import noobControlHoc from '../hoc/noobControlsHoc';

const Section = (props) => {
    console.log('section render', props.data.title);
    let classNames = 'section';
    if (props.selected === true) {
        classNames += ' ctrl-selected'
    }

    return <div className={classNames}>
        {props.data.title}
    </div>
}

export default noobControlHoc(Section);