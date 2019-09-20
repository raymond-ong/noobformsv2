import React from 'react';
import Split from 'react-split';
import "../styles/Split.css";

// TODO: Maybe just use Semantic UI's tab component instead. Just hide the tab headers.
const stackedPanel = (props) => {
    // return <div style={{height: '800px'}}>
    //     {props.title}
    // </div>

    return <Split className="split"
            direction="horizontal"
            minSize={0}
            gutterSize={8}
            cursor="col-resize"
            >
            <div id="homeLeft" className="content" style={{backgroundColor: '#ffeecc'}}>
            Hello
            </div>                
            <div id="homeRight" className="content" style={{backgroundColor: '#D0D0D0'}}>
                {/* <DocumentSample/> */}
                Hi
            </div>
        </Split>;
}

export default stackedPanel;
