import React from 'react';
import ToolItem from './toolItem';
import "../styles/ToolBox.css";

export const toolBoxItems = [
    {
         name: 'section',
         displayName: 'Section',
         icon: 'wpforms',
    },    
    {
         name: 'textbox',
         displayName: 'Textbox',
         icon: 'font',
    },
    {
         name: 'richText',
         displayName: 'Rich Text',
         icon: 'paint brush'
    },
    {
       name: 'label',
       displayName: 'Label',
       icon: 'info'
  },

    {
         name: 'numeric',
         displayName: 'Number',
         icon: 'sort numeric up'
    },
    {
         name: 'date',
         displayName: 'Date',
         icon: 'calendar alternate'
    },
    {
         name: 'combo',
         displayName: 'Combo',
         icon: 'dropdown'
    },
    {
         name: 'checkbox',
         displayName: 'Check',
         icon: 'check square outline'
    },
    {
         name: 'table',
         displayName: 'Table',
         icon: 'table'
    },
    {
         name: 'user',
         displayName: 'User',
         icon: 'user circle'
    },
    {
       name: 'image',
       displayName: 'Image',
       icon: 'image outline'
   },
   {
       name: 'video',
       displayName: 'Video',
       icon: 'video play'
   },
];

const drawToolItems = () => {
    return toolBoxItems.map( (toolItem) => {
        return <ToolItem controlType={toolItem} key={toolItem.name}/>;
    })
}

const toolBox = () => {
    return <div className="toolBox">
        {drawToolItems()}
    </div>
}

export default toolBox;