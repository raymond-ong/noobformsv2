import React from 'react';

// Design note: considered using HOC but cannot pass state values declared in HOC as props to wrapped commponent
// So we stick to classic inheritance

// TODO: vertical scrollbar width is not yet accounted for in the calculation of the width

const DEFAULT_SPLIT_SIZES = [15, 85];
const GRID_GAP = 8;

class DesignerContentBase extends React.Component {
    constructor(props) {
        super(props);
        this.defaultSizes = props.defaultSizes ? props.defaultSizes : DEFAULT_SPLIT_SIZES;
        window.addEventListener('resize', this.onWindowResize);
        this.state = {
            leftPixels: this.defaultSizes[0] * (window.innerWidth - GRID_GAP) / 100.0,
            rightPixels: this.defaultSizes[1] * (window.innerWidth - GRID_GAP) / 100.0,
            currRightPercent: this.defaultSizes[1]
        };
    }

    componentDidMount() {
        console.log('[designerContentBase] componentDidMount, rightixels supposedly:', this.defaultSizes, this.defaultSizes[1] * window.innerWidth / 100.0);
        // Note: this causes the designer to render twice! Not a good design!
        // Maybe my own designer does not need this.
        // Actually this is only needed with React-grid-layout because the width is a props
        // this.setState({
        //     rightPixels: this.defaultSizes[1] * window.innerWidth / 100.0,
        //     currRightPercent: this.defaultSizes[1]
        // });
    }

    onWindowResize = () => {        
        let rightPixels = this.state.currRightPercent / 100.0 * (window.innerWidth - GRID_GAP);    
        this.setState({
            rightPixels: rightPixels,
            leftPixels: window.innerWidth - rightPixels
        });
    }

    onSplitDragEnd = (sizes) => {
        let rightPixels = sizes[1] / 100.0 * (window.innerWidth - GRID_GAP);    
        console.log('onSplitDragEnd designerContent callback');   
        //if there are differences, call setState. We minimize rerenders
        this.setState({
            rightPixels: rightPixels,
            currRightPercent: sizes[1],
            leftPixels: window.innerWidth - rightPixels - GRID_GAP
        });
    }
}

export default DesignerContentBase;