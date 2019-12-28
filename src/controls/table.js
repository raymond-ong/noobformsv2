import React, { useState } from 'react';
import './common.css';
import './table.css';
import noobControlHoc from '../hoc/noobControlsHoc';
import { useTable, usePagination, useFilters, useSortBy } from 'react-table';

const statuses = ['Good', 'Bad', 'Fair', 'Uncertain']

const getData = () => {
    let retList = [];
    let nData = 20;
    for (let iArea = 0; iArea < 10; iArea++) {
        for (let i = 0; i < nData; i++) {
        retList.push({
            targetName: `FIC_${iArea}_${i}`, 
            fullPath: `//PLANT/AREA_${iArea}/FIC_${i}`, 
            timeInControl: statuses[(i+1) % statuses.length], 
            timeInAlarm: statuses[(i+2) % statuses.length], 
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
        width: 200, // does not show up in getFooterGroupProps()
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
        }]
    },
];

/*
Initially, I wanted to have a dropdown outside the table, instead of putting the filters in each column
const getHeaderNames = (cols) => {
    var retList = [];
    cols.forEach(col => {
        if (!!col.accessor && !!col.Header) {
            retList.push({
                key: col.accessor,
                value: col.Header
            });
        }

        if (!!col.columns) {
            retList = retList.concat(getHeaderNames(col.columns));
        }        
    });

    return retList;
}
*/


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

const onFilterChange = (e, f) => {
    //console.log('onFilterChange', e.currentTarget.value);

}

// Define a default UI for filtering
function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length
  
    return (
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`Search ${count} records...`}
        onClick = {(e) => {
                e.stopPropagation();
            }
        }
      />
    )
  }
  

const Table = (props) => {
    let classNames = 'noobTableContainer ';
    if (props.selected === true) {
        classNames += ' ctrl-selected'
    }

    const memoColumns = React.useMemo(() => columns, []);
    const memoData = React.useMemo(() => getData(), []);
    const filterTypes = React.useMemo(
        () => ({
          // Or, override the default text filter to use
          // "startWith"
          text: (rows, id, filterValue) => {
            return rows.filter(row => {
              const rowValue = row.values[id]
              return rowValue !== undefined
                ? String(rowValue)
                    .toLowerCase()
                    .startsWith(String(filterValue).toLowerCase())
                : true
            })
          },
        }),
        []
      );

    const defaultColumn = React.useMemo(
        () => ({
          // Let's set up our default Filter UI
          Filter: DefaultColumnFilter,
        }),
        []
      )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        //rows,
        prepareRow,
        page,

        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
      } = useTable({
        columns: memoColumns,
        data: memoData,
        defaultColumn,
        filterTypes,
        initialState: { pageIndex: 0 },        
      }, 
      useFilters,
      useSortBy,
      usePagination,
      );

    // console.log('table render getTableProps', getTableProps());
    // console.log('table render data', inData);
    // console.log('table render columns', inCol);
    // console.log('table render rows', rows);
    // Can access everything from footerGroups
    //console.log('table render footerGroups all', footerGroups);
    // Cannot access everything from footerGroup. It only includes key and colSpan
    // footerGroups.forEach(footerGroup => {
    //     console.log('table render footerGroup props:', footerGroup.getFooterGroupProps());
    //     footerGroup.headers.forEach(column => {
    //         console.log('table render column props:', column.getFooterProps());
    //     });
    // })
    console.log('table render page');

    headerGroups.forEach(headerGroup => {
        console.log('table render headerGroup props:', headerGroup.getHeaderGroupProps());
        headerGroup.headers.forEach(column => {
            console.log('table render column props:', column.getHeaderProps());
        });
    })

    return <div className={classNames}>
        <div className="controlLabel">{props.data.label}</div>
        <table className="noobTable" {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <th 
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                    >{column.render('Header')}
                    {/* Add a sort direction indicator */}
                    <span>
                        {column.isSorted
                        ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                        : ''}
                    </span>
                    {/* Render the columns filter UI */}
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                    </th>
                ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {page.map(
                (row, i) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                        return <td {...cell.getCellProps(getAdditionalCellProps(cell))}>{cell.render('Cell')}</td>
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
        {/* for the paginator...maybe separate into its own function */}
        <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
            </button>{' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
            </button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
            </button>{' '}
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
            </button>{' '}
            <span>
            Page{' '}
            <strong>
            {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
            </span>
            <span>
            &nbsp;
            &nbsp;
            Go to page:{' '}
            &nbsp;
            <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
                }}
                style={{ width: '100px' }}
            />
            </span>{' '}
            <select
            value={pageSize}
            onChange={e => {
                setPageSize(Number(e.target.value))
            }}
            >
            {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                Show {pageSize}
                </option>
            ))}
            </select>
        </div>
        </div>
    }
export default noobControlHoc(Table);