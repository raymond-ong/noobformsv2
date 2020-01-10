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

const columns = [
    {
        Header: 'Target Info',
        Footer: 'Target Summary',    
        TestCustomProp: 'helllo',   
        // customColSpan: 4, // should be computed
        width: 200, // does not show up in getFooterGroupProps()
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

// Define a default UI for filtering
function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length;
  
    return (
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`Filter...`}
        onClick = {(e) => {
                e.stopPropagation();
            }
        }
        style={{width: '100%'}}
      />
    )
  }
  

const Table = (props) => {
    let classNames = 'noobTableContainer ';
    if (props.selected === true) {
        classNames += ' ctrl-selected'
    }
    
    const totalCols = getTotalNumColumns(columns);

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
        rows,
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
        initialState: { pageIndex: 0, pageSize: 10 },        
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
    // console.log('table render page');    

    headerGroups.forEach(headerGroup => {
        //console.log('table render headerGroup props:', headerGroup.getHeaderGroupProps());
        headerGroup.headers.forEach(column => {
            //console.log('table render column props:', column.getHeaderProps());
        });
    })

    return <div className={classNames}>
        <div className="controlLabel">{props.data.label}</div>
        <table className="noobTable" {...getTableProps()}>
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
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        {...custProp}
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
                    )
                    }
                )                
                }
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
        {pageCount > 0 && 
            // false &&
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
                    style={{ width: '80px' }}
                />
                </span>{' '}
                <select
                value={pageSize}
                onChange={e => {
                    setPageSize(Number(e.target.value))
                }}
                >
                {[50, 10, 20, 30, 40].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                    </option>
                ))}
                </select>
            </div>}
        </div>
    }
export default noobControlHoc(Table);