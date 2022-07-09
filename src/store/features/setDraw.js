import { createSlice } from '@reduxjs/toolkit';
import getType from '../../utils/getType'

const initialState = {
    stackType:'all', // 是否堆叠，all | ''
    visible: false,
    hasDrawTag: [], // 已经被选取的tag 
/* [
    {
        "name": "B",
        "tag": [
            "销售费用",
            "管理费用",
            "研发费用"
        ]
    },
    {
        "name": "A",
        "tag": [
            "营业收入",
            "利息收入",
            "手续费及佣金收入"
        ]
    }
] */
};


export const setDraw = createSlice({
    name: 'pane',
    initialState,
    reducers: {
        setVisible: (state,{payload}) => {
            if(getType(payload) !== "Boolean"){
                state.visible = false;
            }else{
                state.visible = payload;
            }
        },
        setHasDrawTag:(state,{payload})=>{
            state.hasDrawTag = payload;
        },
        setStack:(state,{payload})=>{
            state.stackType = payload;
        }
    }
})


export const { setVisible,setHasDrawTag,setStack } = setDraw.actions;
export default setDraw.reducer;