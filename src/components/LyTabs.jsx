// @ts-nocheck
import { useSelector, useDispatch } from 'react-redux';
import * as React from 'react';
import { Tabs, message } from 'antd';
import { getColAndDataFromJson, getFirstJsonFromSheet } from '../utils/dataConvert';
import { addTable, removeTable, changeTable } from '../store/features/setTables';
import { setIndex } from '../store/features/setRowIndex';
// import { doSetPane } from '../store/features/setPane';

const { TabPane } = Tabs;


const LyTabsComponent = () => {
  const dispatch = useDispatch();

  const [activeKey, setActiveKey] = React.useState(null);
  const [panes,setPanes] = React.useState([]);

  const newActiveKey = React.useRef(null);
  const inputEl = React.useRef(null);

  const { AppTables } = useSelector((store) => store.setTable);
  // const { panes } = useSelector((store) => store.setPane);

  // Tab改变的时候，设置active的下标
  const onChange = (key) => {
    dispatch(changeTable(key));
    dispatch(setIndex([]));
    setActiveKey(key);
  };

  const remove = (targetKey) => {
    const targetIndex = panes.findIndex((pane) => pane.key === targetKey);
    const newPanes = panes.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
      setActiveKey(key);
    }
    // dispatch(doSetPane(newPanes));
    setPanes(newPanes)
  }

  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      inputEl.current.click(); // => uploadSheet
    } else {
      remove(targetKey);
      dispatch(removeTable(targetKey));
    }
  };

  // 从input文件中获取数据并解析，传到tab控件中
  const uploadSheet = async (e) => {
    let files = inputEl.current.files;
    let keys = Object.keys(files);
    let panesArr = [];
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let file = files[key];
      let fileName = file.name;
      let isuniq = AppTables.every((table) => table.fileName !== fileName);
      if (isuniq) {
        let json = await getFirstJsonFromSheet(file);
        let [c, d] = getColAndDataFromJson(json);
        panesArr.push({ key: fileName, title: fileName })
        dispatch(addTable({ fileName: fileName, columns: c, dataSource: d }));
        setActiveKey(newActiveKey);
      } else {
        message.warning(`${fileName} has exists`);
      }
    }

    setPanes([...panes,...panesArr]);
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
      <div className="file_input_wrapper">
        <input type="file" name="sheets" id="sheets" multiple ref={inputEl} onChange={uploadSheet} />
      </div>
    </div>
  );
};

export default LyTabsComponent;