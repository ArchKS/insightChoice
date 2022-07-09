
import * as XLSX from "xlsx";
import { HEADERKEY, YearDecorate ,columnNameSuffix} from "./Variable";

// 把xlsx文件解析成json格式的数据
export function getFirstJsonFromSheet(file) { // json.js
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (evt) => {
            let result = evt.target.result;
            let xlsxData = XLSX.read(result, { type: "binary" }) ;
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
        if (/\d+/.test(key)) { // 年份
            columns.push({
                title: key.replace(/[^0-9]+/, ''),
                dataIndex: key,
                render: (text) => <span>{text} </span>
            });
        } else {
            columns.unshift({
                title: key,
                ellipsis: true,
                dataIndex: key,
                fixed: 'left',
                render: (text) => <span>{text} </span>
            });
        }
    }
    return columns;
}

// 从json数据中获取antd table格式的data
function getDataFromJson(singleTableJson) {
    /* 
    // 1. 取出报告中的key value
    // 2. 创建新数组
    // 3. 创建新对象
    // 4. 将新对象的key设置为自增
    // 5. 将新对象的剩余key' 用 key代替，剩余value'用value代替
    */

    let data = [],
        tableBody = singleTableJson.slice(1);
    for (let index in tableBody) {
        let val = tableBody[index];

        let newObj = Object.assign({ key: Number(index) + 1 }, val);

        data.push(newObj);
    }
    return data;
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
        if (/^\d+$/.test(title)) {
            return title;
        } else {
            return '';
        }
    }).filter(t => t !== '')
}

// 将一个TABLE的DataSource数据转为ECAHRTS的Series数据
// ::::: 缺少排序
export function getSeriesDataFromDataSource(singleRowData,xAxis) {
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
            console.error('dataConvert.ts: line117 用row[2001年年报] & row[2001] 获取不到val的值');
        }
        data.push(val);
    }
    return [title, data];
}

export function retDefaultOptions() {
    return {
        // 需要一个默认的option，且series中需要有一个item，不然reactEcharts不会更新 
        // :https://github.com/apache/echarts/issues/7896 
        xAxis: {
            type: 'category',
            data: [1, 2, 3, 4]
        },
        yAxis: {
            type: 'value'
        },
        series: [],
        tooltip: {
            trigger: "axis",
        },
        toolbox: {
            right: "8%",
            feature: {
                saveAsImage: {},
                magicType: {
                    show: true,
                    type: ["line", "bar"]
                }
            }
        },
        legend: {
            left: 'center'
        },
    }
}

export function generateSeriesItem(data, title) {
    return {
        data: data,
        type: 'line',
        name: title,
        smooth: true,
        // markPoint: {
        //     data: [
        //         { type: 'max' },
        //         { type: 'min' },
        //     ]
        // },
        // markLine: {
        //     data: [
        //         { type: 'average' }
        //     ]
        // }
    }
}

// default data
let data = [
    {
        "__EMPTY": "资产:",
        "2002年年报": "",
        "2003年年报": "",
        "2004年年报": "",
        "2005年年报": "",
        "2006年年报": "",
        "2007年年报": "",
        "2008年年报": "",
        "2009年年报": "",
        "2010年年报": "",
        "2011年年报": "",
        "2012年年报": "",
        "2013年年报": "",
        "2014年年报": "",
        "2015年年报": "",
        "2016年年报": "",
        "2017年年报": "",
        "2018年年报": "",
        "2019年年报": "",
        "2020年年报": "",
        "2021年年报": ""
    }
]

export const columns = getColumnsFromJson(data);
export const datas = getDataFromJson(data);


// 根据列名获取当前行的数据，比如 销售成本 -> [ 23,01, 22.31, 34.09, 34.55 ]
export function getRowDataByTitle(specName,table) {
    let xAxis = getXaisxDataFromColumns(table.columns);
    let dataSource = table.dataSource;
    for(let rowData of dataSource){
        let [title, data] = getSeriesDataFromDataSource(rowData, xAxis); // title: 财务费用(亿元)
        let fmtTitle = title.replace(columnNameSuffix, '');
        if(specName === title || specName === fmtTitle){
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
export function getRowDatasByTitleObj(specObj,pointTable){
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
export function convertSpecRowToOption(pointTable,specObj,seriesType="bar",stackType="all"){
    let xAxis = getXaisxDataFromColumns(pointTable.columns);
    let retObj = getRowDatasByTitleObj(specObj,pointTable);
    let opt = retDefaultOptions();
    opt.series = [];
    const seriesArr = []
    opt.xAxis.data = xAxis;
    for (let key in retObj) {
        let seriesDataObj = generateSeriesItem(retObj[key], key);
        seriesDataObj.stack = stackType;
        seriesDataObj.type = seriesType;
        seriesDataObj.areaStyle = {};
        seriesArr.push(seriesDataObj);
    }
    opt.series = seriesArr;
    console.log('opt?:',opt.series);
    return opt;
}


  // 两个series的item相加
export function addObj  (seriesItem1, seriesItem2) {
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
