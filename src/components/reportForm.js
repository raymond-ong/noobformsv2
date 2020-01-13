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

    renderControl(control) {
        return <ReportControl 
                key={'ctrl'+control.i} 
                controlData={control}
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

    // Return: array of arrays(1 array = group of controls that will be put together in 1 CSS grid or independent layout)
    // For printing there are limitations with the PDF Renderer:
    // [a] tables cannot be inside CSS grid, otherwise there will be overlaps if more than 1 page.
    // [b] CSS grid does not support page break
    // For the limitations above, we set the following workarounds (basically rearrange/override the layout to make it printer friendly):
    // [a1] while rendering row, if we find a table IN THE MIDDLE, skip rendering it first.
    //      after processing all rows, if there are "leftover" tables, create a new group just for each leftover table.
    // [a2] while rendering row, if we find tables FIRST, create a new group just for it already. 
    //      Render rest of controls of current row following [a1] or [a2] rule
    // [b] Put a CSS page break for the succeeding section. User is expected to put the page breaks in the layout manually in order to make sure pagination is handled properly while printing.
    //     If user puts 2 consecutive page breaks, will end up with 1 page break only.
    // Should also skip the blank rows at the end (like trim-end, but retain blank rows in between or at the beginning)
    renderControls(layoutData, controls) {
        let retList = [];  
        let fillMap = []; // way for us to monitor which cells are already filled up
        let maxRow = this.findLastNonEmptyRow(controls, layoutData);
        let currGroup = []; // List of controls that will be put together in 1 CSS-Grid layout
        let currGroupPagination = false;
        let bSetPagination = false; // Put a page-break-before in the next control to be rendered. 

        for (var iRow = 0; iRow <= maxRow; iRow++) {
            let tableControls = []; // table controls to be rendered after we're done processing the entire row
            let normalControlProcessed = false; // whether a non-table control has been processed already in this row
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
                    let emptyControlJsx = this.renderControl(emptyControlPojo);
                    currGroup.push({
                        id: emptyControlPojo.i,
                        jsx: emptyControlJsx
                    });
                    normalControlProcessed = true;
                }
                else if (findControl.ctrlType === 'pagebreak') {
                    bSetPagination = true; // to be processed in the next iteration
                    // Fill up the fillmap so that empty controls won't be rendered here
                    let newFills = this.getFills(findControl, layoutData.columns)
                    fillMap = fillMap.concat(newFills);
                }
                else if (findControl.ctrlType === 'table') {                    
                    if (normalControlProcessed === true) {
                        // render it later
                        tableControls.push(findControl);
                        debugger
                        // Update the fill map so that empty controls will not take its place
                        let newFills = this.getFills(findControl, layoutData.columns)
                        fillMap = fillMap.concat(newFills);                        
                    }
                    else {                        
                        // finish up currGroup first
                        if (currGroup.length > 0) {
                            retList.push({groupType: 'section', pageBreak: currGroupPagination, items: currGroup});
                            currGroupPagination = false;
                        }
                        currGroup = [];

                        // Update the fill map first before rendering, because we will manipulate the width
                        let newFills = this.getFills(findControl, layoutData.columns)
                        fillMap = fillMap.concat(newFills);

                        // render table now with full width...
                        findControl.w = 12;
                        let controlJsx = this.renderControl(findControl);
                        retList.push({groupType: 'table', pageBreak: currGroupPagination, 
                            items:[{
                                id: findControl.i,
                                jsx: controlJsx
                            }
                        ]});   
                        currGroupPagination = false;
                        

                    }
                }

                else {
                    let controlJsx = this.renderControl(findControl);
                    currGroup.push({
                        id: findControl.i,
                        jsx: controlJsx
                    });
                    let newFills = this.getFills(findControl, layoutData.columns)
                    fillMap = fillMap.concat(newFills);
                    normalControlProcessed = true;
                }
            } // End of Column for-loop

            // Render the leftover tables
            tableControls.forEach(table => {
                // finish up currGroup first
                if (currGroup.length > 0) {
                    retList.push({groupType: 'section', pageBreak: currGroupPagination, items: currGroup});
                }
                currGroupPagination = false;
                currGroup = [];

                // render it now...no need to fill up the fillmap so that the next control can take table's place and avoid a gap.
                // create 1 group for this table alone
                table.w = 12;
                let controlJsx = this.renderControl(table);                
                retList.push({groupType: 'table', pageBreak: currGroupPagination, 
                items:[{
                    id: table.i,
                    jsx: controlJsx
                }
            ]});   
            })
        } // End of Row for-loop
        
        if (currGroup.length > 0) {
            retList.push({groupType: 'section', pageBreak: currGroupPagination, items: currGroup});
        }

        debugger

        return retList;
    }

    renderGroups(groups, divStyle) {
        return groups.map((group, index) => {
            let formStyle = index > 0 && group.pageBreak ? {...divStyle, pageBreakBefore: "always"} : divStyle;
            debugger
            return <div className="reportForm"
                        style={formStyle}
                    >{group.items.map(control => {
                return control.jsx
            })}</div>
        })
    }

    render() {
        console.log('render ReportForm...');
        let {controls, layoutData} = this.props;
        let groupsList = this.renderControls(layoutData, controls);
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
            // <div className='reportFormContainer'>
            // First line
            // <h1>HelloA</h1>
            // Something in between
            // <h1>HelloB</h1>
            // </div>
        // [A] Try: do not mix table with CSS Grid
        // <div className='reportFormContainer'>
        //     Hello!
        //     <div className="nextPaged" 
        //     // style={{pageBreakBefore: "always", pageBreakAfter: "always"}}
        //     >
        //     I should be in next page!
        //     </div>
        //     Last Page
        //     <h1>H1 try1</h1>
        //     {/* <ReportTable style={{gridRowEnd: 'span 2', gridColumnEnd: 'span 12', border: '1px solid red'}} {...reportTableData}/> */}
        //     <ReportControl controlData={reportTableData}/>
        //     <h1>H1 try2</h1>
        // </div>)

        // [B] This does not work because Table and Grid do not go well together
        // <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)" }}>
        //     <div 
        //         id="reportForm" 
        //         className="reportForm" 
        //     >
        //     {/* <Section {...sectionData} style={{gridRowEnd: 'span 1', gridColumnEnd: 'span 12'}}/> */}
        //     <div>Hello1</div>
        //     <div>Hello2</div>
        //     <div>Hello3</div>
        //     <div>Hello4</div>
        //     <div>Hello5</div>
        //     <div>Hello6</div>
        //     <div>Hello7</div>
        //     <div>Hello8</div>
        //     <div>Hello9</div>
        //     <div>Hello10</div>
        //     <div>Hello11</div>
        //     <div>Hello12</div>
        //     <div>Hello13</div>
        //     <div>Hello14</div>
        //     <ReportTable style={{gridRowEnd: 'span 2', gridColumnEnd: 'span 12', border: '1px solid red'}} {...reportTableData}/>
        // </div>

        // [C] this does not work if there is a table in layout...CSS Grid conflicts with pagination
        //     
        <div className="reportFormsContainer">
            {this.renderGroups(groupsList, divStyle)}            
        </div>    
        );    
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ updateLayout }, dispatch);
}

export default connect(null, mapDispatchToProps)(ReportForm);