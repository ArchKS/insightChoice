import React from 'react'
import { Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setIndex } from '../store/features/setRowIndex';

const TableHeight = 500;

const LyTableComponent = (props) => {
    const tbMsg = props.tbMsg;
    const dispatch = useDispatch();
    const { ActiveTable } = useSelector((store: any) => store.setTable);

    const onSelectChange = (newSelectedRowKeys) => {
        dispatch(setIndex(newSelectedRowKeys));
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
            scroll={{ x: 'max-content', y: TableHeight }}
            pagination={false}
            className="antd_table"
        />
    )
}

export default LyTableComponent;