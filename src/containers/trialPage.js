import React from 'react';
import './trialPage.css';
import {PieWithData} from '../charts/pieChart';
import { render } from 'react-dom';
import crossfilter from 'crossfilter2';
import Form, {Text as FormText, FormCheckbox, Dropdown as FormDropDown, FormTreeDropDown, FormRadio} from '../form/Form';
import { Button } from 'semantic-ui-react';
import {findNodeByKey} from '../helper/treefilter';
import TreeDropdown from '../controls/treeDropdown';
import _ from "lodash";

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
    // dimVendor.filter(d => {
    //     return d !== "Apple"
    // });
    let grpVendors = dimVendor
    .filter(d => {
        return d !== "Apple"
    })
    .group().reduceCount().all();
    
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

const filterObj = (obj, fields) => {
    return _.pick(obj, fields);
}

const groupData = (data, groupingsList) => {
    let cfData = crossfilter(data);
    let dimVendorModel = cfData.dimension( d => {
        let pickedData = filterObj(d, groupingsList);
        return JSON.stringify(pickedData);
    });

    let filterAppleIphone = {
        vendor: "Apple",
        model: "iPhone"
    };
    debugger
    dimVendorModel.filter(JSON.stringify(filterAppleIphone));
    //let grpVendorModels = dimVendorModel.group().reduceCount().all();
    let grpVendorModels = dimVendorModel
                            .filter(JSON.stringify(filterAppleIphone))
                            .group().reduceCount().all();
    
    return grpVendorModels.map(x => {
        return {
            name: x.key,
            value: x.value
        }
    })
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

const getBottomMostGroup = (groupings) => {
    if (!groupings || !groupings.length) {
        return null;
    }

    // Just return the last item
    return groupings[groupings.length - 1];
}

// Just add a parent field to the existing metaDimArray
// To make it easier to get the hierarchical value
const reformatMetaDim = (metaDimArray, parent=null) => {
    if (!metaDimArray) {
        return null;
    }
    
    for(let i = 0; i < metaDimArray.length; i++) {
        let metaNode = metaDimArray[i];
        metaNode.parent = parent;
        reformatMetaDim(metaNode.children, metaNode);
    }
    
    return metaDimArray;
}

class TrialPage extends React.Component {
    
    constructor(props) {
        super(props);
        let reformattedMetaDim = reformatMetaDim(metaDimHier);
        let defaultGrouping = metaDimHier[0].key;
        this.state = {
            dimHierMaster: reformattedMetaDim,
            data: generateApiData(),
            pageFilters: [],
            //overallGroupings: [defaultGrouping], // The grouping set in the tree drop down
            groupingBoundVal: defaultGrouping
        }

        this.onGroupSelect = this.onGroupSelect.bind(this);
    }

    renderPageFilters = () => {
        return <div className="trialPageFilters">
            <div><b>Page filters:</b></div>
            {/* {this.state.pageFilters.map()} */}
            <Button size='mini' primary type="button">Clear Filters</Button>
        </div>
    }

    pieClickHandler = (pieWedgeInfo) => {
        let filterObj = JSON.parse(pieWedgeInfo.name);
        console.log('pieClickHandler', pieWedgeInfo, filterObj);
        
    }

    onGroupSelect = (value) => {
        debugger
        this.setState({
            groupingBoundVal: value
        })
    }

    getGroupings = () => {
        debugger
        let treeDropdownVal = this.state.groupingBoundVal;
        let treeNodeSel = findNodeByKey(this.state.dimHierMaster, treeDropdownVal);
        if (!treeNodeSel) {
            return [];
        }

        let retList = [treeDropdownVal];
        let currParent = treeNodeSel.item.parent;
        while (!!currParent) {
            retList.unshift(currParent.key);
            currParent = currParent.parent;
        }

        return retList;
    }

    renderPieChart = () => {
        // [1] Group the data 
        // [1A] Get the groupings from the tree dropdown first
        let groupings = this.getGroupings();
        let groupedData = groupData1(this.state.data, groupings);
    
        return <div className="trialPieContainer">
            <TreeDropdown 
                treeData={metaDimHier} 
                value={this.state.groupingBoundVal}
                onSelect={this.onGroupSelect}
                treeDefaultExpandAll
                // defaultValue={getBottomMostGroup(this.state.overallGroupings)}
            />
            <PieWithData 
                data={groupedData}
                pieClickCallback={this.pieClickHandler}/>
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

