import React, { useRef } from "react";
import Sidebar from './components/Sidebar';
import LyTabsComponent from './components/LyTabs';
import LyTableComponent from './components/LyTable';
import { retDefaultOptions, getSeriesDataFromDataSource, getXaisxDataFromColumns, generateSeriesItem } from './utils/dataTypeConvert'
import { useSelector, useDispatch } from 'react-redux';
import ReactECharts from "echarts-for-react";
import { Button, message, Tooltip } from 'antd';
import { setIndex } from './store/features/setRowIndex'
import { resetOption } from './store/features/setOption'
import { ClearOutlined  } from '@ant-design/icons';

const ITEMSUFFIX = "(亿元)"

function App() {
  const dispatch = useDispatch();
  let { option } = useSelector(store => store.setOption);
  let { ActiveTable, AppTables } = useSelector(store => store.setTable);
  let { selectIndex } = useSelector(store => store.setRowIndex);
  const echartsRef = useRef(null);

  const reset = () => { // 重置图标，和changeTab的时候需要用到重置功能
    // 暴力重置法，不这样清不干净
    echartsRef.current.getEchartsInstance().clear();
    dispatch(resetOption({}));
    dispatch(setIndex([]));
  }

  const clearOptions = () => {
    reset();
    message.success(`重置成功`, 1)
  }

  // 根据选中的下标，获取ActiveTable的数据，返回EchartsOption
  const genMultiOption = () => {
    let option = retDefaultOptions();
    // 同一张表，绘制不同的选项
    let xAxis = getXaisxDataFromColumns(ActiveTable.columns);
    option.xAxis.data = xAxis;

    // 根据选中的下标，获取Active表的数据
    option.series = [];
    for (let index of selectIndex) {
      let [title, data] = getSeriesDataFromDataSource(ActiveTable.dataSource[index - 1], xAxis);
      let seriesDataObj = generateSeriesItem(data, title);
      option.series.push(seriesDataObj);
    }
    return option;
  }

  // 构造多选项数据
  const drawMultiSelect = () => {
    let opt = genMultiOption();
    dispatch(resetOption(opt));
  }

  // 构造堆叠多选项数据
  const stackMultiSelect = () => {
    let opt = genMultiOption();
    for (let index in opt.series) {
      opt.series[index].stack = "all";
      opt.series[index].type = "bar";
      opt.series[index].areaStyle = {};
    }
    dispatch(resetOption(opt));
  }

  // 不同的表，绘制同一张选项
  const drawMultiTable = () => { }

  const test = () => { }

  /* 构造现金流量表：经营、筹资、投资堆叠数据 */
  const drawCrashFlow = () => {
    const selectObj = {
      "筹资活动产生的现金流量净额": [],
      "经营活动产生的现金流量净额": [],
      "投资活动产生的现金流量净额": [],
    };
    let crashFlowTable = getCertainTable('现金流量表');
    if (!crashFlowTable) return;

    // 根据当前表格和想要获取的行，获取opt
    let opt = constructStackAndFixedKeyOpt(crashFlowTable, selectObj);
    dispatch(resetOption(opt));
  }

  /* 利润表的费用：销售、研发、管理、财务的堆叠数据 */
  const drawCost = () => {
    const selectObj = {
      "销售费用": [],
      "管理费用": [],
      "研发费用": [],
      "财务费用": [],
    };
    let profieTable = getCertainTable('利润表');
    if (!profieTable) return;

    // 根据当前表格和想要获取的行，获取opt
    let opt = constructStackAndFixedKeyOpt(profieTable, selectObj);
    dispatch(resetOption(opt));
  }

  const getCertainTable = (tbName) => {
    let certainTable;
    let reg = new RegExp(tbName);

    for (let Table of AppTables) {
      if (reg.test(Table.fileName)) { // 判断当前是否为利润表，如果不是则退出
        certainTable = Table;
        break;
      }
    }

    if (!certainTable) {
      message.error(`当前不存在${tbName}`, 3);
      return false;
    } else {
      return certainTable;
    }
  }

  /* 构建资产堆积图，包括货币资金、存货、无形资产、应收类资产、固定资产 */
  const drawFundStack = () => {
    /* 财务报表·资产负债表中的内容 */
    let multiSelectObj = {
      "货币资金": {}, // ["货币资金"],
      "存货": {},// ["存货"],
      "无形资产": {},// ["商誉", "无形资产"],
      "应收类资产": {}, // ["应收票据及应收账款", "其他应收款合计"],
      "固定资产": {}//["固定资产", "在建工程", "", ""]
    }

    let selectObjExpend = {
      "货币资金": [],
      "存货": [],
      "商誉": [],
      "无形资产": [],
      "应收票据及应收账款": [],
      "其他应收款合计": [],
      "固定资产": [],
      "在建工程": [],
      "工程物资": []
    }
    let balanceSheetTable = getCertainTable('资产负债表');
    if (!balanceSheetTable) return;

    // 根据当前表格和想要获取的行，获取opt
    let opt = constructStackAndFixedKeyOpt(balanceSheetTable, selectObjExpend,'line');
    let series = opt.series;
    console.log('series: ', series); // 无形资产 NaN
    for (let item of series) {
      let name = item.name.replace(ITEMSUFFIX, '').trim();
      switch (name) {
        case "货币资金": multiSelectObj["货币资金"] = item; break
        case "存货": multiSelectObj["存货"] = item; break;

        case "商誉":
        case "无形资产":
          multiSelectObj["无形资产"] = addObj(multiSelectObj["无形资产"], item);
          multiSelectObj["无形资产"].name = "无形资产";
          break;

        case "应收票据及应收账款":
        case "其他应收款合计":
          multiSelectObj["应收类资产"] = addObj(multiSelectObj["应收类资产"], item);
          multiSelectObj["应收类资产"].name = "应收类资产";
          break;

        case "固定资产":
        case "在建工程":
        case "工程物资":
          multiSelectObj["固定资产"] = addObj(multiSelectObj["固定资产"], item);
          multiSelectObj["固定资产"].name = "固定资产";
          break;
        default: break;
      }
    }

    opt.series = Object.values(multiSelectObj);
    dispatch(resetOption(opt));
  }

  const addObj = (multiObj, seriesItem) => {

    if (multiObj.hasOwnProperty("name")) {
      for (let index in seriesItem.data) {
        let v1 = seriesItem.data[index] || 0; // 避免出现 ""+""的情况
        let v2 = multiObj.data[index] || 0;
        multiObj.data[index] = Number((v1 + v2).toFixed(2));
      }
    } else {
      multiObj = seriesItem;
    }
    return multiObj;
  }


  /* 从指定表中选出指定字段，构造堆叠数据 */
  const constructStackAndFixedKeyOpt = (pointTable, selectObj,seriesType="bar") => {
    // xAxis data
    let xAxis = getXaisxDataFromColumns(pointTable.columns);
    let hasDataSelectObj = {}; // 替代selectObj，不然会出现NAN数组
    // 获取selectObj中key指定的数据
    for (let row of pointTable.dataSource) {
      let [title, data] = getSeriesDataFromDataSource(row, xAxis); // title: 财务费用(亿元)
      let fmtTitle = title.replace(ITEMSUFFIX, '');
      for (let key in selectObj) {
        if (key === fmtTitle) {
          hasDataSelectObj[key] = data;
        }
      }
    }
    // 构造echart option对象
    let opt = retDefaultOptions();
    opt.xAxis.data = xAxis;
    opt.series = [];

    for (let key in hasDataSelectObj) {
      let seriesDataObj = generateSeriesItem(hasDataSelectObj[key], key);
      seriesDataObj.stack = 'all';
      seriesDataObj.type = seriesType
      seriesDataObj.areaStyle = {};
      opt.series.push(seriesDataObj);
    }
    return opt;
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


            <Button type="primary" icon={<ClearOutlined />} className="draw_button" onClick={clearOptions}>重置图表</Button>
            <Button type="primary" className="draw_button" onClick={drawMultiSelect}>同表绘制</Button>
            <Button type="primary" className="draw_button" onClick={stackMultiSelect}>同表堆积</Button>
            <Button type="disabled" className="draw_button" onClick={test}>异表绘制</Button>

            <span className="draw_button">&nbsp;| &nbsp;</span>

            <Button type="disabled" className="draw_button" onClick={test}>饼图</Button>

            <span className="draw_button">&nbsp;| &nbsp;</span>

            <Tooltip placement="bottomLeft" title="资产负债表中的资产组成：包括货币资金、无形资产、存货、固定资产在建工程、应收类资产" arrowPointAtCenter>
              <Button type="primary" className="draw_button" onClick={drawFundStack}>资产堆积图</Button>
            </Tooltip>

            <Tooltip placement="bottomLeft" title="现金流量表中的现金活动：包括筹资、投资和经营" arrowPointAtCenter>
              <Button type="primary" className="draw_button" onClick={drawCrashFlow}>现金流量图</Button>
            </Tooltip>
            <Tooltip placement="bottomLeft" title="利润表中的各种费用：包括财务、销售、研发、管理费用" arrowPointAtCenter>
              <Button type="primary" className="draw_button" onClick={drawCost}>费用构成</Button>
            </Tooltip>
          </div>
        </div>
        <div className="bottom">

          <ReactECharts
            ref={echartsRef}
            option={option}
            theme={"vintage"}
            notMerge={true}
            lazyUpdate={true}
            style={{ height: "500px" }}
          ></ReactECharts>
        </div>
      </div>
    </div>
  );
}
export default App;

