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

const defaultLayoutData = {
    columns: 12,
    rows: 200
  }

const render1Section = (index) => {
    let offset = index * 6; // 6 is the height of 1 section, including the invisible page break
    return [    {i: `ctrl-section${index}`, x: 0, y: offset + 0, w: 12, h: 1, ctrlType: 'section', data: {
        title: 'General Information' + index,
        //backgroundColor: 'lightsteelblue'
        level: 1
    }},
    
    
    // [2 NEW] Gauge chart
    {i: `ctrl-gauge${index}`, x: 0, y: offset + 1, w: 3, h: 4, ctrlType: 'gauge',       
    data: {
        label: 'Gauge:',
        percent: index/100.00
    }},

    // [3 new] Pie Chart
    {i: `ctrl-pie${index}`, x: 6, y: offset + 1, w: 3, h: 4, ctrlType: 'pie',       
        data: {
            label: 'Pie:',
    }},

    // [4 new] Bar Chart
    {i: `ctrl-bar${index}`, x: 3, y: offset + 1, w: 3, h: 4, ctrlType: 'barchart',       
        data: {
            label: 'Bar:',
    }},

    // [5] Priority
    {i: `ctrl-combo${index}`, x: 9, y: offset + 3, w: 3, h: 1, ctrlType: 'combo', data: {
        placeholder: 'Please select...',
        options: dropdownOptions,
        label: 'Courses:'
    }},

    // [6] Label
    {i: `ctrl-label${index}`, x: 9, y: offset + 1, w: 3, h: 1,ctrlType: 'label', data: {
        label: index % 2 === 0? 'I am a label' : 'The quick brown fox jumps over the lazy dog. Honesty is the best policy. Time is gold. The early birdy catches the worm.',
        color: 'blue',
        backgroundColor: 'khaki',
        fontSize: '18',
        icon: 'lightbulb'
    }},

    // [8] Remarks
    {i: `ctrl-textbox${index}`, x: 9, y: offset + 4, w: 3, h: 1,ctrlType: 'textbox', data: {
        placeholder: 'Input Remarks...',
        label: 'Remarks:'
    }},

    // [9] Page Break Control
    {i: `ctrl-pagebreak${index}`, x: 0, y: offset + 5, w: 12, h: 1,ctrlType: 'pagebreak', data: {}},
]}

const bigLayout = () => {
    let retList = [];
    for (let i = 0; i < 5; i++) {
        retList = [...retList, ...render1Section(i)];
    }

    return retList;
}

const defaultReportLayout = [
    {i: 'ctrl-section0', x: 0, y: 0, w: 12, h: 1, ctrlType: 'section', data: {
        title: 'General Information',
        //backgroundColor: 'lightsteelblue'
        level: 1
    }},
    
    
    // [2 NEW] Gauge chart
    {i: 'ctrl-gauge0', x: 0, y: 1, w: 3, h: 4, ctrlType: 'gauge',       
    data: {
        label: 'Gauge:',
        percent: 0.955
    }},

    // [3 new] Pie Chart
    {i: 'ctrl-pie0', x: 6, y: 1, w: 3, h: 4, ctrlType: 'pie',       
        data: {
            label: 'Pie:',
    }},

    // [4 new] Bar Chart
    {i: 'ctrl-bar0', x: 3, y: 1, w: 3, h: 4, ctrlType: 'barchart',       
        data: {
            label: 'Bar:',
    }},

    // [5] Priority
    {i: 'ctrl-combo0', x: 9, y: 3, w: 3, h: 1, ctrlType: 'combo', data: {
        placeholder: 'Please select...',
        options: dropdownOptions,
        label: 'Courses:'
    }},

    // [6] Label
    {i: 'ctrl-label0', x: 9, y: 1, w: 3, h: 1,ctrlType: 'label', data: {
        label: 'I am a label',
        color: 'blue',
        backgroundColor: 'khaki',
        fontSize: '18',
        icon: 'tag'
    }},


    // [8] Remarks
    {i: 'ctrl-textbox0', x: 9, y: 4, w: 3, h: 1,ctrlType: 'textbox', data: {
        placeholder: 'Input Remarks...',
        label: 'Remarks:'
    }},


    // [B] Subsection
    {i: 'ctrl-section1', x: 0, y: 5, w: 12, h: 1, ctrlType: 'section', data: {
        title: 'Loop Summary',
        //backgroundColor: 'lightsteelblue'
        level: 2
    }},

    /*
    //[2] Table - 1
    {i: 'ctrl-table0', x: 0, y:6, w: 12, h: 2,ctrlType: 'table', data: {
        label: 'Table:'
    }},
    
    //[2] Table Only
    // {i: 'ctrl-table0', x: 0, y:1, w: 12, h: 2,ctrlType: 'table', data: {
    //     label: 'Table:'
    // }},
    */
];

const defaultState = {
    //layout: defaultReportLayout,
    layout: bigLayout(),
    layoutData: defaultLayoutData,    
}

export default function(state = defaultState, action) {
    return state;
}