import { deepClone, isDigital } from './getType'
import * as XLSX from "xlsx";
import { isEmpty } from "./getType";
import getType from "./getType";
import { HEADERKEY, YearDecorate, unitRe } from "./Variable";


import { retDefaultOptions, retDefaultSerieItem } from './echartsData';

// 把xlsx文件解析成json格式的数据
export function getFirstJsonFromSheet(file) { // json.js
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (evt) => {
            let result = evt.target.result;
            let xlsxData = XLSX.read(result, { type: "binary" });
            for (let sheetName in xlsxData.Sheets) {
                let singleWorkSheet = xlsxData.Sheets[sheetName];
                let json = XLSX.utils.sheet_to_json(singleWorkSheet, { defval: "" });
                resolve(json);
                return; // 这里是只读取一张表 
            }
        };
    });
}

// 从json数据中获取antd table格式的column
function getColumnsFromJson(singleTableJson) {
    // 1. 取出obj里的key
    // 2. 将每一个key生成单独的newObj并push到数组里
    let columns = [],
        tableFirstLine = singleTableJson[0];
    for (let key in tableFirstLine) {

        const reportMap = {
            "年一季报": "Q1",
            "年中报": "Q2",
            "年三季报": "Q3",
            "年年报": "Q4",
        };

        let itemName = /^\d+$/.test(key) ? key : Object.keys(reportMap).reduce((acc, curr) => {
            return key.includes(curr) ? key.replace(curr, reportMap[curr]) : acc;
        }, key);

        itemName = itemName.trim();

        if (key === "__EMPTY") {
            columns.unshift({
                title: "__EMPTY",
                ellipsis: true,
                dataIndex: key,
                fixed: 'left',
                render: (text) => <span>{text} </span>
            });
        } else if (/^__EMPTY_\d+$/.test(itemName)) {

        } else {
            columns.push({
                title: itemName,
                dataIndex: itemName,
                render: (text) => <span>{text} </span>
            });
        }
    }
    return columns;
}

// 从json数据中获取antd table格式的data
// 去除不是数值的行
function getDataFromJson(singleTableJson) {
    /* 
    // 1. 取出报告中的key value
    // 2. 创建新数组
    // 3. 创建新对象
    // 4. 将新对象的key设置为自增
    // 5. 将新对象的剩余key' 用 key代替，剩余value'用value代替
    */

    let data = [],
        tableBody = singleTableJson.slice(0);
    for (let index in tableBody) {
        let val = tableBody[index];
        // for (let key in val) {
        // eslint-disable-next-line
        // if (/^[\-0-9\.]+$/.test(val[key])) { // \- 考虑负数
        // val[key] = +Number(val[key]).toFixed(2);
        // }
        // }

        let newObj = Object.assign({ key: Number(index) + 1 }, val);
        data.push(newObj);
    }

    const reportMap = {
        "年一季报": "Q1",
        "年中报": "Q2",
        "年三季报": "Q3",
        "年年报": "Q4",
    };

    const transformedArr = data.map(obj => {
        let newObject = {};
        for (let key in obj) {
            let newKey = Object.keys(reportMap).reduce((acc, curr) => {
                return key.includes(curr) ? key.replace(curr, reportMap[curr]) : acc;
            }, key);
            newObject[newKey] = obj[key];
        }
        newObject.__EMPTY = newObject.__EMPTY.replace(unitRe, '').trim();
        return newObject;
    });

    return transformedArr;
}

// 将antd格式的column和data合并，返回数组为 [columns,datas]
export function getColAndDataFromJson(json) {
    return [
        getColumnsFromJson(json),
        getDataFromJson(json)
    ]
}

// 将一个Table的Column数据转为ECHARTS的X轴数据
// ::::: 缺少排序
export function getXaisxDataFromColumns(columns) {
    return columns.map(obj => {
        let title = obj.title;
        if (/^\d+(Q\d)?$/.test(title)) {
            return title;
        } else {
            return '';
        }
    }).filter(t => t !== '')
}

// 将一个TABLE的DataSource数据转为ECAHRTS的Series数据
// ::::: 缺少排序
export function getSeriesDataFromDataSource(singleRowData, xAxis) {
    let title = singleRowData.__EMPTY,
        data = [];
    for (let key in singleRowData) {
        if (key === HEADERKEY) {
            title = singleRowData[key];
        }
    }

    for (let item of xAxis) { // x轴的值 item一般为 2001 2002 
        let key = `${item}${YearDecorate}`;
        let val = '';
        if (singleRowData.hasOwnProperty(key)) { // 如果年份是： 2001年年报 这种格式
            val = singleRowData[key];
        } else if (singleRowData.hasOwnProperty(item)) {
            val = singleRowData[item]; // 如果row的key是2001的话，一般行的key都是 2001年年报
        } else {
            // console.error('dataConvert.ts: line117 用row[2001年年报] & row[2001] 获取不到val的值');
        }
        data.push(val);
    }
    return [title, data];
}




// default data
let data = [
    {
        "__EMPTY": "资产:",
        "2002年年报": "",
        "2003年年报": "",
        "2004年年报": "",
    }
]

export const columns = getColumnsFromJson(data);
export const datas = getDataFromJson(data);


// 根据列名获取当前行的数据，比如 销售成本 -> [ 23,01, 22.31, 34.09, 34.55 ]
export function getRowDataByTitle(specName, table) {
    let xAxis = getXaisxDataFromColumns(table.columns);
    let dataSource = table.dataSource;
    for (let rowData of dataSource) {
        let [title, data] = getSeriesDataFromDataSource(rowData, xAxis); // title: 财务费用(亿元)  title: 一、营业总收入
        // let fmtTitle = title.replace(columnNameSuffixRe, '');
        if (specName === title/* || specName === fmtTitle */) {
            return data;
        }
    }
    return [];
}

/* 
    params:
    specObj: {
        销售成本:[],
        财务成本:[],
        ...
    }

    return:
    dataObj: {
        销售成本:[xxx],
        财务成本:[xxx],
        ...
    }  
    从当前表批量获取指定名称的项
 */
export function getRowDatasByTitleObj(specObj, pointTable) {
    let hasDataSelectObj = {};
    Object.keys(specObj).forEach(key => {
        let res = getRowDataByTitle(key, pointTable);
        if (res && res.length > 0) {
            hasDataSelectObj[key] = res;
        }
    });
    return hasDataSelectObj;
}


/* 从当前表，批量获取指定名称的项，封装成echarts的option返回 */
export function convertSpecRowToOption(pointTable, specObj, seriesType = "bar", stackType = "all") {
    let xAxis = getXaisxDataFromColumns(pointTable.columns);
    let retObj = getRowDatasByTitleObj(specObj, pointTable);
    let opt = retDefaultOptions();
    opt.series = [];
    const seriesArr = []
    opt.xAxis.data = xAxis;
    for (let key in retObj) {
        let seriesDataObj = retDefaultSerieItem(seriesType, key, retObj[key], { isStack: true });
        seriesArr.push(seriesDataObj);
    }
    opt.series = seriesArr;
    return opt;
}


// 两个series的item相加
export function addObj(seriesItem1, seriesItem2) {
    if (seriesItem1.hasOwnProperty("name")) {
        for (let index in seriesItem2.data) {
            let v1 = seriesItem2.data[index] || 0; // 避免出现 ""+""的情况
            let v2 = seriesItem1.data[index] || 0;
            seriesItem1.data[index] = Number((v1 + v2).toFixed(2));
        }
    } else {
        seriesItem1 = seriesItem2;
    }
    return seriesItem1;
}


// 根据table获取其标签名
// 取出dataSource中__EMPTY的值 HEADERKEY
export function getAllColumnName(Table) {
    let dataSource = Table.dataSource;
    let titles = dataSource.map(row => {
        let vals = Object.values(row).filter(t => !isEmpty(t));
        if (vals.length <= 2) { //除了__EMPTY 还有 lineNumber
            return ""
        }
    });
    return uniq(titles.filter(v => !isEmpty(v)));
}

// 数组去重
export function uniq(arr) {
    return Array.from(new Set(arr))
}


export function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// 增长率
export function getChangeRateFromOpt(opt) {
    let npt = JSON.parse(JSON.stringify(opt));
    npt = OneItemGrowthRate(npt);
    return npt;
}

export function OneItemGrowthRate(opt) {
    let nArr = opt.series;
    let gArr = getGrowthRateArr(JSON.parse(JSON.stringify(nArr)));
    let combineArr = [];
    for (let index = 0; index < nArr.length; index++) {
        nArr[index].type = 'bar';
        gArr[index].type = 'line';
        gArr[index].yAxisIndex = 1;
        combineArr.push(nArr[index]);
        combineArr.push(gArr[index]);
    }
    opt.series = combineArr;
    opt.yAxis = [{
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#B4B4B4',
            }
        },
    }, {

        splitLine: { show: false },
        axisLine: {
            lineStyle: {
                color: '#B4B4B4',
            }
        },
        axisLabel: {
            formatter: '{value}%',
        }
    }];
    opt.tooltip.formatter = (arr) => {
        return arr.map(v => {
            let seriesName = v.seriesName,
                value = v.value,
                marker = v.marker;
            let s = '';
            if (/增长率/.test(seriesName)) {
                s = `${marker} ${seriesName} ${value}%`
            } else {
                s = `${marker} ${seriesName} ${value}`
            }
            return s;
        }).join('<br>');
    }
    // opt.xAxis.data = opt.xAxis.data.slice(1);
    return opt;
}

export function getGrowthRateArr(rawDataArr) {
    let gArr = [];
    for (let index in rawDataArr) {
        let item = rawDataArr[index];
        let rateArr = [''];
        for (let i = 0; i < item.data.length - 1; i++) {
            let a = item.data[i + 1],
                b = item.data[i], r;
            if (!isDigital(a)) {
                a = 0;
            }
            if (!isDigital(b)) {
                r = 0;
            } else {
                r = ((a - b) * 100 / b).toFixed(2);
            }

            rateArr[i + 1] = r;
        }
        item.data = rateArr;
        item.name = item.name + "增长率";
        gArr.push(item);
    }
    return gArr;
}

// 2022年07月24日
// [1,1,1,2] + [2,2,2,3] => [3,3,3,5] => [33%,33%,33%,40%] + [66%,66%,66%,60%]
// 从值的变化，转变为值占整体百分比的变化，用柱状图的方式展示饼图
export function getRate(opt) {
    // 如果占比的值是负数怎么办
    let isNavi = false;
    let newOpt = deepClone(opt);
    let totalArr = new Array(opt.xAxis.data.length).fill(0);
    for (let index = 0; index < totalArr.length; index++) { // data的第几个值
        for (let item of newOpt.series) {                   // 第几个data
            let data = item.data;
            let digital = data[index];
            if (digital < 0) {
                alert(`${item.name}存在负数，无法计算比例！`);
                isNavi = true;
                break;
            }
            if (isDigital(digital)) {
                totalArr[index] += Number(data[index]);
            }
        }
        if (isNavi) {
            break;
        }
    }

    if (isNavi) {
        return opt;
    }

    for (let index = 0; index < totalArr.length; index++) {
        for (let item of newOpt.series) {
            let data = item.data;
            let digital = data[index]
            if (!/\d/.test(digital)) {
                digital = 0;
            }

            if (totalArr[index] === 0) {
                data[index] = 0;
            } else {
                data[index] = Math.round(+(digital * 100).toFixed(2) / +totalArr[index].toFixed(2));
            }


            item.stack = "all";
            item.type = "bar";
            item.areaStyle = {};
        }
    }
    newOpt.tooltip.formatter = (v) => {
        return v.map(v => {
            let seriesName = v.seriesName;
            let value = v.value;
            if (isDigital(value) && value !== 0 && value !== '') {
                return `${seriesName}: ${value}% <br>`
            } else {
                return ''
            }
        }).join('');
    }

    return newOpt;
}
/* 改变Option.series.type的类型 */
export const changeOptType = (opt, type) => {
    if (!opt) {
        return;
    }
    let newOpt = deepClone(opt);
    newOpt.series = [];
    for (let index in opt.series) {
        let item = deepClone(opt.series[index]);
        item.type = type;
        newOpt.series.push(item);
    }
    return newOpt;
}