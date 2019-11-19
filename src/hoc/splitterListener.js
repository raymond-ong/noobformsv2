import React from 'react';

export default function splitterListener(WrappedComponent, defaultSizes) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            window.addEventListener('resize', this.onWindowResize);
            this.state = {
                rightPixels: defaultSizes[1] * window.innerWidth / 100.0,
                currRightPercent: defaultSizes[1]
            };
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

        render() {
            // ... and renders the wrapped component with the fresh data!
            // Notice that we pass through any additional props
            return <WrappedComponent stateData={this.state} {...this.props} />;
          }    
    };
}