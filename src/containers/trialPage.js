import React from 'react';
import './trialPage.css';
import {PieWithData} from '../charts/pieChart';
import {BarChartWithData} from '../charts/barChart';
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

const dummyBarchartData = [
    {'Brand new': 50, 'Used': 30, vendor: 'Apple'},
    {'Brand new': 40, 'Used': 20, vendor: 'Samsung'},
    {'Brand new': 20, 'Used': 10, vendor: 'Huawei'},
]

const itemConds = ['Brand new', 'Used']

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

const groupData = (cfDataIn, groupingsList) => {
    let cfData = cfDataIn;
    let dimGrouping = cfData.dimension( d => {
        let pickedData = filterObj(d, groupingsList);
        return JSON.stringify(pickedData);
    });

    let dimFiltering = cfData.dimension( d => {
        let pickedData = filterObj(d, groupingsList);
        return JSON.stringify(pickedData);
    });

    let filterAppleIphone = {
        vendor: "Apple",
        //model: "iPhone"
    };
    //dimFiltering.filter(JSON.stringify(filterAppleIphone));
    //let grpVendorModels = dimVendorModel.group().reduceCount().all();
    let grpVendorModels = dimGrouping.group().reduceCount().all();
    
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

const formatBarchartData = (groupedData, primaryAxis, secondaryGroup) => {
    let retList = [];
    for (let i = 0; i < groupedData.length; i++) {
        let currGroupedData = groupedData[i];
        let jsonStrObj = JSON.parse(currGroupedData.name);
        let primAxisVal = jsonStrObj[primaryAxis];
        let secondaryName = jsonStrObj[secondaryGroup];
        let secondaryVal = currGroupedData.value;

        let findItem = retList.find(x => x[primaryAxis] === primAxisVal);
        if (!findItem) {
            findItem = {
                [primaryAxis]: primAxisVal
            }
            retList.push(findItem);
        }
        findItem[`${secondaryName}`] = secondaryVal;
    }

    return retList;
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
            cfData: crossfilter(generateApiData()),
            data: generateApiData(),
            pageFilters: [],
            //overallGroupings: [defaultGrouping], // The grouping set in the tree drop down
            groupingBoundVal: defaultGrouping, // For the Pie chart
        }

        this.onGroupSelect = this.onGroupSelect.bind(this);
    }

    renderPageFilters = () => {
        return <div className="trialPageFilters">
            <div><b>Page filters:</b></div>
            {/* {this.state.pageFilters.map()} */}
            {this.state.pageFilters.map(filter => <div>{JSON.stringify(filter)}</div>)}
            <Button size='mini' primary type="button">Clear Filters</Button>
        </div>
    }

    pieClickHandler = (pieWedgeInfo) => {
        let filterObj = JSON.parse(pieWedgeInfo.name);
        console.log('pieClickHandler', pieWedgeInfo, filterObj);
        this.setState({
            pageFilters: [filterObj]
        });
    }

    onGroupSelect = (value) => {
        this.setState({
            groupingBoundVal: value
        })
    }

    getGroupings = () => {
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
        let groupedData = groupData(this.state.cfData, groupings);
    
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
        let dimensions = ['deviceId', 'vendor', 'model', 'itemCond']; // configed by user
        let data = this.state.cfData.allFiltered();
        
        return <div>
            <b>Num Records: {data.length}</b>
            <table className="trialTable">
            <thead>
                {dimensions.map(d => <th>{d}</th>)}
            </thead>
            <tbody>
                {data.map((d) => { return <tr>
                    {
                        Object.keys(d).map(k => <td>{d[k]}</td>)
                    }
                    </tr>})
                }
            </tbody>
        </table>
        </div>
    }

    renderBarchart = () => {        
        let data = dummyBarchartData;
        let primaryAxis = 'vendor';
        let secondaryGroup = 'itemCond';
        let groupedData = groupData(this.state.cfData, [primaryAxis,secondaryGroup]);
        let formattedGroupData = formatBarchartData(groupedData, primaryAxis, secondaryGroup);
        let secondaryKeyVals = groupedData.map(grpData => {
            let nameJson = grpData.name;
            let keyObj = JSON.parse(nameJson);
            return keyObj[secondaryGroup];
        });
        let uniqSecondaryVals = _.uniq(secondaryKeyVals);

        return <BarChartWithData
            data={formattedGroupData}
            primary={primaryAxis}
            secondaryList={uniqSecondaryVals}
        />
    }

    filterData = () => {
        if (!this.state.pageFilters || !this.state.pageFilters.length) {
            return;
        }

        for (let i = 0; i < this.state.pageFilters.length; i++) {
            let currFilter = this.state.pageFilters[i];
            Object.keys(currFilter).forEach(key => {
                let filterVal = currFilter[key];
                let dimFilter = this.state.cfData.dimension(d => d[key])
                dimFilter.filter(filterVal);
            })            
        }

    }

    render() {
        // Perform filtering if there is a pagefilter
        this.filterData();

        return <div className="trialPageContainer">
            {this.renderPageFilters()}
            <div className="trialPageCharts">
            {this.renderPieChart()}
            {this.renderBarchart()}
            {this.renderTable()}
            </div>
        </div>
    }
}

export default TrialPage;

