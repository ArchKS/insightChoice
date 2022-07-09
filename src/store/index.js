import { configureStore } from "@reduxjs/toolkit";
import setTable from "./features/setTables";
import setRowIndex from './features/setRowIndex'
import setOption from "./features/setOption" ;
import setPane from "./features/setPane" ;



const store = configureStore({
    reducer: {
        setTable: setTable,
        setRowIndex: setRowIndex,
        setOption:setOption,
        setPane:setPane,
    },
    middleware: (getDefaultMiddleware)=>[
        ...getDefaultMiddleware({serializableCheck: false}),
    ]
})

export default store;