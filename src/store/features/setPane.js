import { createSlice } from '@reduxjs/toolkit';




const initialState = {
    panes: [],
};


export const setPane = createSlice({
    name: 'pane',
    initialState,
    reducers: {
        doSetPane: (state,{payload}) => {
            console.log('set pane.js: ', state, payload);
            state.panes = payload;
        },
    }
})


export const { doSetPane } = setPane.actions;
export default setPane.reducer;