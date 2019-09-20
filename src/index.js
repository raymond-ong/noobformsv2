// React imports
import React from 'react';
import ReactDOM from 'react-dom';
// Redux imports
import { createStore } from 'redux'
import { Provider } from 'react-redux'
// Project imports
import Navbar from '../src/components/navbar';
import MainContent from '../src/components/mainContent';
import "../src/styles/App.css";
import reducers from "./reducers";

const store = createStore(reducers);

const App = () => {
    return (
    <Provider store={store}>
        <div id="app" style={{height: 'calc(100%)'}}>
            <Navbar>        
                <MainContent/>
            </Navbar>
        </div>
    </Provider>
    );
}

ReactDOM.render(App(), document.getElementById('root'))