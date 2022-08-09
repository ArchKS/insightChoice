import {
    generateSeriesItem,
    getSeriesDataFromDataSource,
    getXaisxDataFromColumns,
    retDefaultOptions
} from "./dataConvert";
import {
    columnNameSuffixRe
} from "./Variable";


// interface iSelectObj {
//     // '销售费用': 
//     [propsName: string] : string;
// }
/* 从指定表中选出指定字段，构造堆叠数据 */
export const constructStackAndFixedKeyOpt = (pointTable, selectObj, seriesType = "bar") => {
    // xAxis data
    let xAxis = getXaisxDataFromColumns(pointTable.columns);
    let hasDataSelectObj = {}; // 替代selectObj，不然会出现NAN数组
    // 获取selectObj中key指定的数据
    for (let row of pointTable.dataSource) {
        let [title, data] = getSeriesDataFromDataSource(row, xAxis); // title: 财务费用(亿元)
        let fmtTitle = title.replace(columnNameSuffixRe, '');
        for (let key in selectObj) {
            if (key === fmtTitle) {
                hasDataSelectObj[key] = data;
            }
        }
    }
    // 构造echart option对象
    let opt = retDefaultOptions();
    opt.xAxis.data = xAxis;
    let seriesArr = [];
    for (let key in hasDataSelectObj) {
        let seriesDataObj = generateSeriesItem(hasDataSelectObj[key], key);
        seriesDataObj.stack = 'all';
        seriesDataObj.type = seriesType;
        seriesDataObj.areaStyle = {};
        seriesArr.push(seriesDataObj);
    }

    opt.series = seriesArr;
    return opt;
}


