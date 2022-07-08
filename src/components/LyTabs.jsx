import { useSelector, useDispatch } from 'react-redux';
import React, { useRef, useState, useEffect } from 'react';
import { Divider, Radio, Table, Tabs, Button, message, Space } from 'antd';
const { TabPane } = Tabs;

import { getColAndDataFromJson, getFirstJsonFromSheet } from '../utils/dataTypeConvert';
import { sleep } from "../utils/utils"
import { iTabPlane, iTabRecv } from '../type'
import { addTable, removeTable, changeTable } from '../store/features/setTables';
import { setIndex } from '../store/features/setRowIndex';

let Panes: iTabPlane = [
  {
    key: '招商银行Data.xlsx',
    title: `招商银行Data.xlsx`,
  }
]



const LyTabsComponent = (props: any) => {
  const [activeKey, setActiveKey] = useState(null);
  const [panes, setPanes] = useState([]);
  const newTabIndex = useRef(0);
  const newActiveKey = useRef(null);
  const inputEl = useRef(null);
  const dispatch = useDispatch();
  const { AppTables } = useSelector((store) => store.setTable);
  let _staticPanes = [];

  // Tab改变的时候，设置active的下标
  const onChange = (key) => {
    dispatch(changeTable(key));
    dispatch(setIndex([]));
    setActiveKey(key);
  };

  // 点击新增tab
  const addPanes = (fileName: string, cx: any, dx: any) => {
    _staticPanes = [...panes, { key: fileName, title: fileName }];
    setPanes(_staticPanes); // 拿不到最新的panes 
    setActiveKey(newActiveKey);
  };

  useEffect(() => {
    _staticPanes = panes;
  }, [panes])

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
      inputEl.current.click(); // => uploadSheet
    } else {
      remove(targetKey);
      dispatch(removeTable(targetKey)); // 利润表_600036.xls
    }
  };

  // 从input文件中获取数据并解析，传到tab控件中
  const uploadSheet = (e) => {
    let files = inputEl.current.files;
    let keys = Object.keys(files);
    (async (keys) => {
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let file = files[key];
        let fileName = file.name;
        // 去重
        let isuniq = AppTables.every(table => table.fileName !== fileName);
        if (isuniq) {
          let json = await getFirstJsonFromSheet(file);
          let [c, d] = getColAndDataFromJson(json);
          addPanes(fileName, c, d); // 添加到TabPanes 
          dispatch(addTable({       // 添加到AppTables
            fileName: fileName,
            columns: c,
            dataSource: d,
          }));
        } else {
          message.warning(`${fileName} has exists`);
        }
      }
    }
    )(keys);
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
            <TabPane tab={pane.title} key={pane.key}></TabPane>
          ))}
        </Tabs>
      </div>
      <div className="input_wrapper">
        <input type="file" name="sheets" id="sheets" multiple ref={inputEl} onChange={uploadSheet} />
      </div>
    </div>
  );
};

export default LyTabsComponent;