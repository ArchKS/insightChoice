const {
    exec
} = require("child_process");


const getCodeByNameCmd = () => {
    let name = encodeURIComponent(globalConfig.stockName);
    let cmd = `
        curl 'http://www.cninfo.com.cn/new/information/topSearch/detailOfQuery' \
        -H 'Accept: application/json, text/javascript, */*; q=0.01' \
        -H 'Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6' \
        -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
        -H 'Origin: http://www.cninfo.com.cn' \
        -H 'Pragma: no-cache' \
        -H 'Referer: http://www.cninfo.com.cn/new/fulltextSearch?notautosubmit=&keyWord=%E9%80%9A%E7%AD%96%E5%8C%BB%E7%96%97' \
        -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
        --data-raw 'keyWord=${name}&maxSecNum=10&maxListNum=5' \
        --compressed \
        --insecure
    `
    // child_process.exec(cmd,callback);
    return cmd;
}
const getNoticeInfoCmd = (stock = "600763,gssh0600763", pageIndex = 1, plate) => {
    const cmd = `
    curl 'http://www.cninfo.com.cn/new/hisAnnouncement/query' \
    -H 'Accept: application/json, text/javascript, */*; q=0.01' \
    -H 'Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6' \
    -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
    -H 'Origin: http://www.cninfo.com.cn' \
    -H 'Pragma: no-cache' \
    -H 'Referer: http://www.cninfo.com.cn/new/disclosure/stock?orgId=gssh0600763&stockCode=600763' \
    -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
    -H 'X-Requested-With: XMLHttpRequest' \
    --data-raw 'stock=${encodeURIComponent(stock)}&tabName=fulltext&pageSize=${globalConfig.pageSize}&pageNum=${pageIndex}&column=sse&category=${encodeURIComponent(globalConfig.reportType)}&plate=${plate}&seDate=&searchkey=${encodeURIComponent(globalConfig.searchkey)}&secid=&sortName=&sortType=&isHLtitle=true' \
    --insecure
    `;
    return cmd;
}
async function execSync(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (a, b) => {
            if (a) {
                reject(a);
            } else {
                try {
                    let json = JSON.parse(b);
                    resolve(json);
                } catch (error) {
                    reject(error);
                }
            }
        });
    })
}

async function getData(singeCodeInfo) {
    let dataArr = [];
    let stock = `${singeCodeInfo.code},${singeCodeInfo.orgId}`;
    let ifHasMore = true,
        pageIndex = 1;

    let plate = singeCodeInfo.plate;

    while (ifHasMore) {
        let getItemCmd = getNoticeInfoCmd(stock, pageIndex, plate);
        let itemRes = await execSync(getItemCmd);
        if (itemRes && itemRes.announcements && itemRes.announcements.length > 0) {
            dataArr.push(...itemRes.announcements);
            ifHasMore = itemRes.hasMore;
            let totalItems = itemRes.totalAnnouncement;
            console.log(`共有${totalItems}条数据，现在是第${pageIndex}页，共${Math.ceil(totalItems/globalConfig.pageSize)}页`);
        } else {
            ifHasMore = false;
            console.log(`当前没有数据`);
            console.log('\x1b[31m%s\x1b[0m', 'Empty Data');
        }
        pageIndex++;


    }
    return dataArr;
}
const filterData = (dataArr) => {
    /* {
        "id": null,
        "secCode": "600763",
        "secName": "通策医疗",
        "orgId": "gssh0600763",
        "announcementId": "1213168936",
        "announcementTitle": "通策医疗股份有限公司2021年年度报告",
        "announcementTime": 1651075200000,
        "adjunctUrl": "finalpage/2022-04-28/1213168936.PDF",
        "adjunctSize": 6413,
        "adjunctType": "PDF",
        "storageTime": null,
        "columnId": "250401||251302",
        "pageColumn": "SHZB",
        "announcementType": "01010503||010113||010301",
        "associateAnnouncement": null,
        "important": null,
        "batchNum": null,
        "announcementContent": "",
        "orgName": null,
        "announcementTypeName": null
    } */
    // 1. 过滤摘要
    return dataArr.filter(v => globalConfig.downloadFilter(v.announcementTitle)).map(v => {
        return {
            pdfUrl: v.adjunctUrl,
            name: v.announcementTitle.replace(/  /g, '')
        }
    })
}
const downloadPDfs = async (pdfArr) => {
    try {
        await execSync(`mkdir ${globalConfig.stockName} &> /dev/null`);
    } catch (e) {}
    let index = 0;

    console.log('\x1b[32m%s\x1b[0m', 'Start To Download...');

    pdfArr.forEach(async (item) => {
        let fileName = globalConfig.renameFormat(item.name);
        let url = `http://static.cninfo.com.cn/` + item.pdfUrl;
        let cmd = `wget  "${url}" -O "./${globalConfig.stockName}/${fileName}"`;
        try {
            await execSync(cmd)
        } catch (e) {};
        console.log(`[ Downloading ${index+1}/${pdfArr.length} ]   ${fileName}`);
        index++;
    })

}
const getCodeName = async (name) => {
    let getCodeCmd = getCodeByNameCmd(name);
    let codeInfo = await execSync(getCodeCmd);
    if (!codeInfo || !codeInfo.keyBoardList || codeInfo.keyBoardList.length <= 0) {
        return false;
    }

    singeCodeInfo = codeInfo.keyBoardList[0];
    return singeCodeInfo;
}
async function main() {
    let singleCodeInfo = await getCodeName(); // 获取股票代码信息 codeid,orignid....
    let dataArr = await getData(singleCodeInfo);
    let pdfArr = filterData(dataArr);
    downloadPDfs(pdfArr)
}




// 年报、半年报、一季报、三季报
// type TCategories = "category_ndbg_szsh" | "category_bndbg_szsh" | "category_yjdbg_szsh" | "category_sjdbg_szsh";
let globalConfig = {
    stockName: '共创草坪',
    reportType: '',
    searchkey: '招股说明书',
    pageSize: 30,
    downloadFilter: (title) => {
        if (/摘要/.test(title)) {
            return false;
        } else {
            return true;
        }
    },
    renameFormat: (title) => {
        if (globalConfig.searchkey) {
            let plainText = title.replace(/\<.*?\>/g, '') + ".PDF";
            return plainText;
        } else {
            let certainYear = title.match(/(\d{4})/)[1];
            return `${globalConfig.stockName}_${certainYear}年报.PDF`;
        }
    }
}

main();