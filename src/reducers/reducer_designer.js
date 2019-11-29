import { SELECT_TOOLPANEL_TREE, SELECT_CONTROL, UPDATE_DESIGNER_LAYOUT } from "../actions/index";

// Note: if using CSS grid to populate the layout, the items must be sorted by row and column
const generateDefaultLayout = () => {
  // [1] Section
  return [
  {i: 'section0', x: 0, y: 0, w: 12, h: 1, type: 'section', data: {
      title: 'General Information',
      //backgroundColor: 'lightsteelblue'
      level: 1
  }},

  // [2] Description
  {i: 'richText0', x: 0, y: 1, w: 6, h: 4, type: 'richtext', 
      data: {
          label: 'Description:',
          placeholder: 'Enter Description...'
      }},

  // [3] Date
  {i: 'date0', x: 6, y: 1, w: 3, h: 1},

  // [4] Status
  {i: 'status0', x: 6, y: 2, w: 3, h: 1},

  // [5] Priority
  {i: 'combo0', x: 6, y: 3, w: 3, h: 1, type: 'combo', data: {
      placeholder: 'Please Select...',
      options: dropdownOptions,
      label: 'Please select:'
  }},

  // [6] User
  //{i: 'user0', x: 6, y: 4, w: 3, h: 1},
  {i: 'combo1', x: 6, y: 4, w: 3, h: 1, type: 'combo', data: {
      placeholder: 'Please Select...',
      options: dropdownOptions,
      label: 'Please select:'
  }},    

  // [7] Attachments
  {i: 'attach0', x: 9, y: 1, w: 3, h: 2},

  // [B] Subsection
  {i: 'section1', x: 0, y: 5, w: 12, h: 1, type: 'section', data: {
      title: 'Update History',
      //backgroundColor: 'lightsteelblue'
      level: 1
  }},

  // [1] History
  {i: 'history0', x: 0, y: 6, w: 12, h: 2},

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
];

const defaultLayoutData = {
  columns: 12,
  rows: 12
}

const defaultState = {
    toolPanelTreeSelected: null,
    selectedControlId: null, // Don't put here. Just put inside the controls data. This is to avoid rendering all controls.
    resizingControlId: null, // try to just use local state to keep track. The whole designer only needs to know after resizing.
    layout: generateDefaultLayout(),
    layoutData: defaultLayoutData
}

export default function(state = defaultState, action) {
  console.log('[DEBUG] reducer_designer', action, state);
  switch (action.type) {
    case SELECT_TOOLPANEL_TREE:
      return {
        ...state,
        toolPanelTreeSelected: action.payload
      };
    case SELECT_CONTROL:
      return {
        ...state,
        selectedControlId: action.payload
      };
    case UPDATE_DESIGNER_LAYOUT:
        return {
          ...state,
          layout: action.payload
        };
  }
  return state;
}
