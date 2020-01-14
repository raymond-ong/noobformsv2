import React, { useState } from 'react';
import './common.css';
import './table.css';
import './reportTable.css';
import { useTable } from 'react-table';

const statuses = ['Good', 'Bad', 'Fair', 'Uncertain']

const getData = () => {
    let retList = [];
    let nData = 10;
    for (let iArea = 0; iArea < 10; iArea++) {
        for (let i = 0; i < nData; i++) {
        retList.push({
            targetName: `FIC_${iArea}_${i}`, 
            fullPath: `//PLANT/AREA_${iArea}/FIC_${i}`, 
            timeInControl: statuses[(i+1) % statuses.length], 
            timeInAlarm: statuses[(i+2) % statuses.length], 
            timeMvOutOfLimits: statuses[i % statuses.length],
            kpi1: statuses[i % statuses.length],
            kpi2: statuses[i % statuses.length],
            kpi3: statuses[i % statuses.length],
            kpi4: statuses[i % statuses.length],
            kpi5: statuses[i % statuses.length],
            kpi6: statuses[i % statuses.length],
            kpi7: statuses[i % statuses.length],
            kpi8: statuses[i % statuses.length],
            kpi9: statuses[i % statuses.length],
            kpi10: statuses[i % statuses.length],
            subRows: undefined
        })
        }
    }
    

    return retList;
}

const getDataFew = () => {
    let retList = [];
    let nData = 10;
    for (let iArea = 0; iArea < 1; iArea++) {
        for (let i = 0; i < nData; i++) {
        retList.push({
            targetName: `FIC_${iArea}_${i}`, 
            fullPath: `//PLANT/AREA_${iArea}/FIC_${i}`, 
            timeInControl: statuses[(i+1) % statuses.length], 
            timeInAlarm: statuses[(i+2) % statuses.length], 
            timeMvOutOfLimits: statuses[i % statuses.length],
            kpi1: statuses[i % statuses.length],
            kpi2: statuses[i % statuses.length],
            kpi3: statuses[i % statuses.length],
            kpi4: statuses[i % statuses.length],
            kpi5: statuses[i % statuses.length],
            kpi6: statuses[i % statuses.length],
            kpi7: statuses[i % statuses.length],
            kpi8: statuses[i % statuses.length],
            kpi9: statuses[i % statuses.length],
            kpi10: statuses[i % statuses.length],
            subRows: undefined
        })
        }
    }
    

    return retList;
}

const renderFooterTargetNames = (info)=> {
    let total = info.rows.length;
    return 'Footer Target Names: ' + total + ' Records';
}

const computeKpi = (kpiName, info) => {
    let totalTargets = info.data.length;
    let good = info.data.filter(x => x[kpiName] === 'Good').length;
    return `${good / totalTargets * 100.00}%`
}

const columns2Levels = [
    {
        Header: 'Target Info',
        Footer: 'Target Summary',    
        TestCustomProp: 'helllo',   
        columns: [{
            Header: 'Name',
            accessor: 'targetName',
            Footer: renderFooterTargetNames,
            FooterColSpan: 2,
        }, 
        {
            Header: 'Full Path',
            accessor: 'fullPath',
            customColSpan: 3,
        }]
    },
    {
        Header: 'KPIs',
        Footer: 'KPI Summary',
        columns: [{
            Header: 'Time in Control',
            accessor: 'timeInControl',
            Footer: info => computeKpi('timeInControl', info),
            colType: 'kpi'
        },
        {
            Header: 'Time in Alarm',
            accessor: 'timeInAlarm',
            Footer: info => computeKpi('timeInAlarm', info),
            colType: 'kpi'
        },
        {
            Header: 'Time MV Out of Limits',
            accessor: 'timeMvOutOfLimits',
            Footer: info => computeKpi('timeMvOutOfLimits', info),
            colType: 'kpi'
        },
    
        {
            Header: 'KPI 1 - Dummy KPI with a very long name',
            accessor: 'kpi1',
            Footer: info => computeKpi('kpi1', info),
            colType: 'kpi'
        },
        {
            Header: 'KPI 2 - Dummy KPI with a very long name',
            accessor: 'kpi2',
            Footer: info => computeKpi('kpi2', info),
            colType: 'kpi'
        },
        {
            Header: 'KPI 3 - Dummy KPI with a very long name',
            accessor: 'kpi3',
            Footer: info => computeKpi('kpi3', info),
            colType: 'kpi'
        },
        {
            Header: 'KPI 4 - Dummy KPI with a very long name',
            accessor: 'kpi4',
            Footer: info => computeKpi('kpi4', info),
            colType: 'kpi'
        },
        {
            Header: 'KPI 5 - Dummy KPI with a very long name',
            accessor: 'kpi5',
            Footer: info => computeKpi('kpi5', info),
            colType: 'kpi'
        },
        {
            Header: 'KPI 6 - Dummy KPI with a very long name',
            accessor: 'kpi6',
            Footer: info => computeKpi('kpi6', info),
            colType: 'kpi'
        },
        {
            Header: 'KPI 7 - Dummy KPI with a very long name',
            accessor: 'kpi7',
            Footer: info => computeKpi('kpi7', info),
            colType: 'kpi'
        },
        {
            Header: 'KPI 8 - Dummy KPI with a very long name',
            accessor: 'kpi8',
            Footer: info => computeKpi('kpi8', info),
            colType: 'kpi'
        },
        {
            Header: 'KPI 9 - Dummy KPI with a very long name',
            accessor: 'kpi9',
            Footer: info => computeKpi('kpi9', info),
            colType: 'kpi'
        },
        {
            Header: 'KPI 10 - Dummy KPI with a very long name',
            accessor: 'kpi10',
            Footer: info => computeKpi('kpi10', info),
            colType: 'kpi'
        },

        ]
    },
];

const columns2LevelsFew = [
    {
        Header: 'Target Info',
        Footer: 'Target Summary',    
        TestCustomProp: 'helllo',   
        columns: [{
            Header: 'Name',
            accessor: 'targetName',
            Footer: renderFooterTargetNames,
            FooterColSpan: 2,
        }, 
        {
            Header: 'Full Path',
            accessor: 'fullPath',
            customColSpan: 3,
        }]
    },
    {
        Header: 'KPIs',
        Footer: 'KPI Summary',
        columns: [{
            Header: 'Time in Control',
            accessor: 'timeInControl',
            Footer: info => computeKpi('timeInControl', info),
            colType: 'kpi'
        },

        ]
    },
];

const columnsSimple = [
    {
        Header: 'Name',
        accessor: 'targetName',
        Footer: renderFooterTargetNames,
        FooterColSpan: 2,
    }, 
    {
        Header: 'Full Path',
        accessor: 'fullPath',
        customColSpan: 3,
    },
    {
        Header: 'Time in Control',
        accessor: 'timeInControl',
        Footer: info => computeKpi('timeInControl', info),
        colType: 'kpi'
    },
    {
        Header: 'Time in Alarm',
        accessor: 'timeInAlarm',
        Footer: info => computeKpi('timeInAlarm', info),
        colType: 'kpi'
    },
    {
        Header: 'Time MV',
        accessor: 'timeMvOutOfLimits',
        Footer: info => computeKpi('timeMvOutOfLimits', info),
        colType: 'kpi'
    },

    {
        Header: 'KPI 1',
        accessor: 'kpi1',
        Footer: info => computeKpi('kpi1', info),
        colType: 'kpi'
    },
];

const getAdditionalCellProps = (cell) => {
    if (cell.column.colType !== 'kpi') {
        return {};
    }

    if (cell.value === 'Bad') {
        return {
            style: {
                backgroundColor: 'pink'
            }
        }    
    }
    else if (cell.value === 'Good') {
        return {
            style: {
                backgroundColor: 'lime'
            }
        }    
    }
    else if (cell.value === 'Uncertain') {
        return {
            style: {
                backgroundColor: 'lightgray'
            }
        }    
    }
    else if (cell.value === 'Fair') {
        return {
            style: {
                backgroundColor: 'gold'
            }
        }    
    }
    else {
        return {};
    }
}

const getColHeaderByAccessor = (colArray, accessor) => {
    if (!colArray) {
        return null;
    }

    for (var i = 0; i < colArray.length; i++) {
        let currCol = colArray[i];
        if (currCol.accessor === accessor) {
            return currCol;
        }

        return getColHeaderByAccessor(currCol.columns, accessor);
    }

    return null;
}

const getTotalNumColumns = (colArray) => {
    let ret = 0;
    if (!colArray) {
        return 0;
    }

    ret = colArray.reduce( (acc, curr, index, origArr) => {
        // console.log('reduce', acc, curr.Header, index, origArr);
        let ret = acc + getTotalNumColumns(curr.columns);

        if (!curr.accessor) {
            return ret;
        }
        if (!curr.customColSpan) {
            return ret + 1;
        }
        else {
            return ret + curr.customColSpan;
        }
    }, 0 )

    //console.log('reduce ret', ret);
    return ret;
}

const ReportTable = (props) => {
    let classNames = 'reportTableContainer';
   
    let columnsToUse = props.data.smallData ? columns2LevelsFew : columns2Levels;
    if (props.data.wideData) {
        columnsToUse = columns2Levels;
    }
    let dataToUse = props.data.smallData ? getDataFew() : getData();

    const totalCols = getTotalNumColumns(columnsToUse);
    const memoColumns = React.useMemo(() => columnsToUse, []);
    const memoData = React.useMemo(() => dataToUse, []);        

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({
        columns: memoColumns,
        data: memoData,
      }, 
      );

    console.log('table render page', totalCols);    

    return <div className={classNames} style={props.style}>
        <div className="controlLabel">{props.data.label}</div>
        <table className="reportTable" {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => {
                    let thisWidth = 100.0 / totalCols;// 17 = number of columns + extra columns from colspan
                    if (column.customColSpan) {
                        thisWidth = thisWidth * column.customColSpan
                    }
                    let custProp = {width: thisWidth + "%"};
                    //let colHeader = getColHeaderByAccessor(columns, )
                    return (<th 
                        {...column.getHeaderProps()}
                        {...custProp}
                    >{column.render('Header')}
                    {/* Render the columns filter UI */}
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                    </th>
                    )
                    }
                )                
                }
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map(
                (row, i) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                        return <td {...cell.getCellProps(getAdditionalCellProps(cell))} 
                        >{cell.render('Cell')}</td>
                    })}
                    </tr>
                )}
            )}
            <tr>
            <td colSpan="20" style={{backgroundColor: 'lightblue'}}>Custom Content! Found {rows.length} records!</td>
            </tr>
            </tbody>
        </table>       
        </div>
    }
export default ReportTable;