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
         name: 'barchart',
         displayName: 'Bar Chart',
         icon: 'chart bar',
    },
    {
         name: 'pie',
         displayName: 'Pie Chart',
         icon: 'chart pie'
    },
    {
         // Should support expressions, like the Target Name, Vendor, Model etc.
       name: 'label',
       displayName: 'Label',
       icon: 'info'
     },
     {
          name: 'kpi',
          displayName: 'KPI',
          icon: 'check circle outline'
     },   
    {
         name: 'line',
         displayName: 'Line Chart',
         icon: 'chart line'
    },
    {
         name: 'table',
         displayName: 'Table',
         icon: 'table'
    },
    {
         name: 'frame',
         displayName: 'Frame',
         icon: 'window maximize outline'
    },
    {
          // Should provide a configurable URL
       name: 'image',
       displayName: 'Image',
       icon: 'image outline'
   },
   {
     // Should provide a configurable URL
     name: 'treemap',
     displayName: 'Tree Map',
     icon: 'map pin'
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