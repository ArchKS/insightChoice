
export function setTheme(echartsInstance: any) {
  echartsInstance.registerTheme("vintage", {
    color: [
      "#d87c7c",
      "#919e8b",
      "#d7ab82",
      "#6e7074",
      "#61a0a8",
      "#efa18d",
      "#787464",
      "#cc7e63",
      "#724e58",
      "#4b565b",
    ],
    backgroundColor: "rgba(254,248,239,1)",
    textStyle: {},
    title: {
      textStyle: {
        color: "#333333",
      },
      subtextStyle: {
        color: "#aaaaaa",
      },
    },
    line: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 4,
      symbol: "emptyCircle",
      smooth: false,
    },
    radar: {
      itemStyle: {
        borderWidth: 1,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 4,
      symbol: "emptyCircle",
      smooth: false,
    },
    bar: {
      itemStyle: {
        barBorderWidth: 0,
        barBorderColor: "#ccc",
      },
    },
    pie: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    scatter: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    boxplot: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    parallel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    sankey: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    funnel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    gauge: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
    },
    candlestick: {
      itemStyle: {
        color: "#c23531",
        color0: "#314656",
        borderColor: "#c23531",
        borderColor0: "#314656",
        borderWidth: 1,
      },
    },
    graph: {
      itemStyle: {
        borderWidth: 0,
        borderColor: "#ccc",
      },
      lineStyle: {
        width: 1,
        color: "#aaaaaa",
      },
      symbolSize: 4,
      symbol: "emptyCircle",
      smooth: false,
      color: [
        "#d87c7c",
        "#919e8b",
        "#d7ab82",
        "#6e7074",
        "#61a0a8",
        "#efa18d",
        "#787464",
        "#cc7e63",
        "#724e58",
        "#4b565b",
      ],
      label: {
        color: "#eeeeee",
      },
    },
    map: {
      itemStyle: {
        areaColor: "#eeeeee",
        borderColor: "#444444",
        borderWidth: 0.5,
      },
      label: {
        color: "#000000",
      },
      emphasis: {
        itemStyle: {
          areaColor: "rgba(255,215,0,0.8)",
          borderColor: "#444444",
          borderWidth: 1,
        },
        label: {
          color: "rgb(100,0,0)",
        },
      },
    },
    geo: {
      itemStyle: {
        areaColor: "#eeeeee",
        borderColor: "#444444",
        borderWidth: 0.5,
      },
      label: {
        color: "#000000",
      },
      emphasis: {
        itemStyle: {
          areaColor: "rgba(255,215,0,0.8)",
          borderColor: "#444444",
          borderWidth: 1,
        },
        label: {
          color: "rgb(100,0,0)",
        },
      },
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    valueAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    logAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    timeAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#333",
        },
      },
      axisLabel: {
        show: true,
        color: "#333",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ["#ccc"],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
      },
    },
    toolbox: {
      iconStyle: {
        borderColor: "#999999",
      },
      emphasis: {
        iconStyle: {
          borderColor: "#666666",
        },
      },
    },
    legend: {
      textStyle: {
        color: "#333333",
      },
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: "#cccccc",
          width: 1,
        },
        crossStyle: {
          color: "#cccccc",
          width: 1,
        },
      },
    },
    timeline: {
      lineStyle: {
        color: "#293c55",
        width: 1,
      },
      itemStyle: {
        color: "#293c55",
        borderWidth: 1,
      },
      controlStyle: {
        color: "#293c55",
        borderColor: "#293c55",
        borderWidth: 0.5,
      },
      checkpointStyle: {
        color: "#e43c59",
        borderColor: "#c23531",
      },
      label: {
        color: "#293c55",
      },
      emphasis: {
        itemStyle: {
          color: "#a9334c",
        },
        controlStyle: {
          color: "#293c55",
          borderColor: "#293c55",
          borderWidth: 0.5,
        },
        label: {
          color: "#293c55",
        },
      },
    },
    visualMap: {
      color: ["#bf444c", "#d88273", "#f6efa6"],
    },
    dataZoom: {
      backgroundColor: "rgba(47,69,84,0)",
      dataBackgroundColor: "rgba(47,69,84,0.3)",
      fillerColor: "rgba(167,183,204,0.4)",
      handleColor: "#a7b7cc",
      handleSize: "100%",
      textStyle: {
        color: "#333333",
      },
    },
    markPoint: {
      label: {
        color: "#eeeeee",
      },
      emphasis: {
        label: {
          color: "#eeeeee",
        },
      },
    },
  });
}

export const echartsOptions = {
  xAxis: {
    type: "category",
    data: [
      "2002",
      "2003",
      "2004",
      "2005",
      "2006",
      "2007",
      "2008",
      "2009",
      "2010",
      "2011",
      "2012",
      "2013",
      "2014",
      "2015",
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
    ],
  },
  yAxis: {
    type: "value",
  },
  toolbox: {
    feature: {
      saveAsImage: {},
      dataView: {},
      restore: {},
      magicType: {
        show: true,
        type: ["line", "bar"],
      },
    },
  },
  series: [
    {
      data: [
        "52",
        "75",
        "115",
        "128",
        "215",
        "339",
        "468",
        "403",
        "570",
        "763",
        "883",
        "989",
        "1120",
        "1367",
        "1345",
        "1448",
        "1603",
        "1730",
        "1850",
        "2039",
      ],
      name: "利息净收入",
      type: "bar",
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
    {
      name: "所得税",
      type: "bar",
      data: [
        "8",
        "12",
        "18",
        "27",
        "32",
        "58",
        "58",
        "41",
        "75",
        "109",
        "142",
        "166",
        "173",
        "170",
        "165",
        "200",
        "256",
        "237",
        "244",
        "273",
      ],
      markLine: {
        data: [{ type: "average" }],
      },
    },
  ],
  legend: {
    show: true,
  },
  tooltip: {
    show: true,
  },
};


export const ThemeJson =
{
    "color": [
        "#516b91",
        "#59c4e6",
        "#edafda",
        "#93b7e3",
        "#a5e7f0",
        "#cbb0e3"
    ],
    "backgroundColor": "rgba(0,0,0,0)",
    "textStyle": {},
    "title": {
        "textStyle": {
            "color": "#516b91"
        },
        "subtextStyle": {
            "color": "#93b7e3"
        }
    },
    "line": {
        "itemStyle": {
            "borderWidth": "2"
        },
        "lineStyle": {
            "width": "2"
        },
        "symbolSize": "6",
        "symbol": "emptyCircle",
        "smooth": true
    },
    "radar": {
        "itemStyle": {
            "borderWidth": "2"
        },
        "lineStyle": {
            "width": "2"
        },
        "symbolSize": "6",
        "symbol": "emptyCircle",
        "smooth": true
    },
    "bar": {
        "itemStyle": {
            "barBorderWidth": 0,
            "barBorderColor": "#ccc"
        }
    },
    "pie": {
        "itemStyle": {
            "borderWidth": 0,
            "borderColor": "#ccc"
        }
    },
    "scatter": {
        "itemStyle": {
            "borderWidth": 0,
            "borderColor": "#ccc"
        }
    },
    "boxplot": {
        "itemStyle": {
            "borderWidth": 0,
            "borderColor": "#ccc"
        }
    },
    "parallel": {
        "itemStyle": {
            "borderWidth": 0,
            "borderColor": "#ccc"
        }
    },
    "sankey": {
        "itemStyle": {
            "borderWidth": 0,
            "borderColor": "#ccc"
        }
    },
    "funnel": {
        "itemStyle": {
            "borderWidth": 0,
            "borderColor": "#ccc"
        }
    },
    "gauge": {
        "itemStyle": {
            "borderWidth": 0,
            "borderColor": "#ccc"
        }
    },
    "candlestick": {
        "itemStyle": {
            "color": "#edafda",
            "color0": "transparent",
            "borderColor": "#d680bc",
            "borderColor0": "#8fd3e8",
            "borderWidth": "2"
        }
    },
    "graph": {
        "itemStyle": {
            "borderWidth": 0,
            "borderColor": "#ccc"
        },
        "lineStyle": {
            "width": 1,
            "color": "#aaa"
        },
        "symbolSize": "6",
        "symbol": "emptyCircle",
        "smooth": true,
        "color": [
            "#516b91",
            "#59c4e6",
            "#edafda",
            "#93b7e3",
            "#a5e7f0",
            "#cbb0e3"
        ],
        "label": {
            "color": "#eee"
        }
    },
    "map": {
        "itemStyle": {
            "areaColor": "#f3f3f3",
            "borderColor": "#516b91",
            "borderWidth": 0.5
        },
        "label": {
            "color": "#000"
        },
        "emphasis": {
            "itemStyle": {
                "areaColor": "#a5e7f0",
                "borderColor": "#516b91",
                "borderWidth": 1
            },
            "label": {
                "color": "#516b91"
            }
        }
    },
    "geo": {
        "itemStyle": {
            "areaColor": "#f3f3f3",
            "borderColor": "#516b91",
            "borderWidth": 0.5
        },
        "label": {
            "color": "#000"
        },
        "emphasis": {
            "itemStyle": {
                "areaColor": "#a5e7f0",
                "borderColor": "#516b91",
                "borderWidth": 1
            },
            "label": {
                "color": "#516b91"
            }
        }
    },
    "categoryAxis": {
        "axisLine": {
            "show": true,
            "lineStyle": {
                "color": "#cccccc"
            }
        },
        "axisTick": {
            "show": false,
            "lineStyle": {
                "color": "#333"
            }
        },
        "axisLabel": {
            "show": true,
            "color": "#999999"
        },
        "splitLine": {
            "show": true,
            "lineStyle": {
                "color": [
                    "#eeeeee"
                ]
            }
        },
        "splitArea": {
            "show": false,
            "areaStyle": {
                "color": [
                    "rgba(250,250,250,0.05)",
                    "rgba(200,200,200,0.02)"
                ]
            }
        }
    },
    "valueAxis": {
        "axisLine": {
            "show": true,
            "lineStyle": {
                "color": "#cccccc"
            }
        },
        "axisTick": {
            "show": false,
            "lineStyle": {
                "color": "#333"
            }
        },
        "axisLabel": {
            "show": true,
            "color": "#999999"
        },
        "splitLine": {
            "show": true,
            "lineStyle": {
                "color": [
                    "#eeeeee"
                ]
            }
        },
        "splitArea": {
            "show": false,
            "areaStyle": {
                "color": [
                    "rgba(250,250,250,0.05)",
                    "rgba(200,200,200,0.02)"
                ]
            }
        }
    },
    "logAxis": {
        "axisLine": {
            "show": true,
            "lineStyle": {
                "color": "#cccccc"
            }
        },
        "axisTick": {
            "show": false,
            "lineStyle": {
                "color": "#333"
            }
        },
        "axisLabel": {
            "show": true,
            "color": "#999999"
        },
        "splitLine": {
            "show": true,
            "lineStyle": {
                "color": [
                    "#eeeeee"
                ]
            }
        },
        "splitArea": {
            "show": false,
            "areaStyle": {
                "color": [
                    "rgba(250,250,250,0.05)",
                    "rgba(200,200,200,0.02)"
                ]
            }
        }
    },
    "timeAxis": {
        "axisLine": {
            "show": true,
            "lineStyle": {
                "color": "#cccccc"
            }
        },
        "axisTick": {
            "show": false,
            "lineStyle": {
                "color": "#333"
            }
        },
        "axisLabel": {
            "show": true,
            "color": "#999999"
        },
        "splitLine": {
            "show": true,
            "lineStyle": {
                "color": [
                    "#eeeeee"
                ]
            }
        },
        "splitArea": {
            "show": false,
            "areaStyle": {
                "color": [
                    "rgba(250,250,250,0.05)",
                    "rgba(200,200,200,0.02)"
                ]
            }
        }
    },
    "toolbox": {
        "iconStyle": {
            "borderColor": "#999999"
        },
        "emphasis": {
            "iconStyle": {
                "borderColor": "#666666"
            }
        }
    },
    "legend": {
        "textStyle": {
            "color": "#999999"
        }
    },
    "tooltip": {
        "axisPointer": {
            "lineStyle": {
                "color": "#cccccc",
                "width": 1
            },
            "crossStyle": {
                "color": "#cccccc",
                "width": 1
            }
        }
    },
    "timeline": {
        "lineStyle": {
            "color": "#8fd3e8",
            "width": 1
        },
        "itemStyle": {
            "color": "#8fd3e8",
            "borderWidth": 1
        },
        "controlStyle": {
            "color": "#8fd3e8",
            "borderColor": "#8fd3e8",
            "borderWidth": 0.5
        },
        "checkpointStyle": {
            "color": "#8fd3e8",
            "borderColor": "#8a7ca8"
        },
        "label": {
            "color": "#8fd3e8"
        },
        "emphasis": {
            "itemStyle": {
                "color": "#8fd3e8"
            },
            "controlStyle": {
                "color": "#8fd3e8",
                "borderColor": "#8fd3e8",
                "borderWidth": 0.5
            },
            "label": {
                "color": "#8fd3e8"
            }
        }
    },
    "visualMap": {
        "color": [
            "#516b91",
            "#59c4e6",
            "#a5e7f0"
        ]
    },
    "dataZoom": {
        "backgroundColor": "rgba(0,0,0,0)",
        "dataBackgroundColor": "rgba(255,255,255,0.3)",
        "fillerColor": "rgba(167,183,204,0.4)",
        "handleColor": "#a7b7cc",
        "handleSize": "100%",
        "textStyle": {
            "color": "#333"
        }
    },
    "markPoint": {
        "label": {
            "color": "#eee"
        },
        "emphasis": {
            "label": {
                "color": "#eee"
            }
        }
    }
}
