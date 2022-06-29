import React from 'react'
import { Divider, Radio, Table } from 'antd';
import { iTableRecv } from '../../type'

export default function LyTableC(props: iTableRecv) {
    let c = props.c as any;
    let d = props.d as any;

    return (
        <Table
            rowSelection={{ type: 'checkbox' }}
            columns={c}
            dataSource={d}
        />
    )
}