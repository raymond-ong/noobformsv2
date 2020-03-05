import { SELECT_TOOLPANEL_TREE, 
          SELECT_CONTROL, 
          SELECT_PAGE,
          UPDATE_DESIGNER_LAYOUT,
          OPEN_LAYOUT,
          UPDATE_CONTROL_PROPS,
          UPDATE_LAYOUT_PROPS,
          DELETE_CONTROL,
          SAVE_DESIGNER_LAYOUT,
          APPLY_IMAGEMAP_PROPS,
          deleteControl} from "../actions/index";

import {DUMMY_APR_METADATA, OLD_DUMMY_DATA, dropdownOptions, dropdownOptionsFew} from '../helper/dummyMetadata';
import {uuidv4} from '../helper/util';

// Note: if using CSS grid to populate the layout, the items must be sorted by row and column
// This is for the Forms layout
// TODO: Control Id's: we need to generate a unique one. Because if you open a saved layout and it has the same id but different props, react will pass cached props.
// Ideally, this function should return immediately if metadata has not been fetched yet.
// 
const generateDefaultLayout = (metadata) => {

  if (!metadata) {
    return [];
  }

  const suffix = '-'+ uuidv4();

  // [1] Section
  return [
  // {i: 'ctrl-combo0', x: 0, y: 0, w: 3, h: 1, ctrlType: 'combo', data: {
  //     placeholder: 'Please select...',
  //     options: dropdownOptions,
  //     label: 'Courses:'
  // }},


  // {i: 'ctrl-section0'+suffix, x: 0, y: 0, w: 12, h: 1, ctrlType: 'section', data: {
  //     title: 'Default Section',
  //     //backgroundColor: 'lightsteelblue'
  //     level: 1
  // }},

  // {i: 'ctrl-label0X'+suffix, x: 0, y: 1, w: 12, h: 1,ctrlType: 'label', data: {
  //   label: 'This is the default sample layout. In the Page Designer, chart data being displayed below are sample data only!',
  //   color: 'black',
  //   backgroundColor: 'khaki',
  //   fontSize: '14',
  //   icon: 'lightbulb'
  // }},

  //[2] Description
  {i: 'ctrl-richText0'+suffix, x: 0, y: 1, w: 3, h: 4, ctrlType: 'richtext',       
      data: {
          label: 'Description:',
          placeholder: 'Enter Description...',
          richTextData: null,
          dataProps: {
            datasetId: 1,
            requestType: 'GetComments',
            filterName: null,
            filterValue: null
          }
      }},

  // [2 NEW] Gauge chart
  // {i: 'ctrl-gauge0', x: 0, y: 1, w: 3, h: 4, ctrlType: 'gauge',       
  //     data: {
  //         label: 'Gauge:',
  //         percent: 95.5
  //     }},

  // [3 new] Pie Chart
  // {i: 'ctrl-pie0X'+suffix, x: 0, y: 2, w: 6, h: 8, ctrlType: 'pie',       
  //     data: {
  //         label: 'Pie:',
  //         dataProps: {
  //           datasetId: 0,
  //           requestType: 'GetDeviceCounts',
  //           categories: '',
  //           aggregation: 'count'
  //         }
  //     }},

  // // [4 new] Bar Chart
  // {i: 'ctrl-bar0X'+suffix, x: 6, y: 2, w: 6, h: 8, ctrlType: 'barchart',       
  //     data: {
  //         label: 'Bar:',
  //         stacked: false,
  //         dataProps: {
  //           datasetId: 0,
  //           requestType: 'GetDeviceCounts',
  //           categories: '', // For a vertical bar chart, this is the X-axis
  //           seriesName: '', // For a vertical bar chart, this is the Y-axis (e.g. count)
  //           aggregation: 'count'
  //         }
  //     }},

  // //[2 NEW] Gauge chart
  // {i: 'ctrl-gauge0x'+suffix, x: 0, y: 14, w: 6, h: 4, ctrlType: 'gauge',       
  //     data: {
  //         label: 'Gauge:',
  //         percent: 95.5
  // }},

  // // Image Map
  // {i: 'ctrl-imageMap0Y'+suffix, x: 6, y:14, w: 6, h: 4,ctrlType: 'imageMap', data: {
  //   label: 'Image Map:',
  //   dataProps: {
  //     datasetId: 1,
  //     requestType: 'GetPlantKpi',
  //     columns: []
  //   },
  //   imageProps: {
  //     image: '',
  //     map: {        
  //         name: '',
  //         areas: []
  //     }
  //   },
  // }},

  // {i: 'ctrl-table0X'+suffix, x: 0, y:10, w: 12, h: 4,ctrlType: 'table', data: {
  //   label: 'Table:',
  //   dataProps: {
  //     columns: [],
  //     datasetId: 0,
  //     requestType: 'GetDeviceDetails',
  //     aggregation: 'count'
  //   }
  // }},


  // // [3] Date
  // {i: 'ctrl-date0', x: 6, y: 1, w: 3, h: 1, ctrlType: 'date'},

  // // [4] Status
  // {i: 'ctrl-status0', x: 6, y: 2, w: 3, h: 1, ctrlType: 'status'},

  // [5] Priority
  // {i: 'ctrl-combo0X', x: 9, y: 2, w: 3, h: 1, ctrlType: 'combo', data: {
  //     placeholder: 'Please select...',
  //     options: dropdownOptions,
  //     label: 'Courses:'
  // }},

  // [6] User
  // {i: 'ctrl-user0', x: 6, y: 4, w: 3, h: 1, ctrlType: 'user'},
  // {i: 'combo1', x: 6, y: 4, w: 3, h: 1, ctrlType: 'combo', data: {
  //     placeholder: 'Please Select...',
  //     options: dropdownOptions,
  //     label: 'Please select:'
  // }},    

  // [7] Attachments
  //{i: 'ctrl-attachment0', x: 9, y: 1, w: 3, h: 2,ctrlType: 'attachment'},
  // [7 New] Label
  // {i: 'ctrl-label0X', x: 9, y: 1, w: 3, h: 1,ctrlType: 'label', data: {
  //   label: 'I am a label',
  //   color: 'blue',
  //   backgroundColor: 'khaki',
  //   fontSize: '18',
  //   icon: 'tag'
  // }},


  // [8] Remarks
  // {i: 'ctrl-textbox0', x: 9, y: 4, w: 3, h: 1,ctrlType: 'textbox', data: {
  //   placeholder: 'Input Remarks...',
  //   label: 'Remarks:'
  // }},

  // [9] DatePicker
  // {i: 'ctrl-date0X', x: 9, y: 3, w: 3, h: 1,ctrlType: 'date', data: {
  //   label: 'Analysis Period:'
  // }},

  // [B] Subsection
  // {i: 'ctrl-section1', x: 0, y: 5, w: 12, h: 1, ctrlType: 'section', data: {
  //     title: 'Loop Summary',
  //     //backgroundColor: 'lightsteelblue'
  //     level: 2
  // }},

  // [1] History
  //{i: 'ctrl-history0', x: 0, y: 6, w: 12, h: 2, ctrlType: 'history'},

  //[2] Table - 1
  // {i: 'ctrl-table0X', x: 0, y:6, w: 12, h: 2,ctrlType: 'table', data: {
  //   label: 'Table:'
  // }},

  // //[2] Table - 2
  // {i: 'ctrl-table1', x: 3, y: 8, w: 3, h: 2,ctrlType: 'table', data: {
  //   label: 'Table:'
  // }},
  // // [2] Table - 3
  // {i: 'ctrl-table2', x: 6, y: 8, w: 3, h: 2,ctrlType: 'table', data: {
  //   label: 'Table:'
  // }},
  // // [2] Table - 4
  // {i: 'ctrl-table3', x: 9, y: 8, w: 3, h: 2,ctrlType: 'table', data: {
  //   label: 'Table:'
  // }},

  // dc bar chart
  // {i: 'ctrl-dcbar0', x: 6, y:1, w: 3, h: 4,ctrlType: 'dcbar', data: {
  //   label: 'DC Chart:'
  // }},
  // dc bar chart
  // {i: 'ctrl-imageMap0X', x: 6, y:1, w: 3, h: 4,ctrlType: 'imageMap', data: {
  //   label: 'Image Map:'
  // }},
  ];
}

const defaultLayoutData = {
  columns: 12,
  rows: 20,
  pageFilterFields: []
}

// This is the default layout for the Dashboard
const generateDefaultDashboard = () => {
  return [
    // [1] Section Title
    {i: 'ctrl-section0', x: 0, y: 0, w: 12, h: 2, ctrlType: 'section', data: {
        title: 'Plant Overall Status',
        level: 1
    }},

    // [2] Pie Chart
    {i: 'ctrl-pie0', x: 0, y: 2, w: 4, h: 8, ctrlType: 'pie',       
        data: {
        }
    },

    // [3] Bar Chart
    {i: 'ctrl-barchart0', x: 4, y: 2, w: 4, h: 8, ctrlType: 'barchart',       
        data: {
        }
    },

    // Sample combobox
    {i: 'ctrl-combo0', x: 8, y: 2, w: 4, h: 2, ctrlType: 'combo',       
        data: {
        }
    }, 
    {i: 'ctrl-combo1', x: 8, y: 4, w: 4, h: 2, ctrlType: 'combo',       
        data: {
        }
    }, 
       
  ];
}



const defaultState = {
    toolPanelTreeSelected: null, // to delete...this is used inside the RGL tab only
    //selectedControlId: null, // Don't put here. Just put inside the controls data. This is to avoid rendering all controls.
    // It is OK to put the selectedControlId inside the reducer for showing the Control Props
    resizingControlId: null, // try to just use local state to keep track. The whole designer only needs to know after resizing.
    layout: generateDefaultLayout(DUMMY_APR_METADATA),
    layoutData: defaultLayoutData,

    // For the dashboard
    dashLayout: generateDefaultDashboard(),
    dashLayoutData: {},

    // For the metadata in configuring the data sources
    metadata: OLD_DUMMY_DATA,

    pageSelected: false
}

const defaultControlData = {
  'section': {
    title: 'New Section',
    level: 1
  },
  'richtext': {
    label: 'Rich Text:',
    placeholder: 'Enter value...',
    richTextData: null,
    dataProps: {
      datasetId: 1,
      requestType: 'GetComments',
      filterName: null,
      filterValue: null
    }
  },
  'combo': {
    placeholder: 'Please select...',
    options: dropdownOptionsFew,
    label: 'Combobox:'
  },
  'textbox': {
    placeholder: 'Enter value...',
    label: 'Textbox:'
  },
  'table': {
    label: 'Table:',
    dataProps: {
      columns: [],
      datasetId: 0,
      requestType: 'GetDeviceDetails',
      aggregation: 'count'
    }
  },
  'pie' : {
    label: 'Pie:',
    dataProps: {
      datasetId: 0,
      requestType: 'GetDeviceCounts',
      categories: '',
      aggregation: 'count'
    }
  },
  'barchart' : {
    label: 'Bar:'
  },
  'label': {
    label: 'New Label',
    icon: 'lightbulb',
    backgroundColor: 'khaki',
    color: 'black',
    fontSize: '12'
  },
  'gauge': {
    label: 'new Gauge:',
    percent: 65
  },
  'pagebreak': {
  },
  'imageMap': {
    label: 'Image Map:',
    dataProps: {
      datasetId: 1,
      requestType: 'GetPlantKpi',
      columns: []
    },    
    imageProps: {
      image: '',
      map: {        
          name: '',
          areas: []
      }
    }    
  },
 
}

const assignIdAndDefaultData = (control, layout) => {
  if (!control.ctrlType) {
    return;
  }

  if (!control.data) {
    control.data = defaultControlData[control.ctrlType];
  }
  
  // find a suitable default id
  let i = 0;
  while (true) {
    let currId = 'ctrl-' + control.ctrlType + i++;
    if (layout.find(ctrl => ctrl.i === currId)) {
      continue;
    }
    control.i = currId;
    break;
  }
}

const updateLayout = (layout, updatedControls) => {
  // updatedControls is an array of controls
  // it may contain existing controls or "empty" controls that have been resized
  if (!layout || !updatedControls) {
    return layout;
  }

  updatedControls.forEach(control => {
    let findIndex = layout.findIndex(layoutCtrl => layoutCtrl.i === control.i);
    if (findIndex === -1) {
      // means we need to create a new control
      assignIdAndDefaultData(control, layout);
      layout.push(control);
    }
    else {
      // in case the data is null (because it's an empty control previously, just resized)
      if (!control.data) {
        assignIdAndDefaultData(control, layout);
      }
      layout[findIndex] = control;  
    }
  })

  // TODO Sort the controls based on the "flat coordinates"
  // Maybe no need...because when rendering, it is looping from topLeft to botoom right
}

// Does not cause a rerender. Do not update the property in place (mutate) -- create a new object
const setControlSelectedOrig = (controlId, newLayout) => {
  newLayout.forEach(control => {
    if (control.i === controlId) {
      control.selected = true;
    }
    else {
      control.selected = false;
    }
  })
}

// This function will cause only the affected controls (1 or 2 controls) to rerender
const setControlSelected = (controlId, newLayout) => {
  // Create a new object for the affected controls, instead of updating them
  let affectedControls = [];
  newLayout.forEach(control => {
    if (control.selected) {
      if (control.i !== controlId) {
        affectedControls.push({...control, selected: false});
      }
    }
    else if (control.i === controlId) {
      affectedControls.push({...control, selected: true});
    }
  });

  // Remove the old control and push the new objects
  affectedControls.forEach(ctrl => {
    let index = newLayout.findIndex(x => x.i === ctrl.i);
    newLayout.splice(index, 1);
    newLayout.push(ctrl);
  });  
}

const unselectAllControls = (newLayout) => {
  let affectedControls = [];
  newLayout.forEach(control => {
    if (control.selected) {      
        affectedControls.push({...control, selected: false});
      }
    }
  );

  // Remove the old control and push the new objects
  affectedControls.forEach(ctrl => {
    let index = newLayout.findIndex(x => x.i === ctrl.i);
    newLayout.splice(index, 1);
    newLayout.push(ctrl);
  });  
}

const updateControlProps = (updatedControl, newLayout) => {
  let findControlIndex = newLayout.findIndex(ctrl => ctrl.i === updatedControl.i);
  if (findControlIndex < 0) {
    return;
  }

  let newControl = {...newLayout[findControlIndex], data: updatedControl.data};
  // Remove the old control and push the new object
  newLayout.splice(findControlIndex, 1);
  newLayout.push(newControl);
}

const updateControlImgMapProps = (actionPayload, newLayout) => {
  let {image, newMap, updatedControl} = actionPayload;
  let findControlIndex = newLayout.findIndex(ctrl => ctrl.i === updatedControl.i);
  if (findControlIndex < 0) {
    return;
  }

  let newControl = {...newLayout[findControlIndex], data: updatedControl.data};
  newControl.data.imageProps = {
    image: image,
    map: newMap
  }
  // Remove the old control and push the new object
  newLayout.splice(findControlIndex, 1);
  newLayout.push(newControl);
}

const updateLayoutProps = (updatedLayoutProps) => {
  return {...updatedLayoutProps, 
    rows: parseInt(updatedLayoutProps.rows)
  };
}

const handleDeleteControl = (deletedControl, newLayout) => {
  let findControlIndex = newLayout.findIndex(ctrl => ctrl.i === deletedControl.i);
  if (findControlIndex < 0) {
    return;
  }

  newLayout.splice(findControlIndex, 1);
}

export default function(state = defaultState, action) {  
  switch (action.type) {
    case SELECT_TOOLPANEL_TREE:
      return {
        ...state,
        toolPanelTreeSelected: action.payload
      };
    case SELECT_CONTROL:
      let newStateSelectCtrl = {...state};
      newStateSelectCtrl.pageSelected = false;
      //newStateSelectCtrl.layout = [...state.layout]; // No need. If you do this, the entire designer will rerender, but only the empty controls will rerender
      setControlSelected(action.payload, newStateSelectCtrl.layout);
      return newStateSelectCtrl;
    case SELECT_PAGE:
      // a. unselect selected controls
      // b. 
      let newStateSelectPage = {...state};
      newStateSelectPage.pageSelected = true;
      unselectAllControls(newStateSelectPage.layout);
      return newStateSelectPage;  
    case UPDATE_DESIGNER_LAYOUT:
        let updatedControls = action.payload;
        let newState = {
          ...state,          
        };
        // Need to re-initialize the layout array too, otherwise formDesignerContent won't re-render
        // I think minimum we just need to create new objects for the affected controls. 
        // ...But the empty controls won't rerender and there might be a need to rerender them. So just update the entire array
        newState.layout = [...state.layout];
        updateLayout(newState.layout, updatedControls);        

        return newState;
    case UPDATE_CONTROL_PROPS:
        let newStateUpdProps = {
          ...state,          
        };

        updateControlProps(action.payload, newStateUpdProps.layout); 

        return newStateUpdProps;
    case APPLY_IMAGEMAP_PROPS:
      let newStateUpdImageMapProps = {
        ...state,          
      };

      updateControlImgMapProps(action.payload, newStateUpdImageMapProps.layout); 

      return newStateUpdImageMapProps;
    case UPDATE_LAYOUT_PROPS:
      let newStateUpdLayoutProps = {
        ...state,          
      };

      newStateUpdLayoutProps.layoutData = updateLayoutProps(action.payload); 

      return newStateUpdLayoutProps;
    case DELETE_CONTROL:
      let newStateDeleteControl = {
        ...state,          
      };
      newStateDeleteControl.layout = [...state.layout];

      handleDeleteControl(action.payload, newStateDeleteControl.layout);
      return newStateDeleteControl;
    case SAVE_DESIGNER_LAYOUT:
      // TODO: After a successful Save, server will return the object saved
      // It's expected to be the same, but ideally we should replace local state's object with the one from the server
      break;
    case OPEN_LAYOUT:
      return {
        ...state,
        layout: [...action.payload.controls],
        layoutData: action.payload.layoutData,
      }
      
  }
  return state;
}
