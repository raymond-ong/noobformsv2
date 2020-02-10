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

const filterObj = (obj, fields) => {
    return _.pick(obj, fields);
}

const getDimensionObj = (cfData, groupingsList) => {
    return cfData.dimension( d => {
        let pickedData = filterObj(d, groupingsList);
        return JSON.stringify(pickedData);
    });
}

const getDimGroupCount = (dim) => {
    let groupedDimCounts = dim.group().reduceCount().all();

    return groupedDimCounts.map(x => {
        return {
            name: x.key,
            value: x.value
        }
    })
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
        let cfData = crossfilter(generateApiData());
        let defaultGrouping = metaDimHier[0].key;

        let initialPiechartDim = this.preparePieChartDim([defaultGrouping], cfData);
        let initialBarchartDim = this.prepareBarChartDim(cfData);

        this.state = {
            dimHierMaster: reformattedMetaDim,
            cfData: cfData,
            data: generateApiData(),
            pageFilters: [], // For each control ID, one filter only
            //overallGroupings: [defaultGrouping], // The grouping set in the tree drop down
            groupingBoundVal: defaultGrouping, // For the Pie chart
            controlDims: {
                pieChart: [initialPiechartDim],
                barChart: [initialBarchartDim]
            }
        }

        this.onGroupSelect = this.onGroupSelect.bind(this);
    }

    preparePieChartDim = (defaultGroupings, cfData) => {
        let dim = getDimensionObj(cfData,defaultGroupings);
        return {
            groupingInfo: JSON.stringify(defaultGroupings),
            dimension: dim
        }

        //return cfData.dimension(d => d.vendor);
    }

    prepareBarChartDim = (cfData) => {
        let primaryAxis = 'vendor';
        let secondaryGroup = 'itemCond';
        let dim = getDimensionObj(cfData,[primaryAxis, secondaryGroup]);
        return {
            groupingInfo: '', // TODO, since we haven't implemented grouping for bar chart yet
            dimension: dim
        }
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
        let currGroup = this.state.groupingBoundVal;
        let groupings = this.getGroupings(currGroup);
        let filterObj = {
            filterVal: JSON.parse(pieWedgeInfo.name),
            source: "pieChart",
            groupingInfo: JSON.stringify(groupings)
        };
        console.log('pieClickHandler', pieWedgeInfo, filterObj);
        debugger

        // Remove any existing filter from pie chart dimension before applying a new one
        // E.g. Previous filter is Vendor:Apple + Model:iPhone
        // If new filter is Vendor: Apple, remove the previous filter first
        // let treeDropdownVal = this.state.groupingBoundVal;
        // let groupStr = JSON.stringify(this.getGroupings(treeDropdownVal));
        // let otherPieDims = this.state.controlDims.pieChart.filter(d => 
        //     d.groupingInfo !== groupStr 
        //     && d.groupingInfo.length > groupStr.length);
        // otherPieDims.forEach(otherDim => {
        //     // If other dimension is lower (more complex), remove. If higher, retain.
        //     otherDim.dimension.filter(null);
        // })

        // If the same source && grouping Info, replace the existing one.
        // Else, just push new item

        // TODO (nice to have): if everything exactly same, remove it instead
        let findSameSourceAndGroupingInfoIndex = this.state.pageFilters.findIndex(f => f.source === 'pieChart' && f.groupingInfo === filterObj.groupingInfo);
        if (findSameSourceAndGroupingInfoIndex >= 0) {
            this.state.pageFilters.splice(findSameSourceAndGroupingInfoIndex, 1);
        }

        this.setState({
            pageFilters: [...this.state.pageFilters, filterObj]
        });
    }

    onGroupSelect = (value) => {
        let groupings = this.getGroupings(value);
        let groupingsStr = JSON.stringify(groupings);

        // Remove the filter from previous lower groups
        // let prevGroup = this.state.groupingBoundVal;
        // let prevGroupStr = JSON.stringify(this.getGroupings(prevGroup));
        debugger
        let lowerDims = this.state.controlDims.pieChart.filter(d => d.groupingInfo.length > groupingsStr.length);
        let removedFilters = [];
        lowerDims.forEach(lowerDim => {
            lowerDim.dimension.filter(null);
            removedFilters.push(lowerDim.groupingInfo);
        });

        this.setState({
            pageFilters: this.state.pageFilters.filter(f => !removedFilters.includes(f.groupingInfo))
        });


        // Update the dimension of the controls also....maybe we need to keep the old dimensions too in case the user switches back to the previous grouping
        // Check if this grouping is already in the state
        // If not, create a new one and push
        let findGrouping = this.state.controlDims.pieChart.find(g => g.groupingInfo === groupingsStr);

        if (!findGrouping) {
            let newPiechartDim = this.preparePieChartDim(groupings, this.state.cfData);
            this.setState({
                groupingBoundVal: value,
                controlDims: {
                    ...this.state.controlDims,
                    pieChart: [...this.state.controlDims.pieChart, newPiechartDim]
                }
            })
        }
        else {
            this.setState({
                groupingBoundVal: value,
            });
        }      
    }

    getGroupings = (treeDropdownVal) => {
        //let  = this.state.groupingBoundVal;
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

    calculateActiveIndex = (groupData, controlId, groupingsStr, pageFilters) => {
        // // I think no need to check the control ID. The groupData and groupingsStr should already be for this controlId.
        // let findIndex = groupData.findIndex(g => g.name === "groupingsStr");
        
        // if (findIndex === -1) {
        //     return null;
        // }
        // return findIndex;

        let findFilterForControl = pageFilters.find(f => f.source === controlId && f.groupingInfo === groupingsStr);
        if (!findFilterForControl) {
            return null;
        }

        let dataIndex = groupData.findIndex(data => {
            let nameStr = data.name;
            let nameObj = JSON.parse(nameStr);

            // This data must satisfy all filter props
            for (let prop in findFilterForControl.filterVal) {
                if (findFilterForControl.filterVal[prop] !== nameObj[prop]) {
                    return false;
                }
            }

            return true;
        });

        if (dataIndex >= 0) {
            return dataIndex;
        }

        return null;        
    }

    renderPieChart = () => {
        // [1] Group the data 
        // [1A] Get the groupings from the tree dropdown first
        let dimArr = this.state.controlDims.pieChart;
        let treeDropdownVal = this.state.groupingBoundVal;
        let groupings = this.getGroupings(treeDropdownVal);
        let groupingsStr = JSON.stringify(groupings);
        debugger
        let dimFind = dimArr.find(g => g.groupingInfo === groupingsStr);
        
        let groupedData = getDimGroupCount(dimFind.dimension);
        let activeIndex = this.calculateActiveIndex(groupedData, 'pieChart', groupingsStr, this.state.pageFilters);
    
        // TODO: we need to set the correct active index if there is a filter on this control and group
        // Maybe we can assume that recharts will use the groupedData index as-as.
        // If that's the case we can calculate
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
                pieClickCallback={this.pieClickHandler}
                activeIndex={activeIndex}/>
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
        //let data = dummyBarchartData;
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

        // let dimObj = this.state.controlDims.pieChart;
        // dimObj.filter('{"vendor":"Apple"}');  

        // Apply the filter on the source only
        // E.g. Pie chart applied filter
        // -> Look for the pie chart's dimension from State, then apply the filter on that only
        for (let i = 0; i < this.state.pageFilters.length; i++) {
            let currFilter = this.state.pageFilters[i];

            // a. Find the source of the filter. It will return an array of dims (one per grouping)
            let filterSource = currFilter.source;
            let filterGroupingInfo = currFilter.groupingInfo;
            let dimArr = this.state.controlDims[filterSource];   
            let dimObj = null;

            // b. Find the dim based on the current grouping
            if (filterSource === 'pieChart') {
                let currGrouping = this.state.groupingBoundVal;
                let groupingVal = this.getGroupings(currGrouping);
                let groupingValStr = JSON.stringify(groupingVal);
                if (filterGroupingInfo !== groupingValStr) {
                    // We don't perform filter if the currently selected group is not the same
                    continue;
                }

                let dimFind = dimArr.find(x => x.groupingInfo === groupingValStr);
                if (!dimFind) {
                    // Not expected to be here
                    debugger
                    continue;
                }
                dimObj = dimFind.dimension;
            }
            else {
                // Not yet implemented filter for bar chart. todo...
            }

            let currFilterVal = currFilter.filterVal;

            // c. Iterate through each of the filter and check if the data satisfies each filter
            dimObj.filter( dJsonStr => {
                let jsonObj = JSON.parse(dJsonStr);
                
                for (let prop in currFilterVal) {
                    let jsonObjVal = jsonObj[prop];
                    if (jsonObjVal !== currFilterVal[prop]) {
                        return false
                    }
                }
                return true;
            });
        }        

    }

    testFilter = () => {
        debugger
        let cfData = this.state.cfData;
        let dimPie = cfData.dimension(d => d.vendor);
        let dimBar = cfData.dimension(d => d.itemCond);

        let grpPie1 = dimPie.group().reduceCount().all();
        let grpBar1 = dimBar.group().reduceCount().all();
        let cfData1 = cfData.allFiltered();

        dimPie.filter("Apple");
        let grpPie2 = dimPie.group().reduceCount().all();
        let grpBar2 = dimBar.group().reduceCount().all();
        let cfData2 = cfData.allFiltered();
    }

    render() {
        // Perform filtering if there is a pagefilter
        //this.testFilter();
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

