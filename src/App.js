import React from 'react';

// Project imports
import Navbar from '../src/components/navbar';
import MainContent from './containers/mainContent';
import "../src/styles/App.css";
//import masterData from './api/masterData';
import {fetchHierarchy} from './actions';
import {connect} from 'react-redux';

class App extends React.Component {

    componentDidMount() {
        console.log('[App][componentDidMount] fetch master data...');
        // Fetch master data:
        // Hierarchy, layouts, saved data

        this.props.fetchHierarchy();
        
    }

    render() {
        return(<div id="app" style={{height: 'calc(100%)'}}>
            <Navbar>        
                <MainContent/>
            </Navbar>
        </div>)
    }
}

export default connect(null, {fetchHierarchy})(App);
