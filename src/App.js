import React from 'react';

// Project imports
import Navbar from '../src/components/navbar';
import MainContent from './containers/mainContent';
import "../src/styles/App.css";
//import masterData from './api/masterData';
import {fetchHierarchy} from './actions';
import {connect} from 'react-redux';

import TouchBackend from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd'
import ShowMessage from '../src/helper/notification';
import ReactNotification from 'react-notifications-component'

class App extends React.Component {

    componentDidMount() {
        console.log('[App][componentDidMount] fetch master data...');
        // Fetch master data:
        // Hierarchy, layouts, saved data

        this.props.fetchHierarchy();
        //ConfigureToast();
        //ShowMessage("Welcome!", "Start by dragging components from the toolbox to the Designer!");
    }

    render() {
        var isTouch = ('ontouchstart' in document.documentElement);
        console.log('[App] render(), touch?', isTouch);
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

//dndBackend = DragDropContext(TouchBackend);
export default connect(null, {fetchHierarchy})(App);
