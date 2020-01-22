import React from 'react';
import noobControlHoc from '../hoc/noobControlsHoc';

const PageBreak = (props) => {
    let classNames = props.selected === true ? 'ctrl-selected' : '';
    return <div style={{width: '100%', height: '100%', backgroundColor: 'lightyellow'}} className={classNames}
    />
}

export default noobControlHoc(PageBreak);