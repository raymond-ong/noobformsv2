import React from 'react';
import './trialPage.css';
import {PieWithData} from '../charts/pieChart';
import { render } from 'react-dom';
import crossfilter from 'crossfilter2';
import Form, {Text as FormText, FormCheckbox, Dropdown as FormDropDown, FormTreeDropDown, FormRadio} from '../form/Form';
import { Button } from 'semantic-ui-react';

const dataPie = [
    { name: 'Good', value: 400 },
    { name: 'Bad', value: 300 },
    { name: 'Fair', value: 300 },
    { name: 'Uncertain', value: 200 },
  ];

const dummyVendorModels = {
    'Apple': ['iMac', 'iPhone', 'Macbook', 'iPad'],
    'Samsung': ['Galaxy S', 'Galaxy Note', 'Galaxy Tab'],
    'Huawei': ['P30', 'Mate30',]
}

const itemConds = ['brand new', 'used']

const generateApiData = () => {
    let retlist = [];
    for (let prop in dummyVendorModels) {
        let currVendor = dummyVendorModels[prop];
        for (let i = 0; i < currVendor.length; i++) {
            let currModel = currVendor[i];
            for (let n = 0; n < 10; n++) {
                retlist.push({
                    deviceId: `${prop}-${currModel}-${n}`,
                    vendor: prop,
                    model: currModel,
                    itemCond: itemConds[n % itemConds.length]
                });        
            }
        }
    }

    return retlist;
}

const groupData1 = (data) => {
    let cfData = crossfilter(data);
    let dimVendor = cfData.dimension( d => d.vendor);
    let grpVendors = dimVendor.group().reduceCount().all();
    
    return grpVendors.map(x => {
        return {
            name: x.key,
            value: x.value
        }
    })
}

const groupData2 = (data) => {
    // Group by vendor, then model
    let cfData = crossfilter(data);
    let dimVendorModel = cfData.dimension( d => {
        return JSON.stringify({
            vendor: d.vendor,
            model: d.model
        });
    });
    let grpVendorModels = dimVendorModel.group().reduceCount().all();
    
    return grpVendorModels.map(x => {
        return {
            name: x.key,
            value: x.value
        }
    })
}

const groupData = (data, dimensions) => {
    
}

const metaDimHier = [
    {
        key: 'vendor',
        value: 'vendor',
        title: 'Vendor',
        children: [{
            key: 'model',
            value: 'model',
            title: 'Model',    
        }],        
    }
]

class TrialPage extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            data: generateApiData(),
            pageFilters: [],
        }
    }

    renderPageFilters = () => {
        return <div className="trialPageFilters">
            <div><b>Page filters:</b></div>
            {/* {this.state.pageFilters.map()} */}
            <Button size='mini' primary type="button">Clear Filters</Button>
        </div>
    }

    renderPieChart = () => {
        // [1] Group the data 
        let groupedData = groupData2(this.state.data);
    
        return <div className="trialPieContainer">
            <Form>
                <FormTreeDropDown
                    name={"trialPieDropdown"}
                    treeData={metaDimHier} 
                    isRequired={false}
                    label={"Select Level"}   
                    defaultValue={['vendor']}
                />
            </Form>
            <PieWithData data={groupedData}/>
        </div>
    }

    renderTable = () => {
        return <div>Table</div>
    }

    render() {
        return <div className="trialPageContainer">
            {this.renderPageFilters()}
            <div className="trialPageCharts">
            {this.renderPieChart()}
            {this.renderTable()}
            </div>
        </div>
    }
}

export default TrialPage;

