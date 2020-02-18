import { SELECT_TOOLPANEL_TREE, 
          SELECT_CONTROL, 
          UPDATE_DESIGNER_LAYOUT,
          OPEN_LAYOUT,
          UPDATE_CONTROL_PROPS,
          DELETE_CONTROL,
          SAVE_DESIGNER_LAYOUT,
          deleteControl} from "../actions/index";

// Note: if using CSS grid to populate the layout, the items must be sorted by row and column
// This is for the Forms layout
// TODO: Control Id's: we need to generate a unique one. Because if you open a saved layout and it has the same id but different props, react will pass cached props.
const generateDefaultLayout = () => {
  // [1] Section
  return [
  // {i: 'ctrl-combo0', x: 0, y: 0, w: 3, h: 1, ctrlType: 'combo', data: {
  //     placeholder: 'Please select...',
  //     options: dropdownOptions,
  //     label: 'Courses:'
  // }},


  {i: 'ctrl-section0X', x: 0, y: 0, w: 12, h: 1, ctrlType: 'section', data: {
      title: 'General Information',
      //backgroundColor: 'lightsteelblue'
      level: 1
  }},

  //[2] Description
  // {i: 'ctrl-richText0', x: 0, y: 1, w: 3, h: 4, ctrlType: 'richtext',       
  //     data: {
  //         label: 'Description:',
  //         placeholder: 'Enter Description...'
  //     }},

  // [2 NEW] Gauge chart
  // {i: 'ctrl-gauge0', x: 0, y: 1, w: 3, h: 4, ctrlType: 'gauge',       
  //     data: {
  //         label: 'Gauge:',
  //         percent: 95.5
  //     }},

  // [3 new] Pie Chart
  {i: 'ctrl-pie0X', x: 0, y: 1, w: 3, h: 4, ctrlType: 'pie',       
      data: {
          label: 'Pie:',
      }},

  // [4 new] Bar Chart
  {i: 'ctrl-bar0X', x: 3, y: 1, w: 3, h: 4, ctrlType: 'barchart',       
      data: {
          label: 'Bar:',
      }},

      // // [3] Date
  // {i: 'ctrl-date0', x: 6, y: 1, w: 3, h: 1, ctrlType: 'date'},

  // // [4] Status
  // {i: 'ctrl-status0', x: 6, y: 2, w: 3, h: 1, ctrlType: 'status'},

  // [5] Priority
  {i: 'ctrl-combo0X', x: 9, y: 2, w: 3, h: 1, ctrlType: 'combo', data: {
      placeholder: 'Please select...',
      options: dropdownOptions,
      label: 'Courses:'
  }},

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
  {i: 'ctrl-label0X', x: 9, y: 1, w: 3, h: 1,ctrlType: 'label', data: {
    label: 'I am a label',
    color: 'blue',
    backgroundColor: 'khaki',
    fontSize: '18',
    icon: 'tag'
  }},


  // [8] Remarks
  // {i: 'ctrl-textbox0', x: 9, y: 4, w: 3, h: 1,ctrlType: 'textbox', data: {
  //   placeholder: 'Input Remarks...',
  //   label: 'Remarks:'
  // }},

  // [9] DatePicker
  {i: 'ctrl-date0X', x: 9, y: 3, w: 3, h: 1,ctrlType: 'date', data: {
    label: 'Analysis Period:'
  }},

  // [B] Subsection
  {i: 'ctrl-section1', x: 0, y: 5, w: 12, h: 1, ctrlType: 'section', data: {
      title: 'Loop Summary',
      //backgroundColor: 'lightsteelblue'
      level: 2
  }},

  // [1] History
  //{i: 'ctrl-history0', x: 0, y: 6, w: 12, h: 2, ctrlType: 'history'},

  //[2] Table - 1
  {i: 'ctrl-table0X', x: 0, y:6, w: 12, h: 2,ctrlType: 'table', data: {
    label: 'Table:'
  }},

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
  {i: 'ctrl-imageMap0X', x: 6, y:1, w: 3, h: 4,ctrlType: 'imageMap', data: {
    label: 'Image Map:'
  }},
  ];
}

const dropdownOptions = [
  { key: 'angular', text: 'Angular', value: 'angular' },
  { key: 'css', text: 'CSS', value: 'css' },
  { key: 'design', text: 'Graphic Design', value: 'design' },
  { key: 'ember', text: 'Ember', value: 'ember' },
  { key: 'html', text: 'HTML', value: 'html' },
  { key: 'ia', text: 'Information Architecture', value: 'ia' },
  { key: 'javascript', text: 'Javascript', value: 'javascript' },
  { key: 'mech', text: 'Mechanical Engineering', value: 'mech' },
  { key: 'meteor', text: 'Meteor', value: 'meteor' },
  { key: 'node', text: 'NodeJS', value: 'node' },
  { key: 'plumbing', text: 'Plumbing', value: 'plumbing' },
  { key: 'python', text: 'Python', value: 'python' },
  { key: 'rails', text: 'Rails', value: 'rails' },
  { key: 'react', text: 'React', value: 'react' },
  { key: 'repair', text: 'Kitchen Repair', value: 'repair' },
  { key: 'ruby', text: 'Ruby', value: 'ruby' },
  { key: 'ui', text: 'UI Design', value: 'ui' },
  { key: 'ux', text: 'User Experience', value: 'ux' },
  { key: 'test1', text: 'A quick brown fox jumps over the lazy dog', value: 'test1' },
  { key: 'test2', text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+', value: 'test2' },
  { key: 'test3', text: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。', value: 'test3' },
];

const dropdownOptionsFew = [
  { key: 'apple', text: 'Apple', value: 'apple' },
  { key: 'banana', text: 'Banana', value: 'banana' },
  { key: 'carrot', text: 'Carrot', value: 'carrot' },
  { key: 'dolphin', text: 'Dolphin', value: 'dolphin' },
  { key: 'elephant', text: 'Elephant', value: 'elephant' },
  { key: 'fish', text: 'Fish', value: 'fish' },
  { key: 'grapefruit', text: 'Grapefruit', value: 'grapefruit' },
  { key: 'hummingbird', text: 'Humming Bird', value: 'hummingbird' },
  { key: 'iguana', text: 'Iguana', value: 'iguana' },
];

const defaultLayoutData = {
  columns: 12,
  rows: 12
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

// DataTypes:
// [Percent]  e.g. ODE, TA, PA. Cannot be used in pie chart
// [Number]   e.g. Total Alarms. Children count can be summed up.
// [Not specified] means it is string value

// Note: this metadata set is for device-level metadata
//  TODO: We need to fetch the comment library stuff also
// We also need to define a metadata for alarm-level metadata
const dummyMetaData = {
  name: 'Device Metadata',
  // Defines how other Dataset-types can link to this Dataset.
  // For example, Alarms data can be linked to this dataset via DeviceId
  // This also defines the unit of Data. Means this data has a DeviceId
  dataKey: 'DeviceId', // This should be one of the dimensions
  RequestParams: [
    {
      name: 'AnalysisPeriod',   
      dataTypes: ['Date Range'],   
      enumValues: ['Latest value only', 'Last 1 day', 'Last 7 days', 'Last 30 days', 'Custom Range']
    },
    // {
      // I think no need...since this is already defined in the Dimensions. We only include the "special" ones that are not inside the Dimensions
      // name: 'Path',
      // dataTypes: ['string'],
    // },    
  ],
  Dimensions: [
    {
      // TODO: Maybe we remove the Device Info layer (i.e. Vendor, Model etc are first level dimensions)
      // In a relational DB, for PRM, we need to put Device Info in another table (separate from Hierarchy table) because there can be multiple hierarchy views
      // In a noSQL DB, we can flatten this out when storing
      name: 'Device Info',
      dataTypes: ['group'],   
      // supported controls: ['pie', 'bar']
      items: [
        {
          name: 'Device ID',
          dataTypes: ['string'],
        },
        {
          name: 'Device Tag',
          dataTypes: ['string'],   
        },
        {
          name: 'Priority',
          dataTypes: ['Enum'],   
          enumValues: ['Low', 'Medium', 'High', 'High+'],

          // measures: to be used only in request data if client wants server to provide the calculated value already, instead of client computing for the value
          // But client can use this info to populate some ui configs?
          measures: [
            {
              name: 'Count',
              expression: 'count'
            }
          ]
        },      
        {
          name: 'Category',
          dataTypes: ['string'],   
        },           
        {
          name: 'FullPath',
          dataTypes: ['string'],   
        }        
      ]
    }, // End: Device Info group
    {
      name: 'VendorModel Info',
      dataTypes: ['group'],   
      items: [
        {
          name: 'Vendor',
          dataTypes: ['string', 'group'],
          items: [
            {
              name: 'Model',
              dataTypes: ['string'],
              items: [
                {
                  name: 'Revision',
                  dataTypes: ['string'],
                }
              ]    
            }
          ]
        }
      ]
    }, // End: Vendor Model group
    {
      name: 'Device Status',
      dataTypes: ['group'],
      items: [
        {
          name: 'PRM Device Status',          
          enumValues: ['Abnormal', 'Warning', 'Communication Error', 'Uncertain', 'Normal'],
          dataTypes: ['Enum']
        },
        {
          name: 'NE107 Device Status',          
          enumValues: ['Failure', 'Check Function', 'Out of Specification', 'Maintenance Required', 'Communication Error', 'Unknown,Normal'],
          dataTypes: ['Enum']
        },
      ]
    },
    {
      name: 'Device Status Timing Breakdown',
      dataTypes: ['group'],
      items: [
        {
          name: 'Good%',
          dataTypes: ['Percent']
        },
        {
          name: 'Bad%',
          dataTypes: ['Percent']
        },
        {
          name: 'Fair%',
          dataTypes: ['Percent']
        },
        {
          name: 'Uncertain%',
          dataTypes: ['Percent']
        },
      ]
    },
    {
      name: 'Device Availability',
      value: 'Device Availability',
      items: [
        {
          name: 'ODE',
          items: [
            {
              name: 'Status',
              dataTypes: ['Enum'],
              enumValues: [1, 2, 3, 4, 5], // These are these nameless icons in FA KPI ☀️⛅☁️⛈️⚡
            },
            {
              name: 'Value',
              dataTypes: ['Number'],
            }
          ]          
        },
        {
          name: 'TA',
          items: [
            {
              name: 'Status',
              dataTypes: ['Enum'],
              enumValues: [1, 2, 3, 4, 5], // These are these nameless icons in FA KPI ☀️⛅☁️⛈️⚡
            },
            {
              name: 'Value',
              dataTypes: ['Number'],
            }
          ]          
        },
        {
          name: 'PA',
          items: [
            {
              name: 'Status',
              dataTypes: ['Enum'],
              enumValues: [1, 2, 3, 4, 5], // These are these nameless icons in FA KPI ☀️⛅☁️⛈️⚡
            },
            {
              name: 'Value',
              dataTypes: ['Number'],
            }
          ]          
        },
      ]
    },
    {
      name: 'Alarm Info',
      value: 'Alarm Info',
      items: [
        {
          name: 'Alarm Frequency',
          dataTypes: ['Number']
        },
        {
          name: 'AE Occurring',
          dataTypes: ['Boolean']
        },
        {
          name: 'Raw Alarms',
          dataTypes: ['Annotation']
        },
      ]
    },

    {
      // Also possible: Network Path, class Path etc.
      // For ISAE case, might not be possible since the hierarchy is not strucured
      // So for ISAE case, it will just be single level Path
      name: 'Path', // Assume Plant Path for now
      value: 'Path',
      items: [
        {
          name: 'Plant', //e.g. MYPJT
          dataTypes: ['string', 'group'],
          items: [
            {
              name: 'Site',
              dataTypes: ['string', 'group'],
              items: [
                {
                  name: 'Area',
                  dataTypes: ['string', 'group'],
                  items: [
                    {
                      name: 'Unit',
                      dataTypes: ['string'],
                    },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },  
  ]
};

const alarmsDummyMetadata = {
  name: 'Alarms Metadata',
  dataKey: 'alarmId', // null, if it's not available. Means this is not open for 'extension'
  RequestParams: [
    {
      // If this is the only parameter, retrievea all the alarms from within the Analysis Period
      // TODO: Consider adding a 'required' flag
      name: 'AnalysisPeriod',   
      dataTypes: ['Date Range'],   
      enumValues: ['Last 1 day', 'Last 7 days', 'Last 30 days', 'Custom Range']
    },
    {
      // Sample only -- no need to declare this as Device Id is already part of the Dimensions
      // name: 'Device Id',   
      // dataTypes: ['string'],   
    },
    {
      name: 'RequestKey',
      dataTypes: ['string'],   
    }
  ],
  Dimensions: [
    {
      name: 'Timestamp',
      dataTypes: ['Datetime']
    },
    {
      name: 'Start Date',
      dataTypes: ['Datetime']
    },
    {
      name: 'End Date',
      dataTypes: ['Datetime']
    },
    {
      name: 'Event Type',
      dataTypes: ['string']
    },
    {
      name: 'Message',
      dataTypes: ['string']
    },

  ]
}

const allDummyMetadata = [];

const defaultState = {
    toolPanelTreeSelected: null,
    //selectedControlId: null, // Don't put here. Just put inside the controls data. This is to avoid rendering all controls.
    // It is OK to put the selectedControlId inside the reducer for showing the Control Props
    resizingControlId: null, // try to just use local state to keep track. The whole designer only needs to know after resizing.
    layout: generateDefaultLayout(),
    layoutData: defaultLayoutData,

    // For the dashboard
    dashLayout: generateDefaultDashboard(),
    dashLayoutData: {},

    // For the metadata in configuring the data sources
    metadata: dummyMetaData
}

const defaultControlData = {
  'section': {
    title: 'New Section',
    level: 1
  },
  'richtext': {
    label: 'Rich Text:',
    placeholder: 'Enter value...'
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
    label: 'Table:'
  },
  'pie' : {
    label: 'Pie:'
  },
  'barchart' : {
    label: 'Bar:'
  },
  'label': {
    label: 'New Label',
    icon: 'lightbulb',
    backgroundColor: 'khaki'
  },
  'gauge': {
    label: 'new Gauge:',
    percent: 65
  },
  'pagebreak': {
  },
  'imageMap': {
    label: 'Image Map:',
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
      //newStateSelectCtrl.layout = [...state.layout]; // No need. If you do this, the entire designer will rerender, but only the empty controls will rerender
      setControlSelected(action.payload, newStateSelectCtrl.layout);
      return newStateSelectCtrl;
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
