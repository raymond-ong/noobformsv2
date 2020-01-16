import React from 'react';

// Project imports
import Navbar from '../src/components/navbar';
import MainContent from './containers/mainContent';
import "../src/styles/App.css";
//import masterData from './api/masterData';
import {fetchHierarchy, fetchAvailableData, fetchSavedLayouts, fetchHierarchyViews} from './actions';
import {connect} from 'react-redux';

import TouchBackend from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd'
import ShowMessage, {NotifType} from '../src/helper/notification';
import ReactNotification from 'react-notifications-component'
import ReportApp from './ReportApp';

class App extends React.Component {

    componentDidMount() {
        console.log('[App][componentDidMount] fetch master data...');
        // Fetch master data:
        // Hierarchy, layouts, saved data

        this.props.fetchHierarchy().catch( err => ShowMessage("Unable to fetch hierarchy", NotifType.danger, err.message));
        this.props.fetchAvailableData();
        this.props.fetchSavedLayouts();
        this.props.fetchHierarchyViews();
        //ConfigureToast();
        //ShowMessage("Welcome!", "Start by dragging components from the toolbox to the Designer!");
    }

    render() {
        var isTouch = ('ontouchstart' in document.documentElement);
        console.log('[App] render(), touch?', isTouch);
        console.log('URL Params', document.URL);

        if (document.URL.toLowerCase().endsWith('reporting')) {
            return <DndProvider backend={HTML5Backend}>
                <div id="reportApp">
                <ReportApp/>
                </div>
            </DndProvider>
        }
        else {
            return(<DndProvider backend={isTouch? TouchBackend : HTML5Backend}>
                <div id="app" style={{height: 'calc(100%)'}}>
                    <ReactNotification />
                    <Navbar>        
                        <MainContent/>
                    </Navbar>
                </div>
                </DndProvider>)        
        }
    }
}

//dndBackend = DragDropContext(TouchBackend);
export default connect(null, {fetchHierarchy, fetchAvailableData, fetchSavedLayouts, fetchHierarchyViews})(App);
