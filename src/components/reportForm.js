import React, { Component } from 'react';
import './reportForm.css';
import ReportControl from './reportControl';
import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import { updateLayout } from '../actions/index';
import {ControlDragTypes} from './noobControlContent';
import { WIDTH_LARGE } from '../constants';

// testing only
import ReportTable from '../controls/reportTable';
import Section from '../controls/section';

const ROW_HEIGHT = 50;
const CONTROL_PADDING = 20;
const GRID_GAP = 5;

// CSS Grid based layout editor, but for reporting purposes only
// This does not contain all the drag and drop functionality
class ReportForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    findControlPojo(controlId) {
        if (!this || !this.props || !this.props.controls) {            
            console.log("findControlPojo: props is empty");
            return null;
        }

        let findControl = this.props.controls.find(control => control.i === controlId);
        if (!findControl) {
            console.log("findControlPojo: did not find the control with ID", controlId); // just log it
        }

        return findControl;
    }

    createEmptyControl(inX, inY, id) {
        // Return a 1x1 control
        return {
            w: 1,
            h: 1,
            i: id,
            x: inX,
            y: inY
        }        
    }

    renderControl(control, containerWidth, numCols) {
        // Debug for Pie chart, add some more properties that we need to configure
        if (control.ctrlType === 'pie') {
            console.log("[ReportForm] Overriding Pie chart dataProps");
            control.dataProps = {
                dataUrl: "http://localhost:60000/api/data",
                requestType: 'GetDeviceCounts',
                aggregation: 'count',
                granularity: null,                
                Groupings: ['Vendor'], // will be sent to the API server...This should be the default value at first
                configedGroupings: ['Vendor', 'Model'], // This is the grouping engineered
                datasetId: 0, // other controls belonging to the same datasetId will have related filters
                RequestParams: [{
                    Name: "Analysis Period",
                    Value: "CustomRange",
                    StartDate: null,
                    EndDate: null,
                }]
            }
        }
        else if (control.ctrlType === 'barchart') {
            control.data.stacked = true;
            control.dataProps = {
                dataUrl: "http://localhost:60000/api/data",
                requestType: 'GetDeviceCounts',
                aggregation: 'count',
                granularity: null,
                categories: ['Vendor'],
                configedCategories: ['Vendor', 'Model'], // This is the grouping engineered
                seriesName: 'PRM Device Status', // Actual values: "Normal", "Comm Error" etc
                Groupings: ['Vendor', 'PRM Device Status'], // Will be sent to the API server...This should be the default value at first          
                datasetId: 0,
                RequestParams: [{
                    Name: "Analysis Period",
                    Value: "CustomRange",
                    StartDate: null,
                    EndDate: null,
                }]                

            }
        }


        return <ReportControl 
                key={'ctrl'+control.i} 
                controlData={control}
                containerWidth={containerWidth}
                numCols={numCols}
                />
    }

    // Returns an array containing the flat coordinates of the specified control
    // E.g. Control is x:0, y:0, w:3, h:2, layoutWidth:10
    // return: [0,   1,  2,         --> first row
    //          10, 11, 12]         --> second row
    getFills(control, layoutWidth) {
        let retList = [];
        for (var iRow = 0; iRow < control.h; iRow++) {
            for (var iCol = 0; iCol < control.w; iCol++) {
                
                let adjustedX = iCol + control.x; 
                let adjustedY = iRow + control.y;
                retList.push(adjustedY * layoutWidth + adjustedX);
            }
        }

        return retList;
    }

    findLastNonEmptyRow(controls, layoutData) {
        for (var iRow = layoutData.rows - 1; iRow >= 0; iRow--) {
            let findControl = controls.find(ctrl => ctrl.y === iRow);
            if(!!findControl && findControl.ctrlType !== 'pagebreak') {
                return iRow;
            }
        }

        return 0; // means there is no control; form is empty
    }

    // Returns true if the control is the only control in the rows where the control is placed
    isControlSolo(control, layoutData) {
        let findOverlap = layoutData.find(layoutCtrl => 
            {
                if (layoutCtrl.i === control.i) {
                    return false;
                }

                // if one rect is on top of the other, there is no overlap
                // if (rect2.bottom < rect1.top || rect2.top > rect1.bottom) {
                if ((layoutCtrl.y + layoutCtrl.h - 1) < control.y || layoutCtrl.y > (control.y + control.h - 1)) {
                    return false
                }
                
                return true;
            });
        return !findOverlap;
    }

    // Return: array of arrays(1 array = group of controls that will be put together in 1 CSS grid or independent layout)
    // For printing there are limitations with the PDF Renderer:
    // [a] tables cannot be inside CSS grid, otherwise there will be overlaps if more than 1 page.
    // [b] CSS grid does not support page break
    // For the limitations above, we set the following workarounds (basically rearrange/override the layout to make it printer friendly):
    // [a1] If table is the "solo" control of row(s), insert a page break and create a new group just for the table
    // [a2] If table is not "solo", means the user is expecting the table to be very small.
    //      Table will be rendered as-is. Risk of overlap would be there, but it's user's fault.



    // [a1] while rendering row, if we find a table IN THE MIDDLE, skip rendering it first.
    //      after processing all rows, if there are "leftover" tables, create a new group just for each leftover table.
    // [a2] while rendering row, if we find tables FIRST, create a new group just for it already. 
    //      Render rest of controls of current row following [a1] or [a2] rule
    // [b] Put a CSS page break for the succeeding section. User is expected to put the page breaks in the layout manually in order to make sure pagination is handled properly while printing.
    //     If user puts 2 consecutive page breaks, will end up with 1 page break only.
    // Should also skip the blank rows at the end (like trim-end, but retain blank rows in between or at the beginning)
    renderControls(layoutData, controls, containerWidth) {
        let retList = [];  
        if (!layoutData || !layoutData) {
            return retList;            
        }        
        let fillMap = []; // way for us to monitor which cells are already filled up
        let maxRow = this.findLastNonEmptyRow(controls, layoutData);
        let currGroup = []; // List of controls that will be put together in 1 CSS-Grid layout
        let currGroupPagination = false;
        let bSetPagination = false; // Put a page-break-before in the next control to be rendered. 

        for (var iRow = 0; iRow <= maxRow; iRow++) {
            let tableControls = []; // table controls to be rendered after we're done processing the entire row
            for (var iCol = 0; iCol < layoutData.columns; iCol++) {
                let flatCoord = iRow * layoutData.columns + iCol;
                // if coordinate already filled, skip (to avoid misaligning controls)
                // If user configured the XYWH coords properly, should not come here
                if (fillMap.find(n => n === flatCoord)) {
                    continue;
                }

                if (bSetPagination && iCol === 0) { // iCol should be 0 if there is pagination because pagebreak control will take up whole width
                    // todo: add page break to the next empty/nonempty control
                    // create a new group and push the previous group to retList
                    if (currGroup.length > 0) {
                        retList.push({groupType: 'section', pageBreak: currGroupPagination, items: currGroup});                        
                    }
                    currGroup = [];
                    bSetPagination = false;
                    currGroupPagination = true;
                }

                // try to find if there is a control associated
                // otherwise just render an empty control
                let findControl = controls.find(ctrl => ctrl.x == iCol && ctrl.y == iRow );
                if (!findControl) {
                    let emptyControlPojo = this.createEmptyControl(iCol, iRow, flatCoord); // plain old JS obj
                    let emptyControlJsx = this.renderControl(emptyControlPojo, containerWidth, layoutData.columns);
                    currGroup.push({
                        id: emptyControlPojo.i,
                        jsx: emptyControlJsx
                    });
                }
                else if (findControl.ctrlType === 'pagebreak') {
                    bSetPagination = true; // to be processed in the next iteration
                    // Fill up the fillmap so that empty controls won't be rendered here
                    let newFills = this.getFills(findControl, layoutData.columns)
                    fillMap = fillMap.concat(newFills);
                }
                else if (findControl.ctrlType === 'table' && this.isControlSolo(findControl, controls)) {
                                
                    // finish up currGroup first
                    if (currGroup.length > 0) {
                        retList.push({groupType: 'section', pageBreak: currGroupPagination, items: currGroup});
                        currGroupPagination = false;
                    }
                    currGroup = [];


                    // render table now with full width...
                    findControl.w = 12;
                    let controlJsx = this.renderControl(findControl,  containerWidth, layoutData.columns);
                    retList.push({groupType: 'table', pageBreak: currGroupPagination, 
                        items:[{
                            id: findControl.i,
                            jsx: controlJsx
                        }
                    ]});   
                    currGroupPagination = false;                    

                    // Update the fill map also
                    let newFills = this.getFills(findControl, layoutData.columns)
                    fillMap = fillMap.concat(newFills);
                }

                else {
                    let controlJsx = this.renderControl(findControl, containerWidth, layoutData.columns);
                    currGroup.push({
                        id: findControl.i,
                        jsx: controlJsx
                    });
                    let newFills = this.getFills(findControl, layoutData.columns)
                    fillMap = fillMap.concat(newFills);
                }
            } // End of Column for-loop
        } // End of Row for-loop
        
        if (currGroup.length > 0) {
            retList.push({groupType: 'section', pageBreak: currGroupPagination, items: currGroup});
        }

        //debugger

        return retList;
    }

    renderGroups(groups, divStyle) {
        return groups.map((group, index) => {
            let formStyle = index > 0 && group.pageBreak ? {...divStyle, pageBreakBefore: "always"} : divStyle;
            return <div className="reportForm"
                        style={formStyle}
                        key={`reportForm-${group}-${index}`}
                    >{group.items.map(control => {
                return control.jsx
            })}</div>
        })
    }

    render() {
        console.log('render ReportForm...');
        let {controls, layoutData} = this.props;
        if (!layoutData || !controls) {
            return null;
        }

        let groupsList = this.renderControls(layoutData, controls, window.innerWidth-50); // minus 50 for the left and right margin of PDF
        //let controlsJsx = controlsList.map(c => c.jsx);
    
        var divStyle = {'gridTemplateColumns': `repeat(${layoutData.columns}, 1fr)`};
    
        let reportTableData = {i: 'ctrl-table0', x: 0, y:1, w: 12, h: 2,ctrlType: 'table', data: {
            label: 'Table:'
        }};
        let sectionData = {i: 'ctrl-section0', x: 0, y: 0, w: 12, h: 1, ctrlType: 'section', data: {
            title: 'General Information',
            //backgroundColor: 'lightsteelblue'
            level: 1
        }};

        let tableData = {i: 'ctrl-table0', x: 0, y:6, w: 12, h: 2,ctrlType: 'table', data: {
            label: 'Table:'
        }};

        return (
        <div className="reportFormsContainer" style={{maxWidth: `${window.innerWidth-50}px`}}>
            {/* {'[DEBUG] ContainerWidth: ' + window.innerWidth} */}
            {this.renderGroups(groupsList, divStyle)}            
        </div>    
        );    
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ updateLayout }, dispatch);
}

export default connect(null, mapDispatchToProps)(ReportForm);