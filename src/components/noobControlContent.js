import React from 'react';
import './noobForm.css'
// controls
import Section from '../controls/section';
import RichText from '../controls/richtext';
import Combobox from '../controls/combo';
import Textbox from '../controls/textbox';
import Table from '../controls/table';
import ReportTable from '../controls/reportTable';
import Label from '../controls/label';
import ShowMessage, {NotifType} from '../helper/notification';
import { Popup } from 'semantic-ui-react'
import DcBar from '../charts/dcjsBarChart';


import { useDrag } from 'react-dnd'
import PieChart, {PieForReport, PieWithData, PieResponsiveData, PieResponsiveDataBase} from '../charts/pieChart';
import BarChart, {BarChartForReport, BarResponsiveData} from '../charts/barChart';
import Gauge from '../charts/gauge';
import GaugeChart from '../charts/gauge_rechart';
import GaugeJs from '../charts/gaugejs_react';
import PageBreak from '../controls/pagebreak';
import ImageMap from '../controls/imageMap';
import Datepicker from '../controls/datepicker';

// Separate the content-part into a standalone component from the control wrapper
// Reason: this will be the only part that will be resized or moved while dragging (moving or resizing)
// We don't want to include the resizer or landing pads in the drag image

export const ControlDragTypes = {
    CONTROL: 'Control'
}

// mode: either "dashboard" or "design"
export const getContentDiv = (controlData, mode) => {
    // Wrap the contents so that when resizing or moving, they will be together
    // Also this should be floated. We don't want to resize or move the parent
    let content = null;
    let isReporting = document.URL.toLowerCase().endsWith("reporting");
    switch(controlData.ctrlType) {
        case 'section':
            content = <Section {...controlData}></Section>
            break;
        case 'richtext':
            content = <RichText {...controlData}></RichText>
            break;
        case 'combo':
            content = <Combobox {...controlData}></Combobox>
            break;
        case 'textbox':
            content = <Textbox {...controlData}/>
            break;
        case 'table':
            if (isReporting) {
                content = <ReportTable {...controlData}/> 
            }
            else {
                content = <Table {...controlData}/> 
            }
            
            break;
        case 'label':
            content = <Label {...controlData}/> 
            break;
        case 'pie':
            if (isReporting) {
                //content = <PieForReport {...controlData}/>
                content = <PieForReport {...controlData}/>
            }
            else if (mode === 'dashboard') {
                content = <PieResponsiveDataBase {...controlData}/>
            }
            else {
                content = <PieResponsiveData {...controlData}/>
            }                
            break;
        case 'barchart':
            if (isReporting) {
                content = <BarChartForReport {...controlData}/>                
            }
            else {
                debugger
                content = <BarResponsiveData {...controlData}/>
            }            
            break;
        case 'gauge':
            //content = <Gauge {...controlData}/>
            //content = <GaugeChart/>
            content=<GaugeJs {...controlData}/>
            break;
        case 'pagebreak':
            // Should not come here if Reporting mode!
            // Parent form must insert page-break-before style into the next control instead
            content = <PageBreak {...controlData}/>
            break;
        case undefined:    
            content = <div className="emptyControl"></div>
            break;
        case 'dcbar':
            content = <DcBar {...controlData}/>
            break;
        case 'imageMap':
            content = <ImageMap {...controlData}/>
            break;
        case 'date':
            content = <Datepicker {...controlData}/>
            break;
        default:
            content = <div>{controlData.i}</div>
            break;
    }

    return content;
}

const handleEndDrag = (item, monitor) => {
    if (monitor.didDrop()) {
        return;
    }

    ShowMessage('Control was not moved', 
    NotifType.info, 
    'Please drop the control into an empty cell, or make sure there is sufficient space for larger controls.')
}


// TODO: Need to inform upper level classes that this control is being moved, so that landing pads will only be rendered on the control being moved
const NoobControlContent = (controlData) => {
    const [{ isDragging }, drag] = useDrag({
        item: { 
            ...controlData,
            type: ControlDragTypes.CONTROL,            
        },
        canDrag: !!controlData.ctrlType, // Do not allow empty controls to be dragged
        end: (item, monitor) => handleEndDrag(item, monitor),
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
      });

    const styles = {
        opacity: isDragging? 0 : 1,
    };
    // return <Popup
    //     trigger={<div className="contentWrapper" ref={drag} style={styles}>
    //             {getContentDiv(controlData)}
    //             </div>}
    //     content='Hide the popup on any scroll event'
    //     on='click'
    //     hideOnScroll
    // />
    return <div className="contentWrapper" ref={drag} style={styles}>
        {getContentDiv(controlData)}  
    </div>        
}

export default NoobControlContent;