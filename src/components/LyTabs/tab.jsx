import './tab.less'
import React from 'react';
import { iTabPlane, iTabRecv } from '../../type'
import { useRef, useState } from 'react';
import { datas, columns } from '../../utils/sheetTool'
import { Divider, Radio, Table, Tabs } from 'antd';
import { getColAndDataFromJson, getFirstJsonFromSheet } from '../../utils/sheetTool'
const { TabPane } = Tabs;

let Panes: iTabPlane = [
  {
    key: 1,
    title: `Tab1`,
    content: (
      <Table
        rowSelection={{ type: 'checkbox' }}
        columns={columns}
        dataSource={datas}
      />
    ),
  }
]

// @builtin TypeScript and JavaScript Language Features

const LyTabs = () => {
  const [activeKey, setActiveKey] = useState(Panes[0].key);
  const [panes, setPanes] = useState(Panes);
  const newTabIndex = useRef(0);
  const inputEl = useRef(null);

  const onChange = (key) => {
    setActiveKey(key);
  };



  const add = (fileName: string, c: any, d: any) => {
    // 1. 新增一个pane的obj对象
    // 2. active key 设置为新增的key
    const newActiveKey = `newTab${newTabIndex.current++}`;
    setPanes([
      ...panes, {
        key: newActiveKey,
        title: fileName,
        content: (
          <Table
            rowSelection={{ type: 'checkbox' }}
            columns={c}
            dataSource={d}
          />
        ),
      }

    ]);
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
  };

  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      inputEl.current.click();
    } else {
      remove(targetKey);
    }
  };

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
      <div className="input_wrapper">
        <input type="file" name="sheets" id="sheets" multiple ref={inputEl} onChange={uploadSheet} />
      </div>
    </div>
  );
};

export default LyTabs;