import * as React from "react";
import { useSelector, useDispatch } from 'react-redux';
import ReactECharts from "echarts-for-react";
import { Button, message, Tooltip, Modal, Input } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import Sidebar from './components/Sidebar';
import LyTabsComponent from './components/LyTabs';
import LyTableComponent from './components/LyTable';
import { miniCalc } from './utils/calc'
import { setIndex } from './store/features/setRowIndex'
import { resetOption } from './store/features/setOption'
import { columnNameSuffix, TABLENAME } from "./utils/Variable";
import {
  getRate,
  changeOptType,
  retDefaultOptions,
  generateSeriesItem,
  getChangeRateFromOpt,
  getRowDatasByTitleObj,
  convertSpecRowToOption,

  getXaisxDataFromColumns,
  getSeriesDataFromDataSource,
} from './utils/dataConvert'
import { setVisible } from "./store/features/setDraw";
import { deepClone, isEmpty } from "./utils/getType";



const { Search } = Input;

function App() {
  /* isLock 是否锁定原值，如果锁定，则值不会被修改，而是用不同的形式呈现；如果没有锁定，则点击增长率、等会修改EchartsOption的值 */
  let [isLock, setIsLock] = React.useState(true);

  /* isStack 是否堆积 */
  let [isStack, setIsStack] = React.useState(true);

  /* 是否存在报表 */
  let [hasEcharts, setHasEcharts] = React.useState(false);

  const dispatch = useDispatch();
  let { option } = useSelector(store => store.setOption);
  let { ActiveTable, AppTables } = useSelector(store => store.setTable);
  let { selectIndex } = useSelector(store => store.setRowIndex);
  const echartsRef = React.useRef(null);

  const clearOptions = () => {
    // 暴力重置法，不这样清不干净
    echartsRef.current.getEchartsInstance().clear(); // 重置图标，和changeTab的时候需要用到重置功能
    dispatch(resetOption({}));
    dispatch(setIndex([]));
    message.success(`重置成功`, 1);
    setHasEcharts(false);
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
      seriesDataObj.type = getOriginOptType() || "line";
      option.series.push(seriesDataObj);
    }
    setHasEcharts(true);
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

    let opt = JSON.parse(JSON.stringify(option));
    setIsStack(!isStack)

    if (isStack) {
      for (let index in opt.series) {
        opt.series[index].stack = "all";
        opt.series[index].areaStyle = {};
      }
    } else {
      for (let index in opt.series) {
        opt.series[index].stack = "";
        opt.series[index].areaStyle = {};
      }
    }
    dispatch(resetOption(opt));
  }

  const getOpt = () => {
    let opt;
    if (genMultiOption().series.length > 0) {
      if (isLock) {
        opt = genMultiOption();
      } else {
        opt = JSON.parse(JSON.stringify(option));
      }
    } else {
      opt = JSON.parse(JSON.stringify(option));;
    }
    return opt;
  }


  const getOriginOptType = () => {
    let type = "";
    if (option && option.series && option.series.length > 0) {
      type = option.series[0].type;
    }
    return type;
  }

  const test = () => { }

  /* 构造现金流量表：经营、筹资、投资堆叠数据 */
  const drawCrashFlow = () => {
    let crashFlowTable = getCertainTable(TABLENAME.CASHFLOWTABLE.name);
    if (!crashFlowTable) return;

    // 根据当前表格和想要获取的行，获取opt
    let opt = convertSpecRowToOption(crashFlowTable, TABLENAME.CASHFLOWTABLE.rules);
    dispatch(resetOption(opt));
    setHasEcharts(true);
  }

  /* 利润表的费用：销售、研发、管理、财务的堆叠数据 */
  const drawCost = () => {
    let profieTable = getCertainTable(TABLENAME.INCOMETABLE.name);
    if (!profieTable) return;

    // 根据当前表格和想要获取的行，获取opt
    let opt = convertSpecRowToOption(profieTable, TABLENAME.INCOMETABLE.rules);
    console.log(TABLENAME.INCOMETABLE.rules);
    dispatch(resetOption(opt));
    setHasEcharts(true);
  }

  /* 构建资产堆积图，包括货币资金、存货、无形资产、应收类资产、固定资产 */
  const drawFundStack = () => {
    /* 财务报表·资产负债表中的内容 */
    let balanceSheetTable = getCertainTable(TABLENAME.BALANCETABLE.name);
    if (!balanceSheetTable) return;
    let rules = JSON.parse(JSON.stringify(TABLENAME.BALANCETABLE.rules));
    let opt = retDefaultOptions();
    let maxLength = balanceSheetTable.columns.length - 1;
    opt.series = [];
    opt.xAxis.data = getXaisxDataFromColumns(balanceSheetTable.columns);
    let keyNames = Object.keys(rules);
    for (let name of keyNames) {
      let specObj = {};
      let listFormula = rules[name].join("+").split('');
      for (let val of rules[name]) {
        specObj[val] = new Array(maxLength).fill(0);
      }
      let retObj = getRowDatasByTitleObj(specObj, balanceSheetTable);
      let resultObj = Object.assign(specObj, retObj);
      let resultArr = miniCalc(listFormula, resultObj, maxLength);
      let item = {
        name: name,
        data: resultArr,
        type: 'line',
        stack: "all",
        areaStyle: {},
        smooth: true,
      }
      opt.series.push(item);
    }
    dispatch(resetOption(opt));
    setHasEcharts(true);
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

  /* 绘制折线图 */
  const drawLine = () => {
    let newOpt = changeOptType(option, 'line')
    dispatch(resetOption(newOpt));
  }

  /* 绘制柱状图 */
  const drawBar = () => {
    console.log(option);
    let newOpt = changeOptType(option, 'bar')
    dispatch(resetOption(newOpt));
  }

  /* 增速 */
  const drawChangeRate = () => {
    if (isEmpty(ActiveTable)) {
      message.error(`当前不存在报表`);
      return;
    }
    let opt = getOpt();
    opt = getChangeRateFromOpt(opt);
    // 从当前的optio获取数据，而非处理原始的option数据
    dispatch(resetOption(opt));
  }

  /* 百分比 */
  const drawRate = () => {
    if (isEmpty(ActiveTable)) {
      message.error(`当前不存在报表`);
      return;
    }
    let opt = getOpt();
    opt = getRate(opt);
    dispatch(resetOption(opt));
  }

  /* 迷你计算、新增一行 */
  const addNewRow = (iv) => {
    // 短期偿债能力 =  流动资产 / 流动负债
    // 存货周转率 = 365 - ( 营业成本 / 存货价值 )
    // -> 值为空； 分母值为0； 如果存在自然数； 如果存在括号；
    // 
    if (isEmpty(ActiveTable)) {
      message.error(`当前不存在报表`);
      return;
    }

    let opt = retDefaultOptions();
    let xAxis = getXaisxDataFromColumns(ActiveTable.columns);
    opt.series = [];
    opt.xAxis.data = xAxis;
    iv = iv || "存货周转天数=365/(资产总计/存货);  应收账款周转天数=365/(资产总计/应收票据及应收账款);  固定资产周转天数=365/(资产总计/(固定资产+在建工程));";
    iv = iv.replace(/ /g, '');
    let iarr = iv.split(/;|；/).filter(v => !isEmpty(v));
    for (let iv1 of iarr) {
      let arr = iv1.split('=');
      console.log(arr);
      if (arr.length !== 2) {
        alert("请输入符合格式的等式");
        return;
      }
      let [rowName, formula] = arr;
      formula = formula.replace(/ /g, '');
      let keys = formula.match(/[\u4e00-\u9fa5a-zA-Z0-9]+/g);
      let specObj = {};
      for (let key of keys) {
        specObj[key] = [];
      }
      let maxLength = ActiveTable.columns.length - 1;
      let retObj = getRowDatasByTitleObj(specObj, ActiveTable);
      let listFormula = formula.split('');
      let resultArr = miniCalc(listFormula, retObj, maxLength);
      let item = {
        name: rowName,
        data: resultArr,
        type: 'line',
        smooth: true,
      }
      opt.series.push(item);
    }

    console.log(opt);
    dispatch(resetOption(opt));
    setHasEcharts(true);
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

  /* 平均值 */
  const drawMarked = () => {
    // 给series添加marPoint，仅限于type=bar|line
    if (isEmpty(ActiveTable)) {
      message.error(`当前不存在报表`);
      return;
    }

    let opt = getOpt();
    console.log(opt);
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

  const renderSettings = () => {
    return (
      <div className="setting_icons">

        <Tooltip placement="left" title="锁定/解锁原值" arrowPointAtCenter>
          {isLock ? <span className="iconfont icon-suoding" onClick={() => { setIsLock(!isLock) }}></span> : <span className="iconfont icon-jiesuo" onClick={() => { setIsLock(!isLock) }}></span>}
        </Tooltip>


        <Tooltip placement="left" title="刷新" arrowPointAtCenter>
          <span className="iconfont icon-Updatereset_" onClick={drawMultiSelect}></span>
        </Tooltip>
        <Tooltip placement="left" title="增速" arrowPointAtCenter>
          <span className="iconfont icon-zengchangshuai" onClick={drawChangeRate}></span>
        </Tooltip>

        <Tooltip placement="left" title="百分比" arrowPointAtCenter>
          <span className="iconfont icon-percentage" onClick={drawRate}></span>
        </Tooltip>

        <Tooltip placement="left" title="平均值" arrowPointAtCenter>
          <span className="iconfont icon-pingjunshu" onClick={drawMarked}></span>
        </Tooltip>
        <Tooltip placement="left" title="堆积图 / 取消堆积" arrowPointAtCenter>
          {isStack ?
            <span className="iconfont icon-stack" onClick={stackMultiSelect}></span>
            :
            <span className="iconfont icon-square_stack_d_up_slash_fill" onClick={stackMultiSelect}></span>
          }
        </Tooltip>

        <Tooltip placement="left" title="折线图" arrowPointAtCenter>
          <span className="iconfont icon-line-chart-line base-func" onClick={drawLine}></span>
          {/* <span className="iconfont icon-square_stack_d_up_slash_fill"></span> */}
        </Tooltip>

        <Tooltip placement="left" title="柱状图" arrowPointAtCenter>
          <span className="iconfont icon-chart-bar base-func" onClick={drawBar}></span>
          {/* <span className="iconfont icon-square_stack_d_up_slash_fill"></span> */}
        </Tooltip>


      </div>
    )
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
            <div className="normal_btn">
              <Button type="primary" icon={<ClearOutlined />} className="draw_button" onClick={clearOptions}>重置</Button>
              <Tooltip placement="bottomLeft" title="不同的项在同一张表上绘制，比如比亚迪的净利润和成本的走势" arrowPointAtCenter>
                <Button type="primary" className="draw_button" onClick={drawMultiSelect}>绘图</Button>
              </Tooltip>
              <Tooltip placement="bottomLeft" title="相同的项在不同的表上进行绘制，比如不同银行的ROE" arrowPointAtCenter>
                <Button type="primary" className="draw_button" onClick={test} disabled>异表绘制</Button>
              </Tooltip>
              <Tooltip placement="bottomLeft" title="资产负债表中的资产组成：包括货币资金、无形资产、存货、固定资产在建工程、应收类资产" arrowPointAtCenter>
                <Button type="primary" className="draw_button" onClick={drawFundStack}>资产堆积</Button>
              </Tooltip>

              <Tooltip placement="bottomLeft" title="现金流量表中的现金活动：包括筹资、投资和经营" arrowPointAtCenter>
                <Button type="primary" className="draw_button" onClick={drawCrashFlow}>现金流量</Button>
              </Tooltip>
              <Tooltip placement="bottomLeft" title="利润表中的各种费用：包括财务、销售、研发、管理费用" arrowPointAtCenter>
                <Button type="primary" className="draw_button" onClick={drawCost}>费用构成</Button>
              </Tooltip>
              <Button type="primary" className="draw_button" onClick={() => { setIsModalVisible(true) }} ghost>报表示例</Button>
            </div>

            <div className="mini_search">
              <Search placeholder="存货周转率 = 365 - ( 营业成本 / 存货价值 ); " allowClear enterButton="迷你计算" onSearch={addNewRow} />
            </div>
          </div>
        </div>
        <div className="bottom">
          {hasEcharts ? renderSettings() : ""}
          <ReactECharts
            ref={echartsRef}
            option={option}
            theme={"vte"}
            notMerge={true}
            lazyUpdate={true}
            style={{ height: "500px" }}
          >
          </ReactECharts>
        </div>
      </div>
    </div>
  );
}
export default App;

