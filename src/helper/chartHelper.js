import _ from "lodash";

export const extractName = (groupingArr, data) => {
    let vals = groupingArr.map(g => data[g]);
    return vals.join(' / ');
}

export const filterObj = (obj, fields) => {
    return _.pick(obj, fields);
} 