import { configureStore } from "@reduxjs/toolkit";
import setTable from "./features/setTables";
import setRowIndex from './features/setRowIndex'
import setOption from "./features/setOption" ;



const store = configureStore({
    reducer: {
        setTable: setTable,
        setRowIndex: setRowIndex,
        setOption:setOption
    },
    middleware: (getDefaultMiddleware)=>[
        ...getDefaultMiddleware({serializableCheck: false}),
    ]
})

export default store;