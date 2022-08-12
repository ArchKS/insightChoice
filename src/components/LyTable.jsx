import React, { useEffect } from 'react'
import { Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setIndex } from '../store/features/setRowIndex';
import { setStyleToTableColumn } from '../utils/tool';


const TableHeight = 500;

const LyTableComponent = () => {
    const dispatch = useDispatch();
    const { ActiveTable } = useSelector((store) => store.setTable);

    const onSelectChange = (newSelectedRowKeys) => {
        dispatch(setIndex(newSelectedRowKeys));
    };

    const rowSelection = {
        selectedRowKeys: useSelector((store) => store.setRowIndex).selectIndex,
        onChange: onSelectChange,
    };

    useEffect(() => {
        setStyleToTableColumn()
    })
    return (
        <Table
            rowSelection={rowSelection}
            columns={ActiveTable.columns}
            dataSource={ActiveTable.dataSource}
            scroll={{ x: 'max-content' ,y: TableHeight}}
            pagination={false}
            className="antd_table"
        />
    )
}

export default LyTableComponent;