import React from 'react';
import './designerToolbar.css';
import {Popup} from 'semantic-ui-react';

// Make this a functional component
// Let the parent pass the props like title of form, and other info like timestamp of save and user who saved

// TODO: Make it responsive
const DesignerToolbar = (props) => {
    return <div className="designerToolbar" style={{width: props.containerWidth}}>
        <div className="left">
            <div className="toolbarButton">
                <i className="ui icon save"/>
                Save
            </div>
            <div className="toolbarButton">
                <i className="ui icon save outline"/>
                Save As...
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

        <div className="rightTb">
            <div className="toolbarButton toolbarButton-disabled">
                <i className="ui icon eye"/>
                Hold to Preview
            </div>            
        </div>
        
    </div>
}

export default DesignerToolbar;