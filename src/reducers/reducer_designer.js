import { SELECT_TOOLPANEL_TREE, 
          SELECT_CONTROL, 
          UPDATE_DESIGNER_LAYOUT,
          UPDATE_CONTROL_PROPS} from "../actions/index";

// Note: if using CSS grid to populate the layout, the items must be sorted by row and column
// This is for the Forms layout
const generateDefaultLayout = () => {
  // [1] Section
  return [
  {i: 'ctrl-section0', x: 0, y: 0, w: 12, h: 1, ctrlType: 'section', data: {
      title: 'General Information',
      //backgroundColor: 'lightsteelblue'
      level: 1
  }},

  // [2] Description
  {i: 'ctrl-richText0', x: 0, y: 1, w: 6, h: 4, ctrlType: 'richtext',       
      data: {
          label: 'Description:',
          placeholder: 'Enter Description...'
      }},

  // [3] Date
  {i: 'ctrl-date0', x: 6, y: 1, w: 3, h: 1, ctrlType: 'date'},

  // [4] Status
  {i: 'ctrl-status0', x: 6, y: 2, w: 3, h: 1, ctrlType: 'status'},

  // [5] Priority
  {i: 'ctrl-combo0', x: 6, y: 3, w: 3, h: 1, ctrlType: 'combo', data: {
      placeholder: 'Please select...',
      options: dropdownOptions,
      label: 'Courses:'
  }},

  // [6] User
  {i: 'ctrl-user0', x: 6, y: 4, w: 3, h: 1, ctrlType: 'user'},
  // {i: 'combo1', x: 6, y: 4, w: 3, h: 1, ctrlType: 'combo', data: {
  //     placeholder: 'Please Select...',
  //     options: dropdownOptions,
  //     label: 'Please select:'
  // }},    

  // [7] Attachments
  {i: 'ctrl-attachment0', x: 9, y: 1, w: 3, h: 2,ctrlType: 'attachment'},


  // [8] Remarks
  {i: 'ctrl-textbox0', x: 9, y: 4, w: 3, h: 1,ctrlType: 'textbox', data: {
    placeholder: 'Input Remarks...',
    label: 'Remarks:'
  }},


  // [B] Subsection
  {i: 'ctrl-section1', x: 0, y: 5, w: 12, h: 1, ctrlType: 'section', data: {
      title: 'Update History',
      //backgroundColor: 'lightsteelblue'
      level: 2
  }},

  // [1] History
  {i: 'ctrl-history0', x: 0, y: 6, w: 12, h: 2, ctrlType: 'history'},

  // [2] Table - 1
  {i: 'ctrl-table0', x: 0, y: 8, w: 3, h: 2,ctrlType: 'table', data: {
    label: 'Table:'
  }},

  // [2] Table - 2
  {i: 'ctrl-table1', x: 3, y: 8, w: 3, h: 2,ctrlType: 'table', data: {
    label: 'Table:'
  }},
  // [2] Table - 3
  {i: 'ctrl-table2', x: 6, y: 8, w: 3, h: 2,ctrlType: 'table', data: {
    label: 'Table:'
  }},
  // [2] Table - 4
  {i: 'ctrl-table3', x: 9, y: 8, w: 3, h: 2,ctrlType: 'table', data: {
    label: 'Table:'
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
];

const defaultLayoutData = {
  columns: 12,
  rows: 10
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
  ];
}

const defaultState = {
    toolPanelTreeSelected: null,
    //selectedControlId: null, // Don't put here. Just put inside the controls data. This is to avoid rendering all controls.
    // It is OK to put the selectedControlId inside the reducer for showing the Control Props
    resizingControlId: null, // try to just use local state to keep track. The whole designer only needs to know after resizing.
    layout: generateDefaultLayout(),
    layoutData: defaultLayoutData,

    // For the dashboard
    dashLayout: generateDefaultDashboard(),
    dashLayoutData: {}
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
  }  
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
  }
  return state;
}
