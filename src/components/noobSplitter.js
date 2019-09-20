import React, {Component} from 'react';
import Split from 'react-split';
import "../styles/Split.css";

const ID_PREFIX_SPLITTER = "noobSplitter";
const ID_PREFIX_GUTTER_AROW = "noobSplitterGutterArrow";
const DEFAULT_SPLIT_SIZES = [20, 80];

// Small reusable class for creating a splitter with a gutter button
// Currently, only limited to 2 items, and direction is only horizontal
class NoobSplitter extends Component {

    // *** START: SPLITTER CUSTOMIZATION ***
    constructor(props) {
        super(props);
        this.state = {
            collapseIdx: null,
            sizes: this.getDefaultSizes(),
            id: props.id
        };

        this.onSplitDragEnd = this.onSplitDragEnd.bind(this);
        this.onSplitDragStart = this.onSplitDragStart.bind(this);
        this.handleSplitterBtnClick = this.handleSplitterBtnClick.bind(this);
        this.createGutter = this.createGutter.bind(this);
    }

    getDefaultSizes() {
        if (this.props && this.props.defaultSize) {
            return this.props.defaultSize;
        }

        return DEFAULT_SPLIT_SIZES;
    }

    handleSplitterBtnClick() {
        this.addRemoveContentTransition(true);
        if (this.state.sizes[0] < 1) {
            // Expand it
            this.setState({
                collapseIdx: null,
                sizes: this.getDefaultSizes()
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
        let gutterBtnArrow = document.getElementById(ID_PREFIX_GUTTER_AROW + this.state.id);
        gutterBtnArrow.classList.remove('arrow-left');
        gutterBtnArrow.classList.add('arrow-right');
    }

    showCollapseArrow() {
        let gutterBtnArrow = document.getElementById(ID_PREFIX_GUTTER_AROW + this.state.id);
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

        if (this.props.onDragEnd) {
            this.props.onDragEnd(args);
        }
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
        gutterBtnArrow.id = ID_PREFIX_GUTTER_AROW + this.state.id;
        gutterBtn.appendChild(gutterBtnArrow);

        gutterElem.appendChild(gutterBtn);
        gutterBtn.addEventListener("click", this.handleSplitterBtnClick);

        return gutterElem;
    }

    // *** END: SPLITTER CUSTOMIZATION ***    

    render() {
        console.log('[noobSplitter][render()] ', this.props.children);
        let child1 = <div/>;
        let child2 = <div/>;
        if (this.props.children) {
            if (!Array.isArray(this.props.children)) {
                child1 = this.props.children;
            }
            else if (this.props.children.length > 1) {
                child1 = this.props.children[0];
                child2 = this.props.children[1];
            }
        }

        return <Split className="split"
            id={ID_PREFIX_SPLITTER + this.state.id}
            direction="horizontal"
            sizes={this.state.sizes}
            minSize={this.props.minSize ? this.props.minSize : 0}
            gutterSize={8}
            collapsed={this.state.collapseIdx}
            onDragEnd={this.onSplitDragEnd}
            onDragStart={this.onSplitDragStart}
            snapOffset={0}
            cursor="col-resize"
            gutter={this.createGutter}
            >
            <div id="homeLeft" className="content" style={{backgroundColor: '#ffeecc'}}>
                {/* <ToolPanel/> */}
                {/* <ScrollTracker/> */}
                {child1}
            </div>

            <div id="homeRight" className="content" style={{backgroundColor: '#D0D0D0'}}>
                {/* <DocumentSample/> */}
                {child2}
            </div>
        </Split>;
    }
}

export default NoobSplitter;