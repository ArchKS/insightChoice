import { createSlice } from '@reduxjs/toolkit';




const initialState = {
    selectIndex: [],
};


export const setRowIndex = createSlice({
    name: 'row',
    initialState,
    reducers: {
        setIndex: (state,{payload}) => {
            state.selectIndex = payload;
        },
    }
})


export const { setIndex } = setRowIndex.actions;
export default setRowIndex.reducer;