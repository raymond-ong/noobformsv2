import React from 'react';
import ImageMapper from './imageMapperLib';
import './imageMap.css';
import noobControlHoc from '../hoc/noobControlsHoc';
import {getAprBaseUrl} from '../api/masterData';

// Should use different names if there are more than 1 instance of maps in the web page
// Otherwise the mouse pointer will have conflicts
// The coordinates are against the orig image dimension because imgWidth is specified
const MAP ={
    name: "myMap",
    areas: [
        {name: "Room 1", shape: "circle", coords: [170, 20, 15 ], preFillColor: "blue"},
        {name: "Room 2", shape: "circle", coords: [400, 120, 15 ], preFillColor: "#ffcf0c"},
        {name: "Room 3", shape: "circle", coords: [70, 100, 15 ], preFillColor: "green"},
    ]
};

const MAP2 ={
    name: "myMap2",
    areas: [
        {name: "Room A", shape: "circle", coords: [140, 20, 15 ], preFillColor: "red"},
        {name: "Room B", shape: "circle", coords: [200, 150, 15 ], preFillColor: "#ffcf0c"},
        {name: "Room C", shape: "circle", coords: [90, 120, 15 ], preFillColor: "magenta"},
        {name: "Room D", shape: "circle", coords: [40, 180, 15 ], preFillColor: "cyan"},
        {name: "Room E", shape: "circle", coords: [390, 25, 15 ], preFillColor: "orange"},
        {name: "Room F", shape: "circle", coords: [380, 190, 15 ], preFillColor: "maroon"},
    ]
};

const DEFAULT_IMG = 'layout.gif'; // This image can be accessed from http://localhost:3000/layout.gif, and deployed inside the public folder of this React App

class ImageMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageLoaded: false,
            scaledImgW: null,
            scaledImgH: null,
            hoveredArea: null
        }
        this.imageLoadHandler = this.imageLoadHandler.bind(this);
    }

    imageLoadHandler(e) {

        let origImgW = e.srcElement.width;
        let origImgH = e.srcElement.height;
        if (!!this.props.maxWidth) {
            
            this.setState({
                imageLoaded: true,
                origImgW,
                origImgH
            });    
        }
        else {
            this.setState({
                imageLoaded: true,
                origImgW,
                origImgH
            });    
        }
    }

    componentDidMount() {
        var img = new Image();
        img.onload = this.imageLoadHandler;
        img.src = this.getImageUrl();
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
    
    computeWidthHeight(origImgW, origImgH, maxWidthPx) {
        if (!!maxWidthPx) {
            let propsMaxWidth = parseFloat(maxWidthPx) - 5;
            let scaledImageH = propsMaxWidth / origImgW * origImgH;
            return {
                w: propsMaxWidth,
                h: scaledImageH
            }
        }
        else {
            return {
                w: origImgW,
                h: origImgH
            }
        }
    }

    getImageUrl() {
        return this.props.data && this.props.data.imageProps && this.props.data.imageProps.image ? 
                    `${getAprBaseUrl()}/files/${this.props.data.imageProps.image}` 
                    : DEFAULT_IMG;
    }

    getMapToUse() {
        if (this.props.data && this.props.data.imageProps && this.props.data.imageProps.image) {
            return this.props.data && this.props.data.imageProps && this.props.data.imageProps.map;
        }

        return this.props.useOther ? MAP2 : MAP;
    }

    getTooltip(areaName) {
        // debugger
        if (!this.props.apiData || !this.props.apiData.data) {
            return areaName;
        }
        
        let findApiData = this.props.apiData.data.find(a => a.name === areaName);
        if (!findApiData) {
            return areaName;
        }

        let tipStr = '';
        for (var prop in findApiData) {
            if (prop === "name") {
                tipStr += areaName;
            }
            else {
                tipStr += `, ${prop}: ${findApiData[prop]}`;
            }
        }
        
        return tipStr;
    }
    
    render() {
        let imageUrl = this.getImageUrl();
        let mapToUse = this.getMapToUse();

        if (!this.state.imageLoaded) {
            return <div>Loading Image...</div>;
        }
        let classNames = this.props.selected === true ? 'ctrl-selected' : '';
        var computedSize = this.computeWidthHeight(this.state.origImgW, this.state.origImgH, this.props.maxWidth);
        console.log("[ImageMap] Computed W, H: ", computedSize, "max Width: ", this.props.maxWidth);

        return <div style={{ position: "relative" }} className={classNames}>
            <ImageMapper src={imageUrl}
                map={mapToUse}
                onMouseEnter={area => this.enterArea(area)}
                onMouseLeave={area => this.leaveArea(area)}
                width={computedSize.w} // get it from the container width
                height={computedSize.h} // calculate based on the image aspect ratio
                imgWidth={this.state.origImgW}
                // onClick={area => this.clickArea(area)}
        >
        </ImageMapper>
        {this.state.hoveredArea && (
            <span className="imageMapToolTip" style={{ ...this.getTipPosition(this.state.hoveredArea) }}>
                {/* {this.state.hoveredArea.name} */}
                {this.getTooltip(this.state.hoveredArea.name)}
            </span>
        )}
        </div>
    }
}

export default noobControlHoc(ImageMap);

// Properties Panel Portion
const configBtnOnClick = () => {

    console.log('configBtnOnClick');
}
export const imageMapProps = [
    {
      name: 'imageProps', 
      propType: 'popupConfig',
      buttonName: 'Configure Image...',
      btnOnclick: configBtnOnClick
    },
    {
        name: 'dataProps', 
        propType: 'section',
    },
    {
        name: 'datasetId', 
        propType: 'number',
        toolTip: 'Put the same datasetId for all controls that are linked. When a filter is applied in one control, other linked controls will also be filtered.'
    },
    {
        name: 'requestType', 
        propType: 'metadata',
        metadataField: 'requestTypes',
        metadataPropType: 'dropdown'
    },
    {
        name: 'columns', 
        propType: 'metadata',
        metadataField: 'dimensions',
        metadataPropType: 'treeDropdown',
        multiple: true,
      },
  
];
