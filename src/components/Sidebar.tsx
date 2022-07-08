// @ts-nocheck
// import React from 'react';

// export default class SideBar extends React.Component {

//     state = {
//         isMenuOpen: false
//     }
//     render(){
//       return  (
//             <div>
//                 {this.state.isMenuOpen ? <div>menu open</div> : <div>menu is not open</div>}                
//             </div>
//         )
//     }
// }

import React from "react";
import {
  AreaChartOutlined,
  PieChartOutlined,
  RiseOutlined,
  AlignRightOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useState } from "react";

const items = [
    {
        key: 1,
        label: '目录',
        icon: <AlignRightOutlined />
    },{
        key: 2,
        label: '资产负债表',
        icon: <PieChartOutlined />
    },{
        key: 3,
        label: '现金流量表',
        icon: <AreaChartOutlined />
    },{
        key: 4,
        label: '利润表',
        icon: <RiseOutlined />
    }
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const clickMenuButton = (obj)=>{
    let {key} = obj;
    if(Number(key) === 1){
        toggleCollapsed();
    }
  }

  return (
    <div className="sidebar">
      <Menu
       className='menubar'
        defaultSelectedKeys={["1"]}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
        onClick={clickMenuButton}
      />
    </div>
  );
};

export default Sidebar;
