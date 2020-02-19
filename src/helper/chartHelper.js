import _ from "lodash";

export const extractName = (groupingArr, data) => {
    let vals = groupingArr.map(g => data[g]);
    return vals.join(' / ');
}

export const filterObj = (obj, fields) => {
    return _.pick(obj, fields);
} 

export const calculateActiveIndex = (datasetFilter, data, controlId) => {
    if (!datasetFilter) {
        return null;
    }

    debugger
    let controlIdFilter = datasetFilter[controlId];
    if (!controlIdFilter) {
        return null;
    }

    let dataIndex = data.findIndex(d => {
        // this data must satisfy all filter criteria
        for (let prop in controlIdFilter.origObj) {
            let propVal = controlIdFilter.origObj[prop];
            if (d.origObj[prop] !== propVal) {
                return false;
            }
        }

        return true;
    });

    return dataIndex >= 0 ? dataIndex : null;
}