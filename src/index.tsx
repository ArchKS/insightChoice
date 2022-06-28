import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/antd.less'; 
import './style.less'
import SideBar from './components/Sidebar/sidebar';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <SideBar />
);