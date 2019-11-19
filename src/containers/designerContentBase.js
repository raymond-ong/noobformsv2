import React from 'react';

// Design note: considered using HOC but cannot pass state values declared in HOC as props to wrapped commponent
// So we stick to classic inheritance

// TODO: vertical scrollbar width is not yet accounted for in the calculation of the width

const DEFAULT_SPLIT_SIZES = [15, 85];

class DesignerContentBase extends React.Component {
    constructor(props) {
        super(props);
        window.addEventListener('resize', this.onWindowResize);
        this.defaultSizes = DEFAULT_SPLIT_SIZES;
        this.state = {
            rightPixels: DEFAULT_SPLIT_SIZES[1] * window.innerWidth / 100.0,
            currRightPercent: DEFAULT_SPLIT_SIZES[1]
        };
    }

    componentDidMount() {
        this.setState({
            rightPixels: this.defaultSizes[1] * window.innerWidth / 100.0,
            currRightPercent: this.defaultSizes[1]
        });
    }

    onWindowResize = () => {        
        let rightPixels = this.state.currRightPercent / 100.0 * window.innerWidth;    
        this.setState({
            rightPixels: rightPixels
        });
    }

    onSplitDragEnd = (sizes) => {
        let rightPixels = sizes[1] / 100.0 * window.innerWidth;    
        console.log('onSplitDragEnd designerContent callback');   
        // if there are differences, call setState. We minimize rerenders
        this.setState({
            rightPixels: rightPixels,
            currRightPercent: sizes[1]
        });
    }
}

export default DesignerContentBase;