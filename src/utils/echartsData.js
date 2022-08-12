export function retDefaultOptions() {
    return {
        // 需要一个默认的option，且series中需要有一个item，不然reactEcharts不会更新 
        // :https://github.com/apache/echarts/issues/7896 
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [],
        tooltip: {
            trigger: "axis"
        },
        toolbox: {
            right: "8%",
            feature: {
                // saveAsImage: {},
                // magicType: {
                //     show: true,
                //     type: ["line", "bar"]
                // }
            }
        },
        legend: {
            left: 'center'
        },
    }
}

export function retDefaultSerieItem(type = "line", name = "", data = [], config = {
    isShowNumber: true,
    isMarkPoint: false,
    isMarkLine: false,
    isStack: false,
    isPercent: false,
}) {
    let obj = {
        type: type.trim() === "" ? 'line' : type,
        name: name,
        smooth: true,
        data: data,
    };

    if (config.isMarkLine) {
        obj.markLine = {
            data: [{
                type: 'average'
            }]
        }
    }

    if (config.isMarkPoint) {
        obj.markPoint = {
            data: [{
                    type: 'max'
                },
                {
                    type: 'min'
                },
            ]
        }
    }

    if (config.isStack) {
        obj.stack = stackType;
        obj.areaStyle = {};
    }

    if (config.isShowNumber) {
        obj.itemStyle = {
            normal: {
                label: {
                    show: true
                }
            }
        }
    }
    let multiple = 1;
    if (config.isPercent) {
        multiple = 100;
    }
    obj.data = obj.data.map(v => (multiple * v).toFixed(2));
    return obj;
}