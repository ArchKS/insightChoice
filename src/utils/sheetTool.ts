import * as XLSX from "xlsx";

/* 1. 从表格中获取数据，返回第一个sheet的json
 * 2. 从json中获取row和column
 *
 */

// 1. input change event
export function getFirstJsonFromSheet(e: any) { // json.js
    return new Promise((resolve, reject) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (evt: any) => {
            let result = evt.target.result;
            let xlsxData = XLSX.read(result, { type: "binary" });
            for (let sheetName in xlsxData.Sheets) {
                let singleWorkSheet = xlsxData.Sheets[sheetName];                     // sheetToJson:sheet
                let json = XLSX.utils.sheet_to_json(singleWorkSheet, { defval: "" }); // sheetToJson:json
                // json = removeEmpty(json);
                // 这里是只读取一张表  // aliTable:dataSource & columns
                resolve(json);
                return;
            }
        };
    });
}


// 2. 
export function generateColoumAndRow(json: any) {

    // const columns = [
    //   {
    //     name: "Title",
    //     selector: (row) => row.title,
    //   },
    //   {
    //     name: "Year",
    //     selector: (row) => row.year,
    //   },
    // ];

    let columns = Object.keys(json[0]).map((key) => {
        return {
            name: key,
            selector: (row: any) => row[key]
        };
    });



    // const data = [
    //   {
    //     id: 1,
    //     title: "Beetlejuice",
    //     year: "1988",
    //   },
    //   {
    //     id: 2,
    //     title: "Ghostbusters",
    //     year: "1984",
    //   },
    // ];


    let rows = json;
    return [columns, rows];
}