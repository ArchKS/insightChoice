import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/antd.less';
import './styles/style.less'
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import './icons/iconfont.css'
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store} >
        <App />
    </Provider>
);

console.log('%c【UPDATE TIME】-> 2023年7月21日14:15:58','color:#5FD068;margin-left: 20%;padding: 20px;');