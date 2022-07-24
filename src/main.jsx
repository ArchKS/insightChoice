import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/antd.less';
import './styles/style.less'
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store} >
        <App />
    </Provider>
);



// setTimeout(() => {
//     // eslint-disable-next-line no-restricted-globals
//     let flag = confirm("是否需要报表数据，点击确定获取");
//     if (flag) {

//         window.open('https://github.com/ArchKS/archks.github.io/tree/master/TABLE',true);
//     }
// }, 1000);



console.log('%c【UPDATE TIME】-> 2022-07-24 16:06:52','color:#5FD068;margin-left: 20%;padding: 20px;');