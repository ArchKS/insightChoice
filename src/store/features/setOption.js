import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    option: {}
};


export const setOption = createSlice({
    name: 'options',
    initialState,
    reducers: {
        resetOption: (state,{payload}) => {
            state.option = payload;
        },
        clearOption:(state)=>{
            state.option = {
                // 需要一个默认的option，且series中需要有一个item，不然reactEcharts不会更新 
                // :https://github.com/apache/echarts/issues/7896 
                xAxis: {
                  type: 'category',
                  data: []
                },
                yAxis: {
                  type: 'value'
                },
                series: [{
                  type: "line",
                  data: []
                }],
                tooltip: {
                  trigger: "axis",
                }
              }
        }
    }
})


export const { resetOption,clearOption } = setOption.actions;
export default setOption.reducer;