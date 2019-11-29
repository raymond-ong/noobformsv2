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
// [3] Opaque Drag image. RGL's Drag image looks very nice because the Drag Image is 100% Opaque
//     Native DnD from HTML5 looks weird as it is semi-transparent with some gradient

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

    // for handling resizing operations
    onMouseMove(e, controlIds) {
        if (this.state.resizingControlId == null) {
            return;
        }

        // [1] Find the DOM Control via document query
        let domControl = this.findControlDomById(this.state.resizingControlId);
        if (domControl === null) {
            return;
        }

        if (!domControl.container.classList.contains('resizingControl')) {
            domControl.container.classList.add('resizingControl');
            domControl.content.classList.add('resizingContent');
        }   

        let rectContainer = domControl.container.getClientRects()[0];

        let yDelta = e.clientY - rectContainer.bottom;
        let xDelta = e.clientX - rectContainer.right;

        // [2] Set the new width and height based on the mouse position
        domControl.content.style.width = `${rectContainer.width + xDelta}px`;
        domControl.content.style.height = `${rectContainer.height + yDelta}px`;

        let rectResizing = domControl.content.getClientRects()[0];

        // [3] Check overlaps with other controls - highlight them
        this.checkOverlaps(this.state.resizingControlId, rectResizing, controlIds); // overlap with other controls

        // [4] Check overlaps with landing pad - highlight them
        this.checkLandingPadOverlap(this.state.resizingControlId, rectContainer, rectResizing);

    }

    checkLandingPadOverlap(resizingControlId, rectContainer, rectResizing) {
        // will only take effect if the resizing rect's height or width is smaller than the container
        if (rectContainer.width <= rectResizing.width && 
            rectContainer.height <= rectResizing.height) {
                //this.removeAllLandingPadPotentialDrops();
                //return;
        }    
        
        let landingPadsDom = this.findLandingPadsByParentControl(resizingControlId);
        //console.log('[DEBUG] checkLandingPadOverlap...' + landingPadsDom.length);
        // check if resizing rect covers me
        landingPadsDom.forEach(landingPad => {
            let rectLandingPad = landingPad.getClientRects()[0];
            let isOverlapped = this.hasOverlap(rectResizing, rectLandingPad);
            if (isOverlapped) {
                landingPad.classList.add('landingPadPotentialDrop');
            }
            else if (landingPad.classList.contains('landingPadPotentialDrop')) {
                landingPad.classList.remove('landingPadPotentialDrop');
            }
        });
    }

    removeAllLandingPadPotentialDrops() {
        let landingPadPotDrops = document.getElementsByClassName('landingPadPotentialDrop');
        if (landingPadPotDrops.length > 0) {
            // console.log('[DEBUG] removeAllLandingPadPotentialDrops' + landingPadPotDrops.length);
        }
    
        while (landingPadPotDrops.length > 0) {
            let currPad = landingPadPotDrops[0];
            currPad.classList.remove('landingPadPotentialDrop');
        }
    }

    findLandingPadsByParentControl(controlId) {
        let ret = {};
        let keyQuery = `[parentctrlid="ctrl${controlId}"]`;
        return document.querySelectorAll(keyQuery);
    }

    // also works
    hasOverlapComplicated(rect1, rect2) {

        //There are less scenarios for no collision so use this instead of checking for collision
        let noHorzCollision = rect2.right < rect1.left || rect2.left > rect1.right;
        let noVertCollision = rect2.bot < rect1.top || rect2.top > rect1.bottom;

        console.log(`   [DEBUG] NoHorz: ${noHorzCollision}, NoVert: ${noVertCollision}, FINAL: ${noHorzCollision || noVertCollision}`);
        // There is overlap if there is Vertical AND Horizontal collision
        return !noHorzCollision && !noVertCollision;
    }

    // simpler
    hasOverlap(rect1, rect2) {
        // if one rect is on the left side of the other rect
        if (rect2.right < rect1.left || rect2.left > rect1.right) {
            //console.log("   [hasOverlap] No horz overlap");
            return false;
        }

        // if one rect is on top of the other
        if (rect2.bottom < rect1.top || rect2.top > rect1.bottom) {
            //console.log("   [hasOverlap] No vertical overlap");
            return false;
        }

        //console.log("   [hasOverlap] has overlap");
        return true;
    }
/*
    hasOverlapOrig(rect1, rect2) {
        let buffer = 20;
        //let horzCollision = (rect2.left >= rect1.left) && (rect2.left <= rect1.right);
        let horzCollision = (rect2.left <= rect1.left && rect1.left <= rect2.right) || 
                            (rect2.left <= rect1.right && rect1.right <= rect2.right);
        // let vertCollision = (rect2.top >= rect1.top) && (rect2.top <= rect1.bottom);
        let vertCollision = (rect2.top <= rect1.top && rect1.top <= rect2.bottom) || 
                        (rect2.top <= rect1.bottom && rect1.bottom <= rect2.bottom);

        console.log(`   [DEBUG] Horz: ${horzCollision}, Vert: ${vertCollision}, FINAL: ${horzCollision && vertCollision}`);
        return horzCollision && vertCollision;
    }
*/
    
    checkOverlaps(resizingControlId, rectResizing, controlIds) {
        //console.log(`[DEBUG][checkOverlaps][${resizingControlId}][L-R: ${rectResizing.left} - ${rectResizing.right}][T-B: ${rectResizing.top} - ${rectResizing.bottom}]`);
        controlIds.forEach((controlId) => {       
            if (resizingControlId === controlId) {
                return; // continue
            }
            let domControl = this.findControlDomById(controlId);
            if (domControl === null) {
                return;
            }
    
            let rectContainer = domControl.container.getClientRects()[0];
    
            if (controlId === 5) {
                //console.log(`[DEBUG][CTRL5][L-R: ${rectContainer.left} - ${rectContainer.right}][T-B: ${rectContainer.top} - ${rectContainer.bottom}]`);
            }
            
            //console.log(`[DEBUG][${controlId}][L-R: ${rectContainer.left} - ${rectContainer.right}][T-B: ${rectContainer.top} - ${rectContainer.bottom}]`);
            let isOverlap = this.hasOverlap(rectResizing, rectContainer);
            if (isOverlap) {
                domControl.container.classList.add('potentialResizeDrop');
            }
            else if (domControl.container.classList.contains('potentialResizeDrop')) {
    
                domControl.container.classList.remove('potentialResizeDrop');
            }                    
        } );
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
        ret.landingPad = ret.container.firstChild;
        ret.content = ret.landingPad.nextSibling;
        ret.resizer = ret.content.nextSibling;
            
        return ret;    
    }

    createEmptyControl(inX, inY, id) {
        return {
            w: 1,
            h: 1,
            i: id,
            x: inX,
            y: inY
        }        
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
        // For retlist: we don't use object (KV pair) beacause we need to render them according to the order we pushed them to the list.
        // Retrieving the keys or values via Object.keys()/Object.values() do not come in the order that they were set
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
                    let emptyControlPojo = this.createEmptyControl(iCol, iRow, flatCoord); // plain old JS obj
                    let emptyControlJsx = this.renderControl(emptyControlPojo);
                    retList.push({
                        id: emptyControlPojo.i,
                        jsx: emptyControlJsx
                    });                    
                }
                else {
                    //retList.push(this.renderControl(findControl));
                    let controlJsx = this.renderControl(findControl);
                    retList.push({
                        id: findControl.i,
                        jsx: controlJsx
                    });
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
        let controlsList = this.renderControls(layoutData, controls);
        let controlIds = controlsList.map(c => c.id);
        let controlsJsx = controlsList.map(c => c.jsx);
    
        var divStyle = {'gridTemplateColumns': `repeat(${layoutData.columns}, 1fr)`};
        console.log('[DEBUG][NoobSection] Rendering...');
    
        return (
        <div className="noobForm" 
            onMouseLeave={this.onMouseLeave}
            onMouseUp={this.onMouseUp}
            onMouseMove={(e) => {this.onMouseMove(e, controlIds)}}
            style={divStyle}>
            {controlsJsx}            
        </div>    
        );    
    }
}

export default NoobForm;