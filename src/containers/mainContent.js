import React from 'react';
import "../styles/App.css";
import "../styles/MainContent.css";
//import HomeContent from './homeContent';
import DashboardContent from './dashboardContent';
import DesignerContent from './dashboardDesignerContent';
import FormsDesignerContent from './formsDesignerContent';
import SettingsContent from './settingsContent';
import HierarchyDesigner from './hierarchyDesigner';
import MapViewContent from './mapViewContent';
import AnalysisViewContent from './analysisViewContent';
import DownloadCenterContent from './downloadCenterContent';
import {connect} from 'react-redux';
import {Tab} from 'semantic-ui-react';
import DataDesignerContent from './dataDesignerContent';
import DataSourcesContent from './dataSourceContent';
import TrialPage from './trialPage';

const panes = [
    {
        menuItem: 'MapViewContent',
        pane: (
        <Tab.Pane key='mapView' style={{height: '100%', width: '100%', padding: '0px'}}>
            <MapViewContent/>
        </Tab.Pane>
        ),
    },
    {
      menuItem: 'AnalysisViewContent',
      pane: (
      <Tab.Pane key='analysisView' style={{height: '100%', width: '100%', padding: '0px'}}>
          <AnalysisViewContent/>
      </Tab.Pane>
      ),
  },
    {
        menuItem: 'Home',
        pane: (
        <Tab.Pane key='home' style={{height: '100%', width: '100%', padding: '0px'}}>
            {/* <HomeContent/> */}
            <DashboardContent defaultSizes={[15, 85]}/>
        </Tab.Pane>
        ),
    },
    {
      menuItem: 'DownloadCenterContent',
      pane: (
      <Tab.Pane key='downloadCenter' style={{height: '100%', width: '100%', padding: '0px'}}>
          <DownloadCenterContent/>
      </Tab.Pane>
      ),
  },
    {
        menuItem: 'formsDesigner',
        pane: (
          <Tab.Pane key='formsDesigner' style={{height: '100%', width: '100%', padding: '0px'}}>
            <FormsDesignerContent defaultSizes={[25, 75]}/>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'HierarchyDesigner',
        pane: (
          <Tab.Pane key='hierarchyDesigner' style={{height: '100%', width: '100%', padding: '0px'}}>
            <HierarchyDesigner/>
          </Tab.Pane>
        ),
      },          
      {
        menuItem: 'dataSources',
        pane: (
          <Tab.Pane key='dataSources' style={{height: '100%', width: '100%', padding: '0px'}}>
            <DataSourcesContent/>
          </Tab.Pane>
        ),
      },          
      {
        menuItem: 'dashboardDesigner',
        pane: (
          <Tab.Pane key='dashboardDesigner' style={{height: '100%', width: '100%', padding: '0px'}}>
            <DesignerContent/>
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'dataDesigner',
        pane: (
          <Tab.Pane key='dataDesigner' style={{height: '100%', width: '100%', padding: '0px'}}>
            <DataDesignerContent/>
          </Tab.Pane>
        ),
      },    
      {
        menuItem: 'trialPage',
        pane: (
          <Tab.Pane key='trialPage' style={{height: '100%', width: '100%', padding: '0px'}}>
            <TrialPage/>
          </Tab.Pane>
        ),
      },               
      {
        menuItem: 'Settings',
        pane: (
          <Tab.Pane key='settings' style={{height: '100%', width: '100%', padding: '0px'}}>
            <SettingsContent/>
          </Tab.Pane>
        ),
      },
  ]

const MainContent = (props) => {
    // Decide which content to show as active, based on selected item from NavBar (stored in the redux store)    
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