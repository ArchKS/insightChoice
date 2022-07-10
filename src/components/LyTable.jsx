import React from 'react'
import { Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setIndex } from '../store/features/setRowIndex';

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

    // 给:结尾的，和 合计 类目的添加单独的色号
    // let tbContent = document.querySelectorAll(".ant-table-cell-content");
    // tbContent.forEach(el=>{
    //     let txt = el.innerText.trim();
    //     if(/:$/.test(txt)){
    //         el.classList.add("row_item_content_by_self");
    //         let f = el.parentElement.parentElement;
    //         if(f){
    //             f.classList.add('row_content_by_self')
    //         }
    //     }else if(SUMMARYAARRAY.indexOf(txt) >= 0){
    //         console.log(txt);
    //         let f = el.parentElement.parentElement;
    //         if(f){
    //             f.classList.add('summary_content_by_self')
    //         }
    //     }
    // })

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