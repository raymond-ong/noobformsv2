import React, { Component } from 'react';
import './noobForm.css';
import NoobControl from './noobControl';

const ROW_HEIGHT = 50;
const CONTROL_PADDING = 20;
const GRID_GAP = 5;

// use destructuring to capture all the properties passed from upper component
//const NoobForm = ({containerWidth, controls, layoutProps, eventCallbacks}) => {
class NoobForm extends React.Component {

    constructor(props) {
        super(props);
    }

    createEmptyControl(inX, inY, id) {
        let ctrlStyle = {
            'minHeight': ROW_HEIGHT, 
        }
        return (<div style={ctrlStyle} className="noobControl">{id}</div>);
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
        return <NoobControl controlData={control}/>
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
                if (fillMap.find(n => n === flatCoord)) {
                    continue;
                }

                // if coordinate already filled, skip
                debugger

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
        <div className="noobForm" style={divStyle}>
            {controlComps}
        </div>    
        );    
    }
}

export default NoobForm;