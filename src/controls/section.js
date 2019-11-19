import React from 'react';
import './section.css';

const Section = (props) => {
    return <div className='section'>
        {props.data.title}
    </div>
}

export default Section;