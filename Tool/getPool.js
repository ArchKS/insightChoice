const {
    exec
} = require("child_process");



let copeList = "sh603288";
let cmd = `curl 'http://api.cninfo.com.cn/v5/hq/dataItem?jsonpCallback=jQuery023569499368953073_1659668461093&codelist=${copeList}&_=${new Date().getTime()}' \
-H 'Referer: http://www.cninfo.com.cn/' \
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
--compressed \
--insecure
`
async function execSync(cmd, format) {
    return new Promise((resolve, reject) => {
        exec(cmd, (a, b) => {
            if (a) {
                reject(a);
            } else {
                try {
                    if (format) {
                        b = format(b);
                    }
                    let json = JSON.parse(b);
                    resolve(json);
                } catch (error) {
                    reject(error);
                }
            }
        });
    })
}


const getCodeByNameCmd = (stockName) => {
    return `
        curl 'http://www.cninfo.com.cn/new/information/topSearch/detailOfQuery' \
        -H 'Accept: application/json, text/javascript, */*; q=0.01' \
        -H 'Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6' \
        -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
        -H 'Origin: http://www.cninfo.com.cn' \
        -H 'Pragma: no-cache' \
        -H 'Referer: http://www.cninfo.com.cn/new/fulltextSearch?notautosubmit=&keyWord=%E9%80%9A%E7%AD%96%E5%8C%BB%E7%96%97' \
        -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
        --data-raw 'keyWord=${encodeURIComponent(stockName)}&maxSecNum=10&maxListNum=5' \
        --compressed \
        --insecure
    `
}


const getCodeName = async (stockName) => {
    let getCodeCmd = getCodeByNameCmd(stockName);
    let codeInfo = await execSync(getCodeCmd);
    if (!codeInfo || !codeInfo.keyBoardList || codeInfo.keyBoardList.length <= 0) {
        return false;
    }

    singeCodeInfo = codeInfo.keyBoardList[0];
    return singeCodeInfo;
}


async function main() {
    let codeInfo = await getCodeName("工商银行"); // 获取股票代码信息 codeid,orignid....

    console.log(codeInfo);
    // let result = await execSync(cmd, (b) => {
    //     console.log(b);
    //     return '{}';
    // });
    // console.log(result);
}

main();


/* 
贵州茅台
五粮液
洋河股份
双汇发展
伊利股份
招商银行
中国平安
海康威视
美的集团
分众传媒
天下秀
共创草坪
同仁堂
云南白药
马应龙
片仔癀
*/



/* jQuery023569499368953073_1659668461093([{"3475914":"","395720":"357.00","1247689":"1.80","150":"82.95","151":"990","152":"83.10","153":"600","154":"82.94","155":"100","156":"83.11","157":"1600","91":"48.25","10":"82.99","55":"海天味业","11":"82.99","13":"1699547","14":"","15":"","17":"","18":"0","19":"140594291.00","264648":"0.29","1968584":"0.04","2918874":"","1":"20220805110628780","5":"603288","6":"82.70","7":"83.64","8":"83.73","9":"82.25","199112":"0.35","2558408":"0.29","603288":"SH.603288","24":"82.99","25":"4467","26":"82.98","27":"600","28":"82.96","29":"1300","2375":"","2374":"","2373":"","461256":"2.45","3541450":"","3672520":"0.35","30":"83.00","527198":"-","31":"4000","527197":"-","32":"83.03","33":"500","34":"83.09","35":"400","1149395":"13.86","330184":"827245.68","2412":"110628","2378":"","2377":"","1378761":"827245.68","2376":"","2034120":"48.25","526792":"1.80"}]) */

/* 
       self.specalMarketData.huanshoulv = item[1968584];//还手率
                    self.specalMarketData.shiyinglv = item[2034120];//市盈率
                    self.specalMarketData.shijinglv = item[1149395];//市净率
*/