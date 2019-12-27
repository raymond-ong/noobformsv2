import React, { useState } from 'react';
import './common.css';
import './table.css';
import noobControlHoc from '../hoc/noobControlsHoc';
import { useTable } from 'react-table';

const statuses = ['Good', 'Bad', 'Fair', 'Uncertain']

const getData = () => {
    let retList = [];
    let nData = 20;
    for (let iArea = 0; iArea < 1; iArea++) {
        for (let i = 0; i < 5; i++) {
        retList.push({
            targetName: `FIC_${i}`, 
            fullPath: `//PLANT/AREA_${iArea}/FIC_${i}`, 
            timeInControl: statuses[i % statuses.length], 
            timeInAlarm: statuses[i % statuses.length], 
            timeMvOutOfLimits: statuses[i % statuses.length],
            subRows: undefined
        })
        }
    }
    

    return retList;
}

const renderFooterTargetNames = (info)=> {
    let total = info.rows.length;
    return 'Footer Target Names: ' + total;
}

const computeKpi = (kpiName, info) => {
    let totalTargets = info.data.length;
    let good = info.data.filter(x => x[kpiName] === 'Good').length;
    return `${good / totalTargets * 100.00}%`
}

const columns = [
    {
        Header: 'Target Info',
        Footer: 'Target Summary',    
        TestCustomProp: 'helllo',   
        width: 200, 
        columns: [{
            Header: 'Name',
            accessor: 'targetName',
            Footer: renderFooterTargetNames,
            FooterColSpan: 2,
        }, 
        {
            Header: 'Full Path',
            accessor: 'fullPath'
        }]
    },
    {
        Header: 'KPIs',
        Footer: 'KPI Summary',
        columns: [{
            Header: 'Time in Control',
            accessor: 'timeInControl',
            Footer: info => computeKpi('timeInControl', info)
        },
        {
            Header: 'Time in Alarm',
            accessor: 'timeInAlarm',
            Footer: info => computeKpi('timeInAlarm', info)
        },
        {
            Header: 'Time MV Out of Limits',
            accessor: 'timeMvOutOfLimits',
            Footer: info => computeKpi('timeMvOutOfLimits', info)
        }]
    },
]

const Table = (props) => {
    let classNames = 'noobTableContainer ';
    if (props.selected === true) {
        classNames += ' ctrl-selected'
    }

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        rows,
        prepareRow,
      } = useTable({
        columns: columns,
        data: getData(),
      });

    // console.log('table render getTableProps', getTableProps());
    // console.log('table render data', inData);
    // console.log('table render columns', inCol);
    // console.log('table render rows', rows);
    // debug
    console.log('table render footerGroups all', footerGroups);
    footerGroups.forEach(footerGroup => {
        console.log('table render footerGroup props:', footerGroup.getFooterGroupProps());
        footerGroup.headers.forEach(column => {
            console.log('table render column props:', column.getFooterProps());
        });
    })

    return <div className={classNames}>
        <table className="noobTable" {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
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
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                    </tr>
                )}
            )}
            <tr>
                <td colSpan="10000" style={{backgroundColor: 'lightblue'}}>Custom Content!</td>
            </tr>
            </tbody>
            <tfoot>
                {footerGroups.map(group => (
                <tr {...group.getFooterGroupProps()}>
                    {group.headers.map(column => (
                        <td {...column.getFooterProps()}>{column.render('Footer')}</td>                                        
                    ))}
                </tr>
                ))}
            </tfoot>
        </table>
    </div>
    }
export default noobControlHoc(Table);