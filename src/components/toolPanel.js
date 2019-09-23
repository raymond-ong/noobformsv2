import React from 'react';
import Split from 'react-split';
import Toolbox from './toolbox';

import '../styles/Accordion.css';
import "../styles/Split.css";

import ScrollTracker from '../components/scrollTracker';

const DEFAULT_SIZES = [33.33,33.33,33.33];
const CLASS_ACCORDION = "accordionPanel";

// Basically this class contains the left hand panel that contains the toolbox and properties box

// TODOS:
// [1] Do not allow all panels to be collapsed
// [2] Implement preferred ratio

const AccordionPanel = ({title, onClickCollapseExpand, id, isCollapsed, panelContent}) => {
    //console.log('[render] AccordionPanel, id: ', id);
    let iconName = isCollapsed ? "down" : "up";

    return <div className={CLASS_ACCORDION}>        
        <div className="titleBar">
            <div className="titleBarText">{title}</div>
            <div className="collExpBtn" onClick={() => onClickCollapseExpand(id)}>
                <i className={`icon angle ${iconName}`}></i>
            </div>            
        </div>
        <div className="panelBody">
            {/* <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div> */}
            {panelContent}
        </div>
    </div>;
}

const defaultPanelData = [
    {
        title: 'Toolbox',
        id: 'toolbox',
        isCollapsed: false,
        size: 0,
    },
    {
        title: 'Properties',
        id: 'properties',
        isCollapsed: false,
        size: 0,
    },
];

class ToolPanel extends React.Component {

    constructor(props) {
        super(props);
        let initializedPanelData = this.recalculatePanelSizes(defaultPanelData);

        this.state = {
            panelsData: initializedPanelData,
            sizes: initializedPanelData.map(panel => panel.size)
        };

        this.onSplitDragEnd = this.onSplitDragEnd.bind(this);
        this.onSplitDragStart = this.onSplitDragStart.bind(this);
    }

    recalculatePanelSizes = (panelsData) => {
        let expandedPanels = panelsData.filter(panel => panel.isCollapsed === false);
        let oneSize = 100.0 / expandedPanels.length;            
        panelsData.forEach(panel => {
            if (panel.isCollapsed) {
                panel.size = 0;
            }
            else {
                panel.size = oneSize;
            }
        })

        return panelsData;
    }

    getPanelSizes = () => {
        return this.state.panelsData.map(panel => panel.size);
    };

    
    onSplitDragEnd(args) {
        console.log('[toolPanel] onSplitDrageEnd', args, this);
        // If any of the panel becomes too small, just collapse it all the way
        let clonePanelsData = [...this.state.panelsData];
        for (let i = 0; i < args.length; i++) {
            let currPanelData = clonePanelsData[i];
            if (args[i] > 8) {
                if (currPanelData.isCollapsed) {
                    currPanelData.isCollapsed = false;
                }
            }
            else if (!currPanelData.isCollapsed) {
                currPanelData.isCollapsed = true;
            }            
        }
        // let newPanelsData = this.recalculatePanelSizes(clonePanelsData);
        // console.log(newPanelsData);
        this.setState({
            panelsData: clonePanelsData,
            sizes: args
        });

        this.addRemovePanelTransition(false);
    }

    onSplitDragStart(args) {
        console.log('[toolPanel] onSplitDrageStart', args);
        this.addRemovePanelTransition(false);
    }

    addRemovePanelTransition = (bAdd) => {
        //debugger
        let panelEls = document.getElementsByClassName(CLASS_ACCORDION); 
        for (let i = 0; i < panelEls.length; i++) {
            let panelEl = panelEls[i];
            if (bAdd) {
                panelEl.style.transition = "0.5s";
            }
            else {
                panelEl.style.transition = "0s";
            }    
        }
    }

    onClickCollapseExpand = (id) => {
        //console.log('onClickCollapseExpand', id);
        this.addRemovePanelTransition(true);
        let panelDataClone = [...this.state.panelsData];
        let selectedPanelData = panelDataClone.find(panel => panel.id === id);
        if (!selectedPanelData) {
            console.error('Cannot find the panel expanded or collapsed!');
            return;
        }

        //console.log('onClickCollapseExpand, selectedPanelData: ', selectedPanelData);
        selectedPanelData.isCollapsed = !selectedPanelData.isCollapsed;

        let newPanelsData = this.recalculatePanelSizes(panelDataClone);
        this.setState({
            panelsData: newPanelsData,
            sizes: newPanelsData.map(p => p.size)
        })
    }

    getPanelContent = (panelId) => {
        switch(panelId) {
            case 'toolbox':
                return <Toolbox/>
        }

        return null;
    }

    createPanels = () => {
        return this.state.panelsData.map(panel => {
            let panelContent = this.getPanelContent(panel.id);            
            return <AccordionPanel 
                        key={panel.id}
                        id={panel.id}
                        title={panel.title}
                        isCollapsed={panel.isCollapsed}
                        onClickCollapseExpand={this.onClickCollapseExpand}
                        panelContent={panelContent}
                    >
                    </AccordionPanel>
        })
    }

    render() {
        console.log('[toolPanel] render');
        return <Split className="split"
        direction="vertical"
        sizes={this.state.sizes}
        minSize={33}
        gutterSize={5}
        snapOffset={0}
        onDragEnd={this.onSplitDragEnd}
        onDragStart={this.onSplitDragStart}
        cursor="row-resize"
        >
            {this.createPanels()}            
        </Split>
    }
}

export default ToolPanel;