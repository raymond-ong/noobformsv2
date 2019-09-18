import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from '../src/components/navbar';
import MainContent from '../src/components/mainContent';
import "../src/styles/App.css";

const App = () => {
    return (
    <div id="app" style={{height: 'calc(100%)'}}>
        <Navbar>        
            <MainContent/>
        </Navbar>
    </div>
    );
}

ReactDOM.render(App(), document.getElementById('root'))