import React from 'react';
import './designerToolbar.css';
import {Popup, Dropdown, Menu} from 'semantic-ui-react';
import {WIDTH_LARGE} from '../constants';

// Generic toolbar Control that accepts the menu items and callbacks as props, e.g.
// const menuItems = {
//     'left': [
//         {key:'designertb_save', icon: 'save', text: 'Save'},
//         {key:'designertb_saveas', icon: 'save outline', text: 'Save As...'},
//         {key:'designertb_open', icon: 'open folder outline', text: 'Open...'},
//     ],
//     'right': [
//         {key:'designertb_preview', icon: 'eye', text: 'Hold to Preview', disabled: true},
//     ]
// }

const renderToolbarBtn = (item) => {
    let clsName = "toolbarButton";
    if (item.disabled) {
        clsName += " toolbarButton-disabled"
    }
    return <button key={item.key} className={clsName} type='submit'>
        <i className={'ui icon ' + item.icon}/>
        {item.text}
    </button>
}

const renderFullMenu = (menuItems, title, titleTooltip) => {
    return <div className="designerToolbar">
        <div className="left">
            {menuItems.left.map(item => renderToolbarBtn(item))}
        </div>

        <div className="center">
            {title && <div className="title">Untitled</div>}
            {titleTooltip && <Popup 
                inverted
                basic
                size='tiny' style={{opacity: '0.8'}} 
                content='Form is not yet saved' 
                trigger={<div className="infoContainer">
                <i className="ui icon info circle"/>
            </div>} />}
            
            
        </div>
                
        {menuItems.right && <div className="rightTb">
            {menuItems.right.map(item => renderToolbarBtn(item))}
        </div>}
        
    </div>
}

const renderCollapsedMenu = (menuItems, title, titleTooltip) => {
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
        {title && <div className="title">{title}</div>}
        {titleTooltip && <Popup 
            inverted
            size='tiny' style={{opacity: '0.8'}} 
            content={titleTooltip} 
            trigger={<div className="infoContainer">
                <i className="ui icon info circle"/>
            </div>} 
        />}
    </div>
}


const Toolbar = ({containerWidth, menuItems, title, titleTooltip}) => {
    if (containerWidth > WIDTH_LARGE) {
        return renderFullMenu(menuItems, title, titleTooltip);
    }
    else {
        return renderCollapsedMenu(menuItems, title, titleTooltip);
    }
}

export default Toolbar;