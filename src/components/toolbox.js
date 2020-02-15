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
//     {
//          name: 'checkbox',
//          displayName: 'Checkbox',
//          icon: 'check square outline',
//          category: 'forms'
//     },                
    {
         name: 'richtext',
         displayName: 'Rich Text',
         icon: 'paint brush',
         category: 'forms',
         minW: 3, minH:3,
    },                
//     {
//          name: 'numeric',
//          displayName: 'Number',
//          icon: 'sort numeric down',
//          category: 'forms'
//     },                
//     {
//          name: 'user',
//          displayName: 'User',
//          icon: 'user circle outline',
//          category: 'forms'
//     },     
//     {
//           name: 'status',
//           displayName: 'Status',
//           icon: 'circle outline',
//           category: 'forms'
//      },     
     {
          name: 'date',
          displayName: 'Date',
          icon: 'calendar alternate outline',
          category: 'forms'
     },     
//      {
//           name: 'attachment',
//           displayName: 'Attachments',
//           icon: 'attach',
//           category: 'forms'
//      },     
//      {
//           name: 'history',
//           displayName: 'History',
//           icon: 'history',
//           category: 'forms'
//      },     
     {
         // Should support expressions, like the Target Name, Vendor, Model etc.
       name: 'label',
       displayName: 'Label',
       icon: 'info',
       category: 'common'
    },
//     {
//           // Should provide a configurable URL
//        name: 'image',
//        displayName: 'Image',
//        icon: 'image outline',
//        category: 'common'
//     },
    {
         name: 'barchart',
         displayName: 'Bar Chart',
         icon: 'chart bar',
         category: 'common',
         minW: 3, minH:3,
    },
    {
         name: 'pie',
         displayName: 'Pie Chart',
         icon: 'chart pie',
         category: 'common',
         minW: 3, minH:3,
    },
     {
          name: 'gauge',
          displayName: 'Gauge',
          icon: 'check circle outline',
          category: 'common',
          minW: 2, minH:3,
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
         category: 'common',
         minW: 3, minH:1,
    },
    {
         name: 'frame',
         displayName: 'Frame',
         icon: 'window maximize outline',
         category: 'common'
    },
   {
     // Should provide a configurable URL
     name: 'imageMap',
     displayName: 'Image Map',
     icon: 'map pin',
     category: 'common',
     minW: 3, minH:3,
   },
//    {
//      // E.g. permits for a page
//      name: 'childtemplate',
//      displayName: 'Child Template',
//      icon: 'clone outline',
//      category: 'form'
//    },
   {
     name: 'pagebreak',
     displayName: 'Page Break',
     icon: 'window minimize',
     category: 'common',
     minW: 12, minH:1,
   },
   {
     name: 'dcbar',
     displayName: 'DC JS Bar',
     icon: 'bar',
     category: 'common',
     minW: 3, minH:3,
   },   
];


const drawToolItems = () => {
    return toolBoxItems.map( (toolItem) => {
        return <ToolItem controlType={toolItem} key={toolItem.name}/>;
    })
}

const ToolBox = ({containerWidth}) => {
     let classNames = 'toolBox';     
     if (containerWidth < 200) {
          classNames += ' toolBox-1row'
     }
     else {
          classNames += ' toolBox-2rows'
     }
     console.log('toolBox containerWidth', containerWidth);
     return <div className={classNames}>
          {drawToolItems()}
     </div>
}

export const getToolItemByName = (name) => toolBoxItems.find(tool => {
     return tool.name === name
});

export default ToolBox;