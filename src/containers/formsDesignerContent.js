import React from 'react';
import NoobSplitter from '../components/noobSplitter';
import ToolPanel from '../components/toolPanel';
import DesignerForm from '../components/designerForm';
import DesignerContentbase from './designerContentBase';
import DesignerToolbar from '../components/designerToolbar';

const DEFAULT_SPLIT_SIZES = [15, 85];

const generateDefaultLayout = () => {
    // [1] Section
    return [
    {i: 'section0', x: 0, y: 0, w: 12, h: 1, type: 'section', data: {
        title: 'General Information',
        //backgroundColor: 'lightsteelblue'
        level: 1
    }},

    // [2] Description
    {i: 'richText0', x: 0, y: 1, w: 6, h: 8, type: 'richtext', 
        data: {
            label: 'Description',
            placeholder: 'Enter Description...'
        }},

    // [3] Date
    {i: 'date0', x: 6, y: 1, w: 3, h: 2},

    // [4] Status
    {i: 'status0', x: 6, y: 3, w: 3, h: 2},

    // [5] Priority
    {i: 'combo0', x: 6, y: 5, w: 3, h: 2, type: 'combo', data: {
        placeholder: 'Please Select...',
        options: dropdownOptions,
        label: 'Please select:'
    }},

    // [6] User
    {i: 'user0', x: 6, y: 7, w: 3, h: 2},

    // [7] Attachments
    {i: 'attach0', x: 9, y: 1, w: 3, h: 4},

    // [B] Subsection
    {i: 'section1', x: 0, y: 9, w: 12, h: 1, type: 'section', data: {
        title: 'Update History',
        //backgroundColor: 'lightsteelblue'
        level: 1
    }},

    // [1] History
    {i: 'history0', x: 0, y: 10, w: 12, h: 4},

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

const panelItems = [
    {
        title: 'Toolbox',
        id: 'toolbox',
        isCollapsed: false,
        size: 0,
        helpText: 'Drag an item to the Designer Area'
    },
    {
        title: 'Properties',
        id: 'properties',
        isCollapsed: false,
        size: 0,
        helpText: 'Please select an item from the Designer Area to view the properties'
    },
]

class formsDesignerContent extends DesignerContentbase {
    constructor(props) {
        super(props);
        this.defaultSizes = DEFAULT_SPLIT_SIZES;
    }
    
    render() {
        console.log('render designerContent');
        return <NoobSplitter id="designerPanel" onDragEnd={this.onSplitDragEnd}>
            <ToolPanel panelItems={panelItems}/>
            <div>
                <DesignerToolbar containerWidth={this.state.rightPixels}/>
                <DesignerForm 
                    containerWidth={this.state.rightPixels}
                    initialLayout={generateDefaultLayout()}/>
            </div>
        </NoobSplitter>
    }
}

export default formsDesignerContent;