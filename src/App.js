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
//import { DragDropContext } from 'react-dnd';
import { DndProvider } from 'react-dnd'

class App extends React.Component {

    componentDidMount() {
        console.log('[App][componentDidMount] fetch master data...');
        // Fetch master data:
        // Hierarchy, layouts, saved data

        this.props.fetchHierarchy();
        
    }

    render() {
        console.log('[App] render()');
        return(<DndProvider backend={HTML5Backend}>
        <div id="app" style={{height: 'calc(100%)'}}>
            <Navbar>        
                <MainContent/>
            </Navbar>
        </div>
        </DndProvider>)
    }
}

//dndBackend = DragDropContext(TouchBackend);
export default connect(null, {fetchHierarchy})(App);
