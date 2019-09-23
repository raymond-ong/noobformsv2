import React from 'react';
import '../styles/VerticalList.css';

export const MODE_SMALL = 'small';
export const MODE_NORMAL = 'normal';

const createMenuItems = (items, activeItem, mode) => {    

    console.log('createMenuItems', mode);
    return items.map(item => {
        let itemClass = 'item';
        if (activeItem === item.name) {
            itemClass += ' active';
        }
        let iconClass = `icon large ${item.icon}`;
        let titleElem = [];
        let iconElem = [];
        if (mode === MODE_NORMAL) {
            titleElem = [<span key={'title' + item.name} style={{display: 'inline', verticalAlign: 'middle', paddingLeft: '5px'}}>{item.title}</span>];
            iconElem = [<i key={'icon' + item.name} style={{display: 'inline', verticalAlign: 'middle'}} className={iconClass}/>]
        }
        else {
            iconElem = [<i key={'icon' + item.name} style={{display: 'block', verticalAlign: 'middle', marginLeft: 'auto', marginRight: 'auto'}} className={iconClass}/>]
        }

        return <div className={itemClass} key={item.name}>            
            {iconElem}
            {titleElem}
        </div>
    });
}

const VerticalList = ({items, activeItem, mode}) => {
    console.log('verticalList render');
    return <div className='verticalList ui middle aligned selection list'>
        {createMenuItems(items, activeItem, mode)}
    </div>
}

export default VerticalList;