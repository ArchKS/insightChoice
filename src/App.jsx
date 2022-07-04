import React, { useState, useRef } from "react";
import Sidebar from './components/Sidebar/sidebar';
import LyTabsComponent from './components/LyTabs/tab';
import LyTableComponent from './components/LyTable/LyTable';
import { datas, columns, defaultOptions } from './utils/dataTypeConvert'
import { useSelector, useDispatch } from 'react-redux';
import ReactECharts from "echarts-for-react";
import { Button, message, Space, Divider } from 'antd';
import { setIndex } from './store/features/setRowIndex'
import { resetOption, clearOption } from './store/features/setOption'

function App() {
  const dispatch = useDispatch();
  let { option } = useSelector(store => store.setOption);

  const clearOptions = () => {
    // 重置选中的tableRowKey和echartsOptions内容
    dispatch(clearOption());
    dispatch(setIndex([]));
    message.success(`重置成功`, 1)
  }

  const drawMultiSelect = () => {
    // 同一张表，绘制不同的选项
  }

  const drawMultiTable = () => {
    // 不同的表，绘制同一张选项
  }

  return (
    <div className="App">
      <div className="left_wrapper">
        <Sidebar></Sidebar>
      </div>
      <div className="right_wrapper">
        <div className="top">
          <div className="tab">
            <LyTabsComponent ></LyTabsComponent>
          </div>
          <div className="table">
            <LyTableComponent></LyTableComponent>
          </div>
          <div className="settings">


            <Button type="primary" className="draw_button" onClick={clearOptions}>重置图表</Button>
            <Button type="primary" className="draw_button"  onClick={drawMultiSelect}>同表多项</Button>
            <Button type="primary" className="draw_button"  onClick={drawMultiTable}>异表同项</Button>
            <span className="draw_button">&nbsp;| &nbsp;</span>
            <Button type="primary" className="draw_button"  onClick={drawMultiTable}>饼图</Button>
            <span className="draw_button">&nbsp;| &nbsp;</span>
            <Button type="primary" className="draw_button"  onClick={drawMultiTable}>资产堆积图</Button>
            <Button type="primary" className="draw_button"  onClick={drawMultiTable}>现金流量图</Button>
            <Button type="primary" className="draw_button"  onClick={drawMultiTable}>费用构成</Button>
          </div>
        </div>
        <div className="bottom">

          <ReactECharts
            option={option}
            theme={"vintage"}
            noMerge={true}
            lazyUpdate={false}
            style={{ height: "500px" }}
          ></ReactECharts>
        </div>
      </div>
    </div>
  );
}
export default App;

