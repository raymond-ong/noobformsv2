import React, {Component} from 'react';
import Split from 'react-split';
import "../styles/Split.css";

import ToolPanel from '../components/toolPanel';
// import ScrollTracker from '../components/scrollTracker';
//import DocumentSample from '../components/documentSample';


const ID_SPLITTER = "homeContentSplitter";
const ID_GUTTER_AROW = "homeContentGutterArrow";
const DEFAULT_SPLIT_SIZES = [20, 80];

class HomeContent extends Component {

    // *** START: SPLITTER CUSTOMIZATION ***
    // Maybe should move this to another class instead
    constructor(props) {
        super(props);
        this.state = {
            collapseIdx: null,
            sizes: DEFAULT_SPLIT_SIZES
        };

        this.onSplitDragEnd = this.onSplitDragEnd.bind(this);
        this.onSplitDragStart = this.onSplitDragStart.bind(this);
        this.handleSplitterBtnClick = this.handleSplitterBtnClick.bind(this);
        this.createGutter = this.createGutter.bind(this);
    }

    handleSplitterBtnClick() {
        this.addRemoveContentTransition(true);
        if (this.state.sizes[0] < 1) {
            // Expand it
            this.setState({
                collapseIdx: null,
                sizes: DEFAULT_SPLIT_SIZES
            });
            // Show the Collapse arrow after expanding
            this.showCollapseArrow();
        }
        else {
            // Collapse it
            this.setState({
                collapseIdx: 0,
                sizes: [0, 100]
            });    

            // Show the expand button after expanding
            this.showExpandArrow();
        }    
    }

    showExpandArrow() {
        let gutterBtnArrow = document.getElementById(ID_GUTTER_AROW);
        gutterBtnArrow.classList.remove('arrow-left');
        gutterBtnArrow.classList.add('arrow-right');
    }

    showCollapseArrow() {
        let gutterBtnArrow = document.getElementById(ID_GUTTER_AROW);
        gutterBtnArrow.classList.remove('arrow-right');
        gutterBtnArrow.classList.add('arrow-left');
    }

    onSplitDragEnd(args) {
        console.log('onSplitDrageEnd', args);
        this.setState({
            sizes: args
        });

        if (this.state.sizes[0] < 1) {
            this.showExpandArrow();
        }
        else {
            this.showCollapseArrow();
        }

        this.addRemoveContentTransition(false);
    }

    onSplitDragStart(args) {
        console.log('onSplitDrageStart', args);
        this.addRemoveContentTransition(false);
    }

    addRemoveContentTransition(bAdd) {
        // Adds or Removes transition effects from the content classes
        let contentElems = document.getElementsByClassName('content');
        for (let i = 0; i < contentElems.length; i++) {
            let elem = contentElems[i];
            if (bAdd) {
                elem.style.transition = '0.5s';
            }
            else {
                elem.style.transition = '0.0s';
            }
        }
    }

    // Custom gutter with small expand/collapse button
    // TODO: prevent splitter from being dragged from the small button
    createGutter() {
        let gutterElem = document.createElement('div');
        // These 2 class names are the original class names of the gutter from react-split
        gutterElem.classList.add('gutter');
        gutterElem.classList.add('gutter-horizontal');

        // Add the small collapse/expand button
        let gutterBtn = document.createElement('div');
        gutterBtn.classList.add('gutterBtn');

        let gutterBtnArrow = document.createElement('div');
        gutterBtnArrow.classList.add('arrow-left');
        gutterBtnArrow.id = ID_GUTTER_AROW;
        gutterBtn.appendChild(gutterBtnArrow);

        gutterElem.appendChild(gutterBtn);
        gutterBtn.addEventListener("click", this.handleSplitterBtnClick);

        return gutterElem;
    }

    // *** END: SPLITTER CUSTOMIZATION ***    

    render() {
        return <Split className="split"
            id={ID_SPLITTER}
            direction="horizontal"
            sizes={this.state.sizes}
            minSize={0}
            gutterSize={8}
            collapsed={this.state.collapseIdx}
            onDragEnd={this.onSplitDragEnd}
            onDragStart={this.onSplitDragStart}
            snapOffset={0}
            cursor="col-resize"
            gutter={this.createGutter}
            >
            <div id="homeLeft" className="content" style={{backgroundColor: '#ffeecc'}}>
                <ToolPanel/>
                {/* <ScrollTracker/> */}
            </div>

            <div id="homeRight" className="content" style={{backgroundColor: '#D0D0D0'}}>
                {/* <DocumentSample/> */}
            </div>
        </Split>;
    }
}

export default HomeContent;