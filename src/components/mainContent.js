import React from 'react';
import "../styles/App.css";
import HomeContent from './homeContent';

const MainContent = () => {
    // Decide which content to show based on selected item from NavBar
    // TODO: always show the HomeContent for now

    return <div id="mainContent">
        <HomeContent/>
    </div>;
}

export default MainContent;