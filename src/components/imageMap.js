import React from 'react';
import ImageMapper from './imageMapperLib';
import './imageMap.css';

const MAP ={
    name: "myMap",
    areas: [
        {name: "Room 1", shape: "circle", coords: [170, 20, 15 ], preFillColor: "red"},
        {name: "Room 2", shape: "circle", coords: [400, 120, 15 ], preFillColor: "#ffcf0c"},
        {name: "Room 3", shape: "circle", coords: [70, 200, 15 ], preFillColor: "green"},
    ]
};



export default class ImageMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hoveredArea: null
        }
    }

    enterArea(area) {
        console.log('enterArea', area)
		this.setState({
			hoveredArea: area,
		});
	}
    
    leaveArea(area) {
		this.setState({
			hoveredArea: null,
		});
    }

    getTipPosition(area) {
        // if (!area) {
        //     return {top: '170px', left: '100px'};
        // }
        console.log('[getTipPosition]', area.center[1], area.center[0]);
		return { top: `${area.center[1]}px`, left: `${area.center[0]}px` };
	}
    
    render() {
        return <div style={{ position: "relative" }}>
            <ImageMapper src="http://1.bp.blogspot.com/-IiQzSfQwqys/UMc798CtfzI/AAAAAAAAAG0/IQCyIR2eZeU/s1600/layout.gif"
                map={MAP}
                onMouseEnter={area => this.enterArea(area)}
                onMouseLeave={area => this.leaveArea(area)}
                // onClick={area => this.clickArea(area)}
        >
        </ImageMapper>
        {this.state.hoveredArea && (
            <span className="imageMapToolTip" style={{ ...this.getTipPosition(this.state.hoveredArea) }}>
                {this.state.hoveredArea.name}                
            </span>
        )}
        </div>
    }
}
