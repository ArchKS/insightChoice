import React from 'react'
import { Divider, Radio, Table } from 'antd';
import {datas,columns} from '../../utils/tool'

export default class LyTableC extends React.Component {
    render() {
        return (
            <Table
                rowSelection={{type: 'checkbox'}}
                columns={columns}
                dataSource={datas}
            />
        )
    }
}