import React, { useState } from "react";
import DataTable from "react-data-table-component";
import {
  getFirstJsonFromSheet,
  generateColoumAndRow,
  echartsOptions,
} from "./util";
import sheetJSON from "./dataType/json";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import "./App.css";

function App() {
  let [rows, setRows] = useState([]);
  let [columns, setColumns] = useState([]);
  let [options, setOptions] = useState({});

  let [c, r] = generateColoumAndRow(sheetJSON);

  const getJsonData = async (e) => {
    let jsonData = await getFirstJsonFromSheet(e);
    console.log(jsonData);
    let [r, c] = generateColoumAndRow(jsonData);
    setRows(r);
    setColumns(c);
  };
  return (
    <div>
      {/* <input id="upfile" type="file" accept=".xlsx,.xls" onChange={getJsonData} /> */}
      <div className="costum_table">
        <DataTable
          columns={c}
          data={r}
          onRowClicked={(a, b) => {
            // {
            //     "__EMPTY": "买入返售金融资产(亿元)",
            //     "2002年年报": 28.1,
            //     "2003年年报": 102.14,
            //     "2004年年报": 111.32,
            // ......
            // }

            let rawXasix = Object.keys(a).filter((v) => v != "__EMPTY");
            let rawYaxis = rawXasix.map((v) => a[v]);
            let processXaxis = rawXasix.map((v) =>
              v.replace(/^(\d+).*$/, "$1")
            );

            echartsOptions.xAxis = {
              type: "category",
              data: processXaxis,
            };
            echartsOptions.series = [
              {
                data: rawYaxis,
                type: "line",
                name: a.__EMPTY,
                markPoint: {
                  data: [
                    {
                      type: "max",
                    },
                    {
                      type: "min",
                    },
                  ],
                },
                markLine: {
                  data: [{ type: "average" }],
                },
              },
            ];
            console.log(echartsOptions);

            setOptions(Object.assign({}, echartsOptions));
          }}
        />
      </div>

      <ReactECharts
        option={options}
        theme={"vintage"}
        style={{ height: "600px" }}
      ></ReactECharts>
    </div>
  );
}
export default App;
