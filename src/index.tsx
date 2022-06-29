import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/antd.less'; 
import './style.less'
import LyTableC from './components/LyTable/LyTable';
// import SideBar from './components/Sidebar/sidebar';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <App />
);