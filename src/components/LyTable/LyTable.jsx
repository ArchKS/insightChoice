// @ts-nocheck
import React from 'react'
import { useState } from 'react';
import { Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getXaisxDataFromColumns, getSeriesDataFromDataSource, defaultOptions } from '../../utils/dataTypeConvert'
import { setIndex } from '../../store/features/setRowIndex';
import { resetOption, clearOption } from '../../store/features/setOption'


const LyTableComponent = (props) => {
    const tbMsg = props.tbMsg;
    const dispatch = useDispatch();
    const { ActiveTable } = useSelector((store: any) => store.setTable);

    const onSelectChange = (newSelectedRowKeys) => {
        dispatch(setIndex(newSelectedRowKeys));
        if (newSelectedRowKeys.length === 1) {
            let option = JSON.parse(JSON.stringify(defaultOptions));
            let index = newSelectedRowKeys[0];
            let singleTable = ActiveTable.dataSource[index - 1];
            let xAxisData = getXaisxDataFromColumns(ActiveTable.columns);
            let [title, data] = getSeriesDataFromDataSource(singleTable, xAxisData);

            option.xAxis.data = xAxisData;
            option.series = [{
                data: data,
                type: 'line',
                name: title,
                smooth: true,
                markPoint: {
                    data: [
                        { type: 'max' },
                        { type: 'min' },
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average' }
                    ]
                }
            }];

            dispatch(resetOption(option))
        }
    };

    const rowSelection = {
        selectedRowKeys: useSelector((store) => store.setRowIndex).selectIndex,
        onChange: onSelectChange,
    };



    return (
        <Table
            rowSelection={rowSelection}
            columns={ActiveTable.columns}
            dataSource={ActiveTable.dataSource}
            scroll={{ x: 'max-content', y: 300 }}
            pagination={false}
            className="antd_table"
        />
    )
}

export default LyTableComponent;