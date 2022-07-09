import { configureStore } from "@reduxjs/toolkit";
import setTable from "./features/setTables";
import setRowIndex from './features/setRowIndex'
import setOption from "./features/setOption" ;
import setDraw from "./features/setDraw" ;



const store = configureStore({
    reducer: {
        setTable: setTable,
        setRowIndex: setRowIndex,
        setOption:setOption,
        setDraw:setDraw,
    },
    middleware: (getDefaultMiddleware)=>[
        ...getDefaultMiddleware({serializableCheck: false}),
    ]
})

export default store;