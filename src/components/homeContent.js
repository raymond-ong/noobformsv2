import React, {Component} from 'react';
import Split from 'react-split';
import "../styles/Split.css";
import NoobSplitter from './noobSplitter';
import VerticalList, {MODE_SMALL, MODE_NORMAL} from './verticalList';


const items = [
    {
        name: 'dashboard',
        title: 'Dashboard',
        icon: 'chart pie'
    },
    {
        name: 'logs',
        title: 'Logs',
        icon: 'book'
    },
    {
        name: 'tasks',
        title: 'Tasks',
        icon: 'tasks'
    },
    {
        name: 'reports',
        title: 'Reports',
        icon: 'file pdf outline'
    },
]

const DEFAULT_PERCENT = 10.0;

class HomeContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuMode: this.getInitialMenuMode(),
            currLeftPercent: DEFAULT_PERCENT
        }
        window.addEventListener('resize', this.onWindowResize);
    }

    onWindowResize = () => {        
        let leftPixels = this.computeCurrentPixels(this.state.currLeftPercent);
        // console.log('onWindowResize', window.innerWidth, this.state.currLeftPercent, leftPixels, this.getMode(leftPixels));
        this.setState({
            menuMode: this.getMode(leftPixels)
        });
    }

    computeInitialPixels = () => {return this.computeCurrentPixels(DEFAULT_PERCENT)};
    computeCurrentPixels = (currPerent) => {return currPerent / 100.0 * window.innerWidth};

    getInitialMenuMode = () => {
        let leftPixels = this.computeInitialPixels();  // todo: define a const for 10
        return this.getMode(leftPixels);
    }

    getMode(leftPixels) {
        if (leftPixels < 150) {
            return MODE_SMALL;
        }
        else {
            return MODE_NORMAL;
        }
    }

    onSplitDragEnd = (sizes) => {             
        let leftPixels = sizes[0] / 100.0 * window.innerWidth;    
        let mode = this.getMode(leftPixels);    
        //console.log('onSplitDragEnd homeContent callback', sizes, leftPixels, mode);   
        // if there are differences, call setState. We minimize rerenders
        if (this.state.menuMode !== mode || this.state.currLeftPercent - sizes[0] > 0.001) {
            this.setState({
                menuMode: mode,
                currLeftPercent: sizes[0]
            });    
        }
    }

    render() {
        console.log('render homeContent');
        return <NoobSplitter 
            id="homePanel" 
            defaultSize={[DEFAULT_PERCENT, 100-DEFAULT_PERCENT]} 
            onDragEnd={this.onSplitDragEnd}
            minSize={50}>
            <VerticalList items={items} activeItem={'dashboard'} mode={this.state.menuMode}/>
        </NoobSplitter>    
    }
}

export default HomeContent;