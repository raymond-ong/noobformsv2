import React from 'react';
import './designerToolbar.css';
import {Popup, Dropdown, Menu} from 'semantic-ui-react';

const menuItems = {
    'left': [
        {key:'designertb_save', icon: 'save', text: 'Save'},
        {key:'designertb_saveas', icon: 'save outline', text: 'Save As...'},
        {key:'designertb_open', icon: 'open folder outline', text: 'Open...'},
    ],
    'right': [
        {key:'designertb_preview', icon: 'eye', text: 'Hold to Preview', disabled: true},
    ]
}

const renderToolbarBtn = (item) => {
    let clsName = "toolbarButton";
    if (item.disabled) {
        clsName += " toolbarButton-disabled"
    }
    return <div key={item.key} className={clsName}>
        <i className={'ui icon ' + item.icon}/>
        {item.text}
    </div>
}

const renderFullMenu = () => {
    return <div className="designerToolbar">
        <div className="left">
            {menuItems.left.map(item => renderToolbarBtn(item))}
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
            {menuItems.right.map(item => renderToolbarBtn(item))}
        </div>
        
    </div>
}

const renderCollapsedMenu = () => {
    return <div className="designerToolbar">
        <div className="desginerDropdown">
            <i className="desginerDropbtn ui icon th"/>
            <div className="desginerDropdown-content">
                {menuItems.left.map(item => (<div key={item.key} className="desginerDropdown-item">
                    <i className={'ui icon ' + item.icon}/>
                    <a>{item.text}</a>
                </div>))}
            </div>
        </div>
        &nbsp;
        &nbsp;
        <div className="title">Untitled</div>
        <Popup 
            inverted
            size='tiny' style={{opacity: '0.8'}} 
            content='Form is not yet saved' 
            trigger={<div className="infoContainer">
                <i className="ui icon info circle"/>
            </div>} 
        />
    </div>
}


// TODO: Make it responsive
const DesignerToolbar = (props) => {
    if (props.containerWidth > 600) {
        return renderFullMenu();
    }
    else {
        return renderCollapsedMenu();
    }
}

export default DesignerToolbar;