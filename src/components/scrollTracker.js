// Testing the scrollspy library
import React from 'react';
import Scrollspy from 'react-scrollspy';
import '../styles/Scrollspy.css';

class scrollTracker extends React.Component {
    // return <div>
    render() {
        return <Scrollspy 
            items={ ['section-title', 'section-1', 'section-2', 'section-3', 'section-4']} 
            rootEl="#homeRight"
            currentClassName="current">
            <li><a href="#section-title">Title</a></li>
            <li><a href="#section-1">Sunflower</a></li>
            <li><a href="#section-2">Happier</a></li>
            <li><a href="#section-3">I Took a Pill in Ibiza</a></li>
            <li><a href="#section-4">Animals</a></li>
            {/* </div> */}
        </Scrollspy>;
    }
  
}

export default scrollTracker;