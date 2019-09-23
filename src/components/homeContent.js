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

class HomeContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuMode: this.getInitialMenuMode(),
            currLeftPercent: 10.0
        }
        window.addEventListener('resize', this.onWindowResize);
    }

    onWindowResize = () => {
        console.log('onWindowResize', this);
        // let leftPixels = this.state
        // this.setState({
        //     menuMode: this.getMode(leftPixels)
        // });
    }

    computeInitialPixels = () => {return 10 / 100.0 * window.innerWidth};

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
        this.setState({
            menuMode: mode
        });
    }

    render() {
        console.log('render homeContent');
        return <NoobSplitter 
            id="homePanel" 
            defaultSize={[10, 90]} 
            onDragEnd={this.onSplitDragEnd}
            minSize={100}>
            <VerticalList items={items} activeItem={'dashboard'} mode={this.state.menuMode}/>
        </NoobSplitter>    
    }
}

export default HomeContent;