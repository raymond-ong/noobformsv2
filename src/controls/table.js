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

const columns = [
    {
        Header: 'Target Info',
        columns: [{
            Header: 'Name',
            accessor: 'targetName'
        }, 
        {
            Header: 'Full Path',
            accessor: 'fullPath'
        }]
    },
    {
        Header: 'KPIs',
        columns: [{
            Header: 'Time in Control',
            accessor: 'timeInControl'
        },
        {
            Header: 'Time in Alarm',
            accessor: 'timeInAlarm'
        },
        {
            Header: 'Time MV Out of Limits',
            accessor: 'timeMvOutOfLimits'
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
            </tbody>
        </table>
    </div>
    }
export default noobControlHoc(Table);