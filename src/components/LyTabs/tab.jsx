import './tab.less'
import React from 'react';
import { iTabPlane, iTabRecv } from '../../type'
import { useRef, useState, useEffect } from 'react';
import { datas, columns } from '../../utils/sheetTool'
import { Divider, Radio, Table, Tabs } from 'antd';
import { getColAndDataFromJson, getFirstJsonFromSheet } from '../../utils/sheetTool'
const { TabPane } = Tabs;

let Panes: iTabPlane = [
  {
    key: '1',
    title: `招商银行Data`,
  }
]

// 根据table的column和data，生成tab标签页的内容
const getContentTable = (column, data, rowSelection) => {
  return (
    <Table
      rowSelection={{ type: 'checkbox' }}
      columns={column}
      dataSource={data}
      scroll={{ x: 'max-content', y: 400 }}
      pagination={false}
      className="antd_table"
      rowSelection={rowSelection ? rowSelection : {}}
    />
  )
}

const LyTabs = () => {
  const [activeKey, setActiveKey] = useState(Panes[0].key);
  const [panes, setPanes] = useState(Panes);
  const newTabIndex = useRef(0);
  const inputEl = useRef(null);

  // 选中单行
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys, activeKey);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  Panes[0].content = getContentTable(columns, datas, rowSelection)
  Panes[0].c = columns;
  Panes[0].d = datas;
  console.log(Panes);

  // Tab改变的时候，设置active的下标
  const onChange = (key) => {
    setActiveKey(key);
  };

  useEffect(() => {
    console.log('useEffect: ',panes);
  }, [activeKey])

  // 点击新增tab，选中文件并上传
  const add = (fileName: string, cx: any, dx: any) => {
    // 1. 新增一个pane的obj对象
    // 2. active key 设置为新增的key
    const newActiveKey = `${fileName}`;
    const newTab = {
      key: newActiveKey,
      title: fileName,
      content: getContentTable(cx, dx, rowSelection),
      c: cx,
      d: dx,
    };
    setPanes([...panes, newTab]);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey) => {
    const targetIndex = panes.findIndex((pane) => pane.key === targetKey);
    const newPanes = panes.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
      setActiveKey(key);
    }
    setPanes(newPanes);
  }

  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      inputEl.current.click();
    } else {
      remove(targetKey);
    }
  };

  // 从input文件中获取数据并解析，传到tab控件中
  const uploadSheet = (e) => {
    let files = inputEl.current.files;
    Object.keys(files).forEach(async (v, i) => {
      let file = files[v];
      let fileName = file.name;
      let json = await getFirstJsonFromSheet(file);
      let [c, d] = getColAndDataFromJson(json);
      add(fileName, c, d);
    });

  }


  return (
    <div className='tab_wrapper'>
      <div className="tabs">
        <Tabs
          onChange={onChange}
          activeKey={activeKey}
          type="editable-card"
          onEdit={onEdit}>
          {panes.map((pane) => (
            <TabPane tab={pane.title} key={pane.key}>
              {pane.content}
            </TabPane>
          ))}
        </Tabs>
      </div>
      <div className="settings">
        <div className="graph">

        </div>
      </div>


      <div className="input_wrapper">
        <input type="file" name="sheets" id="sheets" multiple ref={inputEl} onChange={uploadSheet} />
      </div>
    </div>
  );
};

export default LyTabs;