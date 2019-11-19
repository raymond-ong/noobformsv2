import React from 'react';
import './designerToolbar.css';
import {Popup} from 'semantic-ui-react';

// Make this a functional component
// Let the parent pass the props like title of form, and other info like timestamp of save and user who saved
const DesignerToolbar = (props) => {
    return <div className="designerToolbar">
        <div className="left">
            <div className="toolbarButton">
                <i className="ui icon save outline"/>
                Save
            </div>
            <div className="toolbarButton">
                <i className="ui icon open folder outline"/>
                Open...
            </div>
        </div>

        <div className="center">
            <div className="title">Untitled</div>
            <Popup 
                inverted
                size='tiny' style={{opacity: '0.8'}} 
                content='Form is not yet saved' 
                trigger={<div className="infoContainer">
                <i className="ui icon info circle"/>
            </div>} />
            
            
        </div>

        <div className="right"></div>
        
    </div>
}

export default DesignerToolbar;