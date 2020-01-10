import React from 'react';
import ReportForm from './components/reportForm';
import {connect} from 'react-redux';
import './ReportApp.css'

const ReportApp = ({layoutData, layout}) => {
    return <div className="ReportApp">
        <ReportForm 
            containerWidth={window.innerWidth}
            layoutData={layoutData}
            controls={layout}/>

        {/* <h1>Hello1</h1>
	    <h1>Hello2</h1> */}
    </div>
}

const mapStateToProps = (state) => {
    return {
        layout: state.reportApp.layout,
        layoutData: state.reportApp.layoutData,
    };
}

export default connect(mapStateToProps)(ReportApp);