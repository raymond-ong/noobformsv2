import React from 'react';
import "../styles/App.css";
import "../styles/MainContent.css";
import HomeContent from './homeContent';
import DesignerContent from './designerContent';
import SettingsContent from './settingsContent';
import {connect} from 'react-redux';
import {Tab} from 'semantic-ui-react';
import StackedPanel from './stackedPanel';

const panes = [
    {
        menuItem: 'Home',
        pane: (
        <Tab.Pane key='home' style={{height: '100%', padding: '0px'}}>
            <HomeContent/>
        </Tab.Pane>
        ),
    },
    {
        menuItem: 'Designer',
        pane: (
          <Tab.Pane key='designer' style={{height: '100%', padding: '0px'}}>
            <DesignerContent/>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Settings',
        pane: (
          <Tab.Pane key='settings' style={{height: '100%', padding: '0px'}}>
            <SettingsContent/>
          </Tab.Pane>
        ),
      },
  ]

const MainContent = (props) => {
    // Decide which content to show as active, based on selected item from NavBar (stored in the redux store)    
    console.log("render: MainContent");
    return <div id="mainContent">
        <Tab id="mainTab" panes={panes} renderActiveOnly={false} style={{height: '100%'}} activeIndex={props.mainAppState.tabIndex}/>
    </div>;
}

function mapStateToProps(state) {
    return {
        mainAppState: state.mainApp
    };
  }

//export default MainContent;
export default connect(mapStateToProps)(MainContent);