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
    let offset = index * 7; // 7 is the height of 1 section, including the invisible page break
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

    // [9] Scenario 1: Table - Just by itself at the bottom of section
    {i: 'ctrl-table0', x: 0, y:offset+5, w: 12, h: 2,ctrlType: 'table', data: {
        label: 'Table:'
    }},
]}

// convenience func for testing
const computeMaxIndex = (data) => {
    let maxIndex = 0;
    data.forEach(ctrl => {
        let currCtrlBtmIdx = ctrl.y + ctrl.h - 1;
        if (currCtrlBtmIdx > maxIndex) {
            maxIndex = currCtrlBtmIdx;
        }
    })

    return maxIndex;
}

// Scenario1: Table, own row, no Page break after last control
const render1Section_1 = (index, start) => {
    let offset = start;
    let data = [    {i: `ctrl-section${index}`, x: 0, y: offset + 0, w: 12, h: 1, ctrlType: 'section', data: {
        //title: 'General Information' + index,
        //backgroundColor: 'lightsteelblue'
        title: 'Scenario1: Table, own row, no Page break after last control',
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

    // [9] Scenario 1: Table - Just by itself at the bottom of section
    {i: 'ctrl-table0', x: 0, y:offset+5, w: 12, h: 2,ctrlType: 'table', data: {
        label: 'Table:'
    }},
    ]; // data end

    let maxIndex = computeMaxIndex(data);

    return {
        endIndex: maxIndex,
        data
    }
}

// Scenario2: Table, own row, has Page break after last control
const render1Section_2 = (index, start) => {
    let offset = start;
    let data = [    {i: `ctrl-section${index}`, x: 0, y: offset + 0, w: 12, h: 1, ctrlType: 'section', data: {
        //title: 'General Information' + index,
        //backgroundColor: 'lightsteelblue'
        title: 'Scenario2: Table, own row, has Page break after last control',
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

    // [9] Scenario 1: Table - Just by itself at the bottom of section
    {i: 'ctrl-table0', x: 0, y:offset+5, w: 12, h: 2,ctrlType: 'table', data: {
        label: 'Table:'
    }},

    // [10] Page Break Control
    {i: `ctrl-pagebreak${index}`, x: 0, y: offset + 7, w: 12, h: 1,ctrlType: 'pagebreak', data: {}},
    ];

    let maxIndex = computeMaxIndex(data, start);
    return {
        endIndex: maxIndex,
        data
    }
}

// Scenario3: Table, as 4th control of row, has page break after last control
const render1Section_3 = (index, start) => {
    let offset = start;
    let data = [    {i: `ctrl-section${index}`, x: 0, y: offset + 0, w: 12, h: 1, ctrlType: 'section', data: {
        //title: 'General Information' + index,
        //backgroundColor: 'lightsteelblue'
        title: 'Scenario3: Table, as 4th control of row, has page break after last control',
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

    // [9] Scenario 1: Table - Just by itself at the bottom of section
    {i: 'ctrl-table0', x: 9, y:offset+1, w: 3, h: 4,ctrlType: 'table', data: {
        label: 'Table:'
    }},

    // [10] Page Break Control
    {i: `ctrl-pagebreak${index}`, x: 0, y: offset + 5, w: 12, h: 1,ctrlType: 'pagebreak', data: {}},
    ];

    let maxIndex = computeMaxIndex(data, start);
    return {
        endIndex: maxIndex,
        data
    }
}

// Scenario4: Table, as 1st control of row, has page break after last control
const render1Section_4 = (index, start) => {
    let offset = start;
    let data = [    {i: `ctrl-section${index}`, x: 0, y: offset + 0, w: 12, h: 1, ctrlType: 'section', data: {
        //title: 'General Information' + index,
        //backgroundColor: 'lightsteelblue'
        title: 'Scenario4: Table, as 1st control of row, has page break after last control',
        level: 1
    }},
    
    
    // [2 NEW] Gauge chart
    {i: `ctrl-gauge${index}`, x: 3, y: offset + 1, w: 3, h: 4, ctrlType: 'gauge',       
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
    {i: `ctrl-bar${index}`, x: 9, y: offset + 1, w: 3, h: 4, ctrlType: 'barchart',       
        data: {
            label: 'Bar:',
    }},

    // [9] Scenario 1: Table - Just by itself at the bottom of section
    {i: 'ctrl-table0', x: 0, y:offset+1, w: 3, h: 4,ctrlType: 'table', data: {
        label: 'Table:'
    }},

    // [10] Page Break Control
    {i: `ctrl-pagebreak${index}`, x: 0, y: offset + 5, w: 12, h: 1,ctrlType: 'pagebreak', data: {}},
    ];

    let maxIndex = computeMaxIndex(data, start);
    return {
        endIndex: maxIndex,
        data
    }
}

const bigLayout = () => {
    let retList = [];
    // for (let i = 0; i < 2; i++) {
    //     retList = [...retList, ...render1Section_1(i)];
    // }
    // retList = [
    //     ...render1Section_1(0, 0),
    //     ...render1Section_2(1, 7),
    // ]
    let currEndIdx = 0;
    // let data1 = render1Section_1(0, currEndIdx);
    // retList =[...retList, ...data1.data];
    // currEndIdx = data1.endIndex + 1;

    // let data2 = render1Section_2(1, currEndIdx);
    // retList =[...retList, ...data2.data];
    // currEndIdx = data2.endIndex + 1;

    let data3 = render1Section_3(2, currEndIdx);
    retList =[...retList, ...data3.data];
    currEndIdx = data3.endIndex + 1;

    // retList = [...retList, {i: `ctrl-section`, x: 0, y: currEndIdx + 0, w: 12, h: 1, ctrlType: 'section', data: {
    //     //title: 'General Information' + index,
    //     //backgroundColor: 'lightsteelblue'
    //     title: 'Scenario4: Table, as 1st control of row, has page break after last control',
    //     level: 1
    // }}];

    let data4 = render1Section_4(3, currEndIdx);
    retList =[...retList, ...data4.data];
    currEndIdx = data4.endIndex + 1;    

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