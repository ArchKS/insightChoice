import { createSlice } from '@reduxjs/toolkit';

// interface iTable {
//     fileName: string;
//     columns: any[];
//     dataSource: any[];
// }

const initialState = {
    AppTables: [],
    ActiveTable: {}
};


export const setTable = createSlice({
    name: 'table',
    initialState,
    reducers: {
        addTable: (state,{payload}) => {
            state.AppTables.push(payload);
            state.ActiveTable = payload;
        },
        removeTable: (state,{payload}) => {
            // payload as tab key string
            let index = 0;
           

            for(let i=0; i<state.AppTables.length; i++) {
                let item = state.AppTables[i];
                if(item.fileName === payload){
                    index = i;
                }
            }

            let activeIndex = 0;
            if(index===0){
                activeIndex = 0;
            }else if(index === state.AppTables.length-1){
                activeIndex = state.AppTables.length -2;
            }else{
                activeIndex = index-1;
            }

            state.AppTables.splice(index, 1); // 删除第i个元素
            state.ActiveTable = state.AppTables[activeIndex];
        },
        changeTable: (state,{payload})=>{
            let index = 0;
            for(let i=0; i<state.AppTables.length; i++) {
                let item = state.AppTables[i];
                if(item.fileName === payload){
                    index = i;
                }
            }

            state.ActiveTable = state.AppTables[index];
        }
    }
})


export const { addTable, removeTable,changeTable } = setTable.actions;
export default setTable.reducer;