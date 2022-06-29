// import React, { useState } from "react";
// import DataTable from "react-data-table-component";
// import ReactECharts from "echarts-for-react";
// import { generateColoumAndRow, getFirstJsonFromSheet } from "./utils/sheetTool";
// import sheetJSON from "./typeExample/json";
// import { echartsOptions } from "./utils/echartRel";
// import {Ext} from './utils/reg';
// import { iFile } from "./type";
// import './utils/tool'
// function App() {
//   let [rows, setRows] = useState([]);
//   let [columns, setColumns] = useState([]);
//   let [options, setOptions] = useState({});

//   let [c, r] = generateColoumAndRow(sheetJSON);




//   const getJsonData = async (e: any) => {
//     let files = e.target.files as iFile[];
//     let tablesArr = [];
//     for (let file of files) {
//       console.log(file);
//       let jsonData = await getFirstJsonFromSheet(file);
//       tablesArr.push({
//         name: file.name.replace(Ext,''),
//         data: jsonData
//       });
//     }
//     console.log(tablesArr);
//     // let [r, c] = generateColoumAndRow(jsonData);
//     // setRows(r);
//     // setColumns(c);
//   };

//   const clickTable = (a: any, b: any) => {
//     let rawXasix = Object.keys(a).filter((v) => v !== "__EMPTY");
//     let rawYaxis = rawXasix.map((v) => a[v]);
//     let processXaxis = rawXasix.map((v) => v.replace(/^(\d+).*$/, "$1"));

//     echartsOptions.xAxis = {
//       type: "category",
//       data: processXaxis,
//     };
//     echartsOptions.series = [
//       {
//         data: rawYaxis,
//         type: "line",
//         name: a.__EMPTY,
//         markPoint: {
//           data: [
//             {
//               type: "max",
//             },
//             {
//               type: "min",
//             },
//           ],
//         },
//         markLine: {
//           data: [{ type: "average" }],
//         },
//       },
//     ];
//     setOptions(Object.assign({}, echartsOptions));
//   };

//   return (
//     <div>
//       <input id="upfile" type="file" accept=".xlsx,.xls" onChange={getJsonData} multiple />
//       {/* <div className="costum_table">
//         <DataTable
//           columns={c}
//           data={r}
//           onRowClicked={(a: any, b: any) => {
//             clickTable(a, b);
//           }}
//           selectableRows
//           onSelectedRowsChange={(evt: any) => {
//             console.log(evt);
//           }}
//         />
//       </div>

//       <ReactECharts
//         option={options}
//         theme={"vintage"}
//         style={{ height: "600px" }}

//       ></ReactECharts> */}
//     </div>
//   );
// }
// export default App;
export function Q() { }