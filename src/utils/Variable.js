/* ----------------------- REG EXP */
export const Ext = /(\.[a-z][A-Z]+)$/i; // 文件扩展名





/* ----------------------- Global Variable */
export const columnNameSuffix = '(亿元)';
export const columnNameSuffixRe = /\(\W{1,4}\)$/; // 替换(亿)、(万)、(万元)等


// 上传文件需要用到这些名字
export const TABLENAME = {
    'INCOMETABLE': {
        name: "利润表",
        rules: {
            "销售费用": [],
            "管理费用": [],
            "研发费用": [],
            "财务费用": [],
        }

    },
    'CASHFLOWTABLE': {
        name: "现金流量表",
        rules: {
            "筹资活动产生的现金流量净额": [],
            "经营活动产生的现金流量净额": [],
            "投资活动产生的现金流量净额": [],
        }
    },
    'BALANCETABLE': {
        name: "资产负债表",
        rules: {
            "固定资产": ["固定资产", "在建工程", "工程物资"],
            "应收类资产": ["应收票据及应收账款", "其他应收款合计", "应收利息", "应收款项类投资"],
            "货币资金": ["货币资金"],
            "存货": ["存货"],
            "无形资产": ["无形资产", "商誉"]
        }
    }
}



export const YearDecorate = "年年报"; // 2001年年报 2002年年报

export const HEADERKEY = "__EMPTY"


export const SUMMARYAARRAY = [
    "资产总计(亿元)",
    "负债合计(亿元)",
    "股东权益合计(亿元)",

    // ----------
    "一、营业总收入(亿元)",
    "二、营业总成本(亿元)",
    "三、其他经营收益",
    "四、营业利润(亿元)",
    "五、利润总额(亿元)",
    "六、净利润(亿元)",

]
