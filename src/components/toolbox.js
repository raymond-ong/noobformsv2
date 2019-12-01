import React from 'react';
import ToolItem from './toolItem';
import "../styles/ToolBox.css";



export const toolBoxItems = [
    {
         name: 'section',
         displayName: 'Section',
         icon: 'wpforms',
         category: 'common',
         minW: 12, minH:1,
    },    
    {
         name: 'textbox',
         displayName: 'Textbox',
         icon: 'text height',
         category: 'forms'
    },    
    {
         name: 'combo',
         displayName: 'Combobox',
         icon: 'caret square down outline',
         category: 'forms',
         minW: 3, minH:1,
    },    
    {
         name: 'checkbox',
         displayName: 'Checkbox',
         icon: 'check square outline',
         category: 'forms'
    },                
    {
         name: 'richtext',
         displayName: 'Rich Text',
         icon: 'paint brush',
         category: 'forms',
         minW: 3, minH:3,
    },                
    {
         name: 'numeric',
         displayName: 'Number',
         icon: 'sort numeric down',
         category: 'forms'
    },                
    {
         name: 'user',
         displayName: 'User',
         icon: 'user circle outline',
         category: 'forms'
    },     
    {
          name: 'status',
          displayName: 'Status',
          icon: 'circle outline',
          category: 'forms'
     },     
     {
          name: 'date',
          displayName: 'Date',
          icon: 'calendar alternate outline',
          category: 'forms'
     },     
     {
          name: 'attachment',
          displayName: 'Attachments',
          icon: 'attach',
          category: 'forms'
     },     
     {
          name: 'history',
          displayName: 'History',
          icon: 'history',
          category: 'forms'
     },     
     {
         // Should support expressions, like the Target Name, Vendor, Model etc.
       name: 'label',
       displayName: 'Label',
       icon: 'info',
       category: 'common'
    },
    {
          // Should provide a configurable URL
       name: 'image',
       displayName: 'Image',
       icon: 'image outline',
       category: 'common'
    },
    {
         name: 'barchart',
         displayName: 'Bar Chart',
         icon: 'chart bar',
         category: 'common'
    },
    {
         name: 'pie',
         displayName: 'Pie Chart',
         icon: 'chart pie',
         category: 'common'
    },
     {
          name: 'kpi',
          displayName: 'KPI',
          icon: 'check circle outline',
          category: 'common'
     },   
    {
         name: 'line',
         displayName: 'Line Chart',
         icon: 'chart line',
         category: 'common'
    },
    {
         name: 'table',
         displayName: 'Table',
         icon: 'table',
         category: 'common'
    },
    {
         name: 'frame',
         displayName: 'Frame',
         icon: 'window maximize outline',
         category: 'common'
    },
   {
     // Should provide a configurable URL
     name: 'treemap',
     displayName: 'Tree Map',
     icon: 'map pin',
     category: 'common'
   },
   {
     // E.g. permits for a page
     name: 'childtemplate',
     displayName: 'Child Template',
     icon: 'clone outline',
     category: 'form'
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