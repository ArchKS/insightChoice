import { Ext } from "./reg";

let data = [
    {
        "报告日期": "",
        "2009年年报": "查看",
        "2011年年报": "查看",
        "2012年年报": "查看",
        "2013年年报": "查看",
        "2014年年报": "查看",
        "2015年年报": "查看",
        "2016年年报": "查看",
        "2017年年报": "查看",
        "2018年年报": "查看",
        "2019年年报": "查看",
        "2020年年报": "查看"
    },
    {
        "报告日期": "营业收入(亿元)",
        "2009年年报": "",
        "2011年年报": "",
        "2012年年报": "",
        "2013年年报": "",
        "2014年年报": "",
        "2015年年报": "",
        "2016年年报": "",
        "2017年年报": "",
        "2018年年报": "",
        "2019年年报": "",
        "2020年年报": ""
    },
    {
        "报告日期": "拆借、存放等同业业务",
        "2009年年报": 23.07,
        "2011年年报": "",
        "2012年年报": "",
        "2013年年报": "",
        "2014年年报": "",
        "2015年年报": "",
        "2016年年报": "",
        "2017年年报": "",
        "2018年年报": "",
        "2019年年报": "",
        "2020年年报": ""
    },
    {
        "报告日期": "存放中央银行款项",
        "2009年年报": 29.57,
        "2011年年报": "",
        "2012年年报": "",
        "2013年年报": "",
        "2014年年报": "",
        "2015年年报": "",
        "2016年年报": "",
        "2017年年报": "",
        "2018年年报": "",
        "2019年年报": "",
        "2020年年报": ""
    }
]


function generateColumns(singleTableJson) {
    /* 
        {
            "报告日期": "",
            "2009年年报": "查看",
            "2011年年报": "查看",
            "2012年年报": "查看",
        },
    ===> 
    {
        title: 报告日期
        dataIndex: 报告日期
        render: text=> <p> {text} <p>
    },{
        title: 2009
        dataIndex: 2009
        render: text=> <p> {text} <p>
    },
    
    // 1. 取出obj里的key
    // 2. 将每一个key生成单独的newObj并push到数组里
    
    */

    let columns = [],
        tableFirstLine = singleTableJson[0];
    for (let key in tableFirstLine) {
        columns.push({
            title: key.replace(/[^0-9]+/,''),
            dataIndex: key,
            render: text => <span>{text}</span> // 这里是body值的处理，不是column
        });
    }
    return columns;
}


function generateData(singleTableJson) {


    /* 
    {
        "报告日期": "拆借、存放等同业业务",
        "2009年年报": 23.07,
        "2011年年报": "",
        "2012年年报": "",
        "2013年年报": "",
        "2014年年报": "",
        "2015年年报": "",
        "2016年年报": "",
        "2017年年报": "",
        "2018年年报": "",
        "2019年年报": "",
        "2020年年报": ""
    },

    ===> 
    {
        key: '1',
        姓名: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },


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
        
        let newObj = Object.assign({
            key: Number(index) + 1
        }, val);

        data.push(newObj);
    }
    return data;
}



export const columns = generateColumns(data);
export const datas = generateData(data);