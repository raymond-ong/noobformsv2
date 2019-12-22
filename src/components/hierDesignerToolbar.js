import React from 'react';
import './hierDesignerToolbar.css';

// Toolbar for the Hierachy Designer.
// It is permanently placed on top.
// Houses the search bar and other buttons
const HierarchyToolbar = (props) => {
    return <div className="hierDesignToolbar">
        <div className="ui icon input small" style={{margin: "5px", width: '100%'}}>
            <input type="text" placeholder="Search tree..."/>
            <i className="inverted circular filter icon"></i>
        </div>
        <div className="toolBarBtnContainer">
            <div className="toolbarButton">
            <i className="ui icon save"/>
            Save
            </div>
            <div className="toolbarButton">
            <i className="ui icon plus insert"/>
            Insert
            </div>
            <div className="toolbarButton">
            <i className="ui icon trash alternate"/>
            Delete
            </div>
        </div>
    </div>
}

export default HierarchyToolbar;