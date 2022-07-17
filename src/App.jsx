import * as React from "react";
import { useSelector, useDispatch } from 'react-redux';
import ReactECharts from "echarts-for-react";
import { Button, message, Tooltip, Modal } from 'antd';
import { ClearOutlined } from '@ant-design/icons';

import Sidebar from './components/Sidebar';
import LyTabsComponent from './components/LyTabs';
import LyTableComponent from './components/LyTable';
import LyDraw from './components/LyDraw';

import { setIndex } from './store/features/setRowIndex'
import { resetOption } from './store/features/setOption'
import { columnNameSuffix, TABLENAME } from "./utils/Variable";
import { retDefaultOptions, getSeriesDataFromDataSource, getXaisxDataFromColumns, generateSeriesItem, convertSpecRowToOption, level1AndLevel2Combina,getChangeRateFromOpt } from './utils/dataConvert'
import { setVisible } from "./store/features/setDraw";
import { isEmpty } from "./utils/getType";




function App() {
  const dispatch = useDispatch();
  let { option } = useSelector(store => store.setOption);
  let { ActiveTable, AppTables } = useSelector(store => store.setTable);
  let { selectIndex } = useSelector(store => store.setRowIndex);
  let { visible } = useSelector(store => store.setDraw);
  const echartsRef = React.useRef(null);

  const clearOptions = () => {
    // 暴力重置法，不这样清不干净
    echartsRef.current.getEchartsInstance().clear(); // 重置图标，和changeTab的时候需要用到重置功能
    dispatch(resetOption({}));
    dispatch(setIndex([]));
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
      title = title.replace(columnNameSuffix, '')
      let seriesDataObj = generateSeriesItem(data, title);
      option.series.push(seriesDataObj);
    }
    return option;
  }

  // 构造多选项数据
  const drawMultiSelect = () => {
    if (isEmpty(ActiveTable)) {
      message.error(`当前不存在报表`);
      return;
    }
    let opt = genMultiOption();
    dispatch(resetOption(opt));
  }

  // 构造堆叠多选项数据
  const stackMultiSelect = () => {
    if (isEmpty(ActiveTable)) {
      message.error(`当前不存在报表`);
      return;
    }
    let opt = genMultiOption();
    for (let index in opt.series) {
      opt.series[index].stack = "all";
      opt.series[index].type = "bar";
      opt.series[index].areaStyle = {};
    }
    dispatch(resetOption(opt));
  }

  // 不同的表，绘制同一张选项
  // const drawMultiTable = () => { }

  const test = () => { }

  /* 构造现金流量表：经营、筹资、投资堆叠数据 */
  const drawCrashFlow = () => {
    let crashFlowTable = getCertainTable(TABLENAME.CASHFLOWTABLE.name);
    if (!crashFlowTable) return;

    // 根据当前表格和想要获取的行，获取opt
    let opt = convertSpecRowToOption(crashFlowTable, TABLENAME.CASHFLOWTABLE.rules);
    dispatch(resetOption(opt));
  }

  /* 利润表的费用：销售、研发、管理、财务的堆叠数据 */
  const drawCost = () => {
    let profieTable = getCertainTable(TABLENAME.INCOMETABLE.name);
    if (!profieTable) return;

    // 根据当前表格和想要获取的行，获取opt
    let opt = convertSpecRowToOption(profieTable, TABLENAME.INCOMETABLE.rules);
    console.log(TABLENAME.INCOMETABLE.rules);
    dispatch(resetOption(opt));
  }

  /* 构建资产堆积图，包括货币资金、存货、无形资产、应收类资产、固定资产 */
  const drawFundStack = () => {
    /* 财务报表·资产负债表中的内容 */
    let balanceSheetTable = getCertainTable(TABLENAME.BALANCETABLE.name);
    if (!balanceSheetTable) return;
    let opt = level1AndLevel2Combina(balanceSheetTable, TABLENAME.BALANCETABLE.rules)
    dispatch(resetOption(opt));
  }

  const customDraw = () => {
    // let pointTable = ActiveTable;
    if (isEmpty(ActiveTable)) {
      message.error("当前没有表单")
    } else {
      dispatch(setVisible(true));
    }
  }

  // 寻找AppTables中指定名称的表，模糊搜索，找到后返回Table
  const getCertainTable = (tbName) => {
    let certainTable;
    let reg = new RegExp(tbName);

    for (let Table of AppTables) {
      if (reg.test(Table.fileName)) {
        certainTable = Table;
        break;
      }
    }

    if (!certainTable) {
      message.error(`该功能需要${tbName},当前不存在${tbName}`, 3);
      return false;
    } else {
      return certainTable;
    }
  }

  // 绘制选中项目的饼图
  const drawPie = () => {
    // selectIndex

    if (isEmpty(ActiveTable)) {
      message.error(`当前不存在报表`);
      return;
    }

    // 1. 从选中项湖区xAxis和yAxis
    let option = genMultiOption();
    let xData = option.xAxis.data;
    let yData = option.series;

    let rawOpt = {
      series: [],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
    };

    let maxCount = 5; // 最多展示多少个饼图
    let startCount = 10;

    for (let index = xData.length - maxCount; index < xData.length; index++) {
      let year = xData[index];
      let seriesItem = {
        name: year,
        type: 'pie',
        center: [`${startCount}%`, '50%'],
        radius: window.innerWidth / maxCount / 2.8,
        data: [],
      };

      startCount += 100 / maxCount;

      for (let itemIndex in yData) {
        let name = yData[itemIndex].name;
        let value = yData[itemIndex].data[index];
        seriesItem.data.push({ name, value });
      }
      rawOpt.series.push(seriesItem);

    }
    dispatch(resetOption(rawOpt));
  }


  // 多张表的变化率
  const drawChangeRate = () => {
    if (isEmpty(ActiveTable)) {
      message.error(`当前不存在报表`);
      return;
    }
    let opt = genMultiOption();
    opt = getChangeRateFromOpt(opt);
    dispatch(resetOption(opt));
  }



  // 设置初始引导弹窗
  let flag;
  if (window.localStorage.isModalVisible && Number(window.localStorage.isModalVisible) === 1) {
    flag = false;
  } else {
    flag = true;
  }
  let [isModalVisible, setIsModalVisible] = React.useState(flag);
  const tableExampleUrl = "https://github.com/ArchKS/archks.github.io/tree/master/TABLE";
  const handleOk = () => {
    setIsModalVisible(false);
    window.localStorage.isModalVisible = 1;
    window.open(tableExampleUrl);
  }
  const handleCancel = () => {
    window.localStorage.isModalVisible = 1;
    setIsModalVisible(false)
  }

  const drawMarked = () => {
    // 给series添加marPoint，仅限于type=bar|line
    if (isEmpty(ActiveTable)) {
      message.error(`当前不存在报表`);
      return;
    }
    let opt = genMultiOption();
    for (let index in opt.series) {
      let type = opt.series[index].type;

      if (type === 'line' || type === 'bar') {
        opt.series[index].markPoint = {
          data: [
            { type: 'max' },
            { type: 'min' },
          ]
        }
        opt.series[index].markLine = {
          data: [
            { type: 'average' }
          ]
        }
      }
    }

    dispatch(resetOption(opt));
  }


  return (
    <div className="App">
      <div className="global_wrapper">
        <Modal title="财报报表示例" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <a href={tableExampleUrl}>{tableExampleUrl}</a>
        </Modal>
      </div>
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

            <Tooltip placement="bottomLeft" title="不同的项在同一张表上绘制，比如比亚迪的净利润和成本的走势" arrowPointAtCenter>
              <Button type="primary" className="draw_button" onClick={drawMultiSelect}>同表绘制</Button>
            </Tooltip>


            <Tooltip placement="bottomLeft" title="堆叠同表绘制展示的各项数据" arrowPointAtCenter>
              <Button type="primary" className="draw_button" onClick={stackMultiSelect}>同表堆积</Button>
            </Tooltip>
            <Tooltip placement="bottomLeft" title="相同的项在不同的表上进行绘制，比如不同银行的ROE" arrowPointAtCenter>
              <Button type="primary" className="draw_button" onClick={test} disabled>异表绘制</Button>
            </Tooltip>

            <Button type="primary" className="draw_button" onClick={drawPie}>饼图</Button>

            <span className="draw_button">&nbsp;| &nbsp;</span>

            <Tooltip placement="bottomLeft" title="添加均线和最大最小值" arrowPointAtCenter>
              <Button type="primary" className="draw_button" onClick={drawMarked}>平均值</Button>
            </Tooltip>

            <Tooltip placement="bottomLeft" title="前后数据变化的趋势" arrowPointAtCenter>
              <Button type="primary" className="draw_button" onClick={drawChangeRate}>增长率</Button>
            </Tooltip>


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

            <Button type="primary" className="draw_button" onClick={customDraw}>自定义</Button>
            <Button type="primary" className="draw_button" onClick={() => { setIsModalVisible(true) }} ghost>报表示例</Button>
          </div>
          {visible === true ? <LyDraw></LyDraw> : <div></div>}
        </div>
        <div className="bottom">

          <ReactECharts
            ref={echartsRef}
            option={option}
            theme={"vte"}
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

