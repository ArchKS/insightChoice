import * as React from "react";
import { useSelector, useDispatch } from 'react-redux';
import ReactECharts from "echarts-for-react";
import { Button, message, Tooltip, Modal, Input } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
// import Sidebar from './components/Sidebar';
import LyTabsComponent from './components/LyTabs';
import LyTableComponent from './components/LyTable';
import { miniCalc } from './utils/calc'
import { setIndex } from './store/features/setRowIndex'
import { resetOption } from './store/features/setOption'
import {
  getRate,
  changeOptType,
  getChangeRateFromOpt,
  getRowDatasByTitleObj,
  getXaisxDataFromColumns,
  getSeriesDataFromDataSource,
} from './utils/dataConvert'
import { isEmpty } from "./utils/getType";
import { retDefaultOptions, retDefaultSerieItem } from './utils/echartsData';
import { doResize } from './utils/resizer'

let isMove = false; // mousedown -> true & moveup -> false;
let h = 300;
let tableEl;
let m_pos = -1;

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

  /* 是否展示数字 */
  let [isShowDigital, setShowDigital] = React.useState(true);


  const setDigital = () => {
    let newOpt = JSON.parse(JSON.stringify(option));
    for (let index in newOpt.series) {
      newOpt.series[index].itemStyle = {
        normal: {
          label: {
            show: !isShowDigital
          }
        }
      }
    }
    setShowDigital(!isShowDigital);
    dispatch(resetOption(newOpt))
  }


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
    let originType = getOriginOptType();
    // 根据选中的下标，获取Active表的数据
    option.series = [];

    for (let index of selectIndex) {
      let [title, data] = getSeriesDataFromDataSource(ActiveTable.dataSource[index - 1], xAxis);
      let item = retDefaultSerieItem(originType, title, data);
      option.series.push(item);
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

  /* 绘制折线图 */
  const drawLine = () => {
    let newOpt = changeOptType(option, 'line')
    dispatch(resetOption(newOpt));
  }

  /* 绘制柱状图 */
  const drawBar = () => {
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
    let _isPercent = false;
    if (isEmpty(ActiveTable)) {
      message.error(`当前不存在报表`);
      return;
    }

    let opt = retDefaultOptions();
    let xAxis = getXaisxDataFromColumns(ActiveTable.columns);

    opt.series = [];
    opt.xAxis.data = xAxis;;
    iv = iv || "存货周转天数=365/(资产总计/存货);  应收账款周转天数=365/(资产总计/应收票据及应收账款);  固定资产周转天数=365/(资产总计/(固定资产+在建工程));";

    if (iv[0] === "%") {
      iv = iv.slice(1);
      _isPercent = true;
    }

    iv = iv.replace(/ /g, '');
    let iarr = iv.split(/;|；/).filter(v => !isEmpty(v));
    for (let iv1 of iarr) {
      let arr = iv1.split('=');
      if (arr.length !== 2) {
        alert("请输入符合格式的等式");
        return;
      }
      let [rowName, formula] = arr;
      formula = formula.replace(/ /g, '');
      let keys = formula.match(/[\u4e00-\u9fa5a-zA-Z0-9]+/g);
      let specObj = {};
      for (let key of keys) {
        // B应收账款，应该支持B1/B2/B3
        let pruneKey = key.replace(/B\d+/ig, '');
        specObj[pruneKey] = [];
      }

      let maxLength = ActiveTable.columns.length - 1;
      let retObj = getRowDatasByTitleObj(specObj, ActiveTable);


      for (let key of keys) {
        if (/^B\d+/.test(key)) { // B1应收账款，应该支持B1/B2/B3
          let pruneKey = key.replace(/B\d+/ig, '');
          let moveGap = key.match(/\d+/)[0];
          let fillzeroArr = new Array(maxLength).fill(0);
          retObj[key] = [...fillzeroArr.slice(0, moveGap), ...retObj[pruneKey].slice(0, maxLength - moveGap)];
        }
      }

      let listFormula = formula.split('');
      let resultArr = miniCalc(listFormula, retObj, maxLength);
      opt.series.push(retDefaultSerieItem('line', rowName, resultArr, { isPercent: _isPercent, isShowNumber: true }));
    }

    if (_isPercent) {
      opt.tooltip.formatter = (arr) => {
        return arr.map(v => {
          let seriesName = v.seriesName,
            value = v.value,
            marker = v.marker;
          let s = '';
          s = `${marker} ${seriesName} ${value}%`
          return s;
        }).join('<br>');
      }
    }

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
        <Tooltip placement="left" title="是否展示数据" arrowPointAtCenter>
          {isShowDigital ?
            <span className="iconfont icon-shujushujudian" onClick={setDigital}></span>
            :
            <span className="iconfont icon-shujushujudian gray" onClick={setDigital}></span>
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


  const doMouseMove = (e) => {
    if (isMove) {
      const dy = e.nativeEvent.y - m_pos;
      m_pos = e.nativeEvent.y;
      tableEl = document.querySelector(".table");
      h = h + dy;
      tableEl.style.height = h + 'px';
    }
  }

  window.addEventListener("mouseup", () => { isMove = false });
  return (
    <div className="App">
      <div className="global_wrapper">
        <Modal title="财报报表示例" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <a href={tableExampleUrl}>{tableExampleUrl}</a>
        </Modal>
      </div>
      {/* <div className="left_wrapper">
        <Sidebar></Sidebar>
      </div> */}
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
              <div className="btn_wrapper">
                <Button type="primary" icon={<ClearOutlined />} className="draw_button" onClick={clearOptions}>重置</Button>
                <Tooltip placement="bottomLeft" title="不同的项在同一张表上绘制，比如比亚迪的净利润和成本的走势" arrowPointAtCenter>
                  <Button type="primary" className="draw_button" onClick={drawMultiSelect}>绘图</Button>
                </Tooltip>
                <Tooltip placement="bottomLeft" title="相同的项在不同的表上进行绘制，比如不同银行的ROE" arrowPointAtCenter>
                  <Button type="primary" className="draw_button" onClick={test} disabled>异表绘制</Button>
                </Tooltip>
                <Button type="primary" className="draw_button" onClick={() => { setIsModalVisible(true) }} ghost>报表示例</Button>
              </div>
            </div>

            <div className="mini_search">
              <Search placeholder="存货周转率 = 365 - ( 营业成本 / 存货价值 ); " allowClear enterButton="迷你计算" onSearch={addNewRow} />
            </div>
          </div>
        </div>


        <div className="bottom">
          <div className="resize resize-top"></div>
          <div className="line"></div>

          <div className="sections">
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
    </div>
  );


}
export default App;

