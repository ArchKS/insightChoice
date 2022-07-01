import React, { useState } from "react";
import Sidebar from './components/Sidebar/sidebar';
import LyTabs from './components/LyTabs/tab';


function App() {
  let [AppTables, setAppTables] = useState([]);
  let [ActiveTable, setActiveTable] = useState({});

  // 1. get activeTabKey
  const getActiveTabKey = (akey: string) => {
    // 从tables中取出同key的，将其值赋给actb 
    let actb = AppTables.filter((tableItem: any) => tableItem.name == akey )[0] || {};
    setActiveTable(actb);
  };


  // 2. set TablesData => add or remove
  // remove 现金流量表_600036.xls 
  const setTablesData = (action: 'add' | 'remove', sheetName: string, columns?: any, data?: any) => {

    // 根据action动作，对table列表的数据进行添加或修改
    // 修改完成之后，如果是增加，就将activeTabKey设为新添加的key，如果是删除，就将activeTabKey设为tables的第一个元素的name
    // nowShowTables
    let atb: any = {}; 
    let tbs: any = [];
    if (action === 'add') {
      atb = {
        name: sheetName,
        column: columns,
        data: data
      }
      tbs = [atb, ...AppTables];
    }
    if (action === 'remove') {
      tbs = [...AppTables.filter((tableItem:any) => tableItem.name !== sheetName)];
      atb = tbs[0] || {};
    }
    console.log(action, sheetName, tbs, atb);
    setAppTables(tbs);
    setActiveTable(atb);

  }


  return (
    <div className="App">
      <div className="left_wrapper">
        <Sidebar></Sidebar>
      </div>
      <div className="right_wrapper">
        <div className="top">
          <LyTabs setTablesData={setTablesData} getActiveTabKey={getActiveTabKey}></LyTabs>
        </div>
        <div className="bottom">
          {/* Echarts */}
        </div>
      </div>
    </div>
  );
}
export default App;

