import React from 'react';
import ReactDOM from 'react-dom';

export default function noobControlHoc(WrappedComponent) {
    return class extends React.Component {

        onClick = (evt) => {
            console.log("[noobControlHoc] onClick");
            //debugger
            evt.stopPropagation();
        };

        onMouseDown = (evt) => {
            console.log("[noobControlHoc] onMouseDown");
            // Let the parent know that i am clicked. It's up to the parent to dispatch an action
            if (this.props.controlSelected) {                
                this.props.controlSelected(this.props);
            }
            evt.stopPropagation();
        }

        componentDidMount() {
            let domNode = ReactDOM.findDOMNode(this);
            if (domNode) {
                // Changed to mousedown so that dragging the control will also select the control
                domNode.addEventListener('mousedown', this.onMouseDown);
                //domNode.addEventListener('click', this.onClick);
            }
        }

        render() {
            return <WrappedComponent {...this.props}/>;
        }    
    }
}