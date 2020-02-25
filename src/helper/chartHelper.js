import _ from "lodash";

export const extractName = (groupingArr, data) => {
    let vals = groupingArr.map(g => data[g]);
    return vals.join(' / ');
}

export const filterObj = (obj, fields) => {
    return _.pick(obj, fields);
} 

// For Pie only, there is no series
export const calculateActiveIndex = (datasetFilter, data, controlId, groupingStackStr) => {
    if (!datasetFilter) {
        return null;
    }

    let controlIdFilter = datasetFilter[controlId];
    if (!controlIdFilter) {
        return null
    }
    let stackInfo = controlIdFilter[groupingStackStr];
    if (!stackInfo) {
        return null;
    }

    let sliceInfo = stackInfo.sliceInfo;

    let dataIndex = data.findIndex(d => {
        // this data must satisfy all filter criteria
        for (let prop in sliceInfo.origObj) {
            let propVal = sliceInfo.origObj[prop];
            if (d.origObj[prop] !== propVal) {
                return false;
            }
        }

        return true;
    });

    return dataIndex >= 0 ? dataIndex : null;
}

// recursively add the next elements in the groupings array as child of previous element
// For now: groupings is only 1 dimensional i.e. single array list (e.g. [Vendor->Model])
// TODO: groupings should be multidimensional i.e. array of arrays (e.g.[ [Vendor->Model], [Plant->Area->Unit], [CommType] ])
export const convertGroupingToTreeDropOptions = (groupings) => {
    if (!Array.isArray(groupings)) {
        return [];
    }

    let retList = [];
    let prevItem = null;
    groupings.forEach(grp => {
        let currItem = {
            key: grp,
            value: grp,
            title: grp,
            children: [],
            parent: prevItem,
            stackValue: prevItem ? [...prevItem.stackValue, grp]: [grp]
        };
        if (retList.length === 0 ) {
            retList.push(currItem); // push first item only
        }
        pushChildToParentArr(prevItem ? prevItem.children : null, currItem);
        prevItem = currItem;
    })

    return retList;
}

const pushChildToParentArr = (parentArray, child) => {
    if (!Array.isArray(parentArray)) {
        return;
    }

    parentArray.push(child);
}