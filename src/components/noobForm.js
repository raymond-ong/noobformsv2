import React, { Component } from 'react';
import './noobForm.css';
import NoobControl from './noobControl';

const ROW_HEIGHT = 50;
const CONTROL_PADDING = 20;
const GRID_GAP = 5;

// CSS Grid based layout editor, instead of using react-grid-layout
// problems with RGL:
// [1] combobox multiselect: Griditem size does not expand based on the child content's size
// [2] if {useCssTransform = true}, there will be overlap problems with the combobox dropdown.
//     side effect of setting it to false is that drag and drop becomes unpredictable with Drag-from-outside
// But of course, there are many good features in RGL that might be difficult to recreate:
// [1] Animations, on-the fly preview
//      - might not be feasible with CSS Grid/current design. Anyways, this is just cosmetic.
// [2] Auto-arrange elements on DnD

// use destructuring to capture all the properties passed from upper component
//const NoobForm = ({containerWidth, controls, layoutProps, eventCallbacks}) => {
class NoobForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            resizingControlId: null
        };
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onResizerMouseDown = this.onResizerMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    onMouseMove(e) {
        if (this.state.resizingControlId == null) {
            return;
        }

        let domControl = this.findControlDomById(this.state.resizingControlId);
        if (domControl === null) {
            return;
        }

        if (!domControl.container.classList.contains('resizingControl')) {
            domControl.container.classList.add('resizingControl');
            domControl.content.classList.add('resizingContent');
        }   

        let rectContainer = domControl.container.getClientRects()[0];
        debugger

        let yDelta = e.clientY - rectContainer.bottom - 20;
        let xDelta = e.clientX - rectContainer.right - 20;

        domControl.content.style.width = `${rectContainer.width + xDelta}px`;
        domControl.content.style.height = `${rectContainer.height + yDelta}px`;
    }

    onMouseLeave() {        
        if (this.state.resizingControlId) {
            console.log('onMouseLeave while resizing');
            this.setState({
                resizingControlId: null
            });    
        }
    }

    onResizerMouseDown(event, controlId) {
        console.log('mouse down resizer...', controlId, event);
        this.setState({
            resizingControlId: controlId
        });    
    }

    onMouseUp(event, controlId) {
        if (this.state.resizingControlId) {
            console.log('mouseup while resizing');
            this.setState({
                resizingControlId: null
            });    
        }
    }

    findControlDomById(controlId) {
        let ret = {};
        let keyQuery = `[id="ctrl${controlId}"]`;
        let retEl = document.querySelectorAll(keyQuery);
        if (retEl.length !== 1) {
            return null;
        }
    
        ret.container = retEl[0];
        ret.content = ret.container.firstChild;
        ret.resizer = ret.content.nextSibling;
        ret.landingPad = ret.resizer.nextSibling;
    
        return ret;    
    }

    createEmptyControl(inX, inY, id) {
        let control = {
            w: 1,
            h: 1,
            i: id,
            x: inX,
            y: inY
        }

        return this.renderControl(control);
    }

    renderControl(control) {
        let ctrlStyle = {
            // set the minHeight instead of height. Height will make the height fixed regardless of the content.
            // minHeight allows the parent container to grow depending on content
            // actually we have not accounted for the Grid Gap yet...In case all the controls
            'minHeight': (ROW_HEIGHT * control.h) + (CONTROL_PADDING * (control.h - 1)) + (GRID_GAP * (control.h - 1)), 
            'gridRowEnd': 'span ' + control.h,
            'gridColumnEnd': 'span ' + control.w,
        };
        //return <div className="noobControl" style={ctrlStyle}>{control.i}</div>
        return <NoobControl 
                key={control.i} 
                controlData={control}
                resizerMouseDown={this.onResizerMouseDown}
                resizingControlId={this.state.resizingControlId}/>
    }

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


    renderControls(layoutData, controls) {
        // debugger
        let retList = [];
        let fillMap = [];
        for (var iRow = 0; iRow < layoutData.rows; iRow++) {
            for (var iCol = 0; iCol < layoutData.columns; iCol++) {            
                let flatCoord = iRow * layoutData.columns + iCol;
                // if coordinate already filled, skip
                if (fillMap.find(n => n === flatCoord)) {
                    continue;
                }

                // try to find if there is a control associated
                // otherwise just render an empty control
                let findControl = controls.find(ctrl => ctrl.x == iCol && ctrl.y == iRow );
                if (!findControl) {
                    retList.push(this.createEmptyControl(iCol, iRow, flatCoord));
                }
                else {
                    retList.push(this.renderControl(findControl));
                    let newFills = this.getFills(findControl, layoutData.columns)
                    fillMap = fillMap.concat(newFills);
                }
            }
        }

        return retList;
    }

    render() {
        console.log('render NoobForm...');
        let {controls, layoutData} = this.props;
        let controlComps = this.renderControls(layoutData, controls);
    
        var divStyle = {'gridTemplateColumns': `repeat(${layoutData.columns}, 1fr)`};
        console.log('[DEBUG][NoobSection] Rendering...');
    
        return (
        <div className="noobForm" 
            onMouseLeave={this.onMouseLeave}
            onMouseUp={this.onMouseUp}
            onMouseMove={this.onMouseMove}
            style={divStyle}>
            {controlComps}            
        </div>    
        );    
    }
}

export default NoobForm;