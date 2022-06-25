import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import * as XLSX from "xlsx";
import { setTheme, options } from "./util";
import { BaseTable } from "ali-react-table";
import { sheetBook } from "./dataType/sheetBook";
import { Table } from 'antd';

// 注册主题
setTheme(echarts);

/* 
{
    "朝代": "秦朝",
    "开始": -221,
    "结束": -207,
    "持续": 14
}

column: { code: "dead", name: "死亡", width: 100, align: "center" },
row: {
      prov: "湖北省",
      confirm: 54406,
      cure: 4793,
      dead: 1457,
    },
*/
function generateColoumAndRow(json) {
  let columns = Object.keys(json[0]).map((key) => {
    return {
      code: key,
      name: key,
      width: 100,
      align: "center",
    };
  });
  let rows = json;
  return [columns, rows];
}

function removeEmpty(objList) {
  return objList.filter((item) => {
    let vals = Object.values(item);
    let emptyCount = 0;
    vals.forEach((v) => {
      if (v) {
        console.log(v);
        // v = v.trim();
        if (v.length == 0) {
          emptyCount += 1;
        }
      } else {
        emptyCount += 1;
      }
    });
    if (emptyCount >= vals.length - 1) {
      console.log(item);
      return false;
    } else {
      return true;
    }
  });
}

const getOneSheetRowAndColFromXlsx = (e) => {
  return new Promise((resolve, reject) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (evt) => {
      let result = evt.target.result;
      let xlsxData = XLSX.read(result, { type: "binary" });
      for (let sheetName in xlsxData.Sheets) {
        let singleWorkSheet = xlsxData.Sheets[sheetName]; // sheetToJson:sheet
        let json = XLSX.utils.sheet_to_json(singleWorkSheet, { defval: "" }); // sheetToJson:json
        // json = removeEmpty(json);
        // 这里是只读取一张表  // aliTable:dataSource & columns
        resolve(generateColoumAndRow(json));
        return;
      }
    };
  });
};

function App() {
  let [rows, setRows] = useState([]);
  let [columns, setColumns] = useState([]);

  // let xlsxData = sheetBook;
  // for (let sheetName in xlsxData.Sheets) {
  //   let singleWorkSheet = xlsxData.Sheets[sheetName];  // sheetToJson:sheet
  //   let json = XLSX.utils.sheet_to_json(singleWorkSheet);  // sheetToJson:json
  //   console.log(json);
  //   let res = generateColoumAndRow(json); // 这里是只读取一张表  // aliTable:dataSource & columns
  //   console.log(res);
  //   break;
  // }

  const parseData = async (e) => {
    
    let [c, r] = await getOneSheetRowAndColFromXlsx(e);
    setRows(r);
    setColumns(c);
  };

  return (
    // <ReactECharts
    //   option={options}
    //   theme={"vintage"}
    //   style={{ height: "600px" }}
    // ></ReactECharts>
    <div>
      <input id="upfile" type="file" accept=".xlsx" onChange={parseData} />
      <BaseTable
        dataSource={rows}
        columns={columns}
        style={{ overflow: "auto", maxHeight: 400 }}
      />
    </div>
  );
}

export default App;
