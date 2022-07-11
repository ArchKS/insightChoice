// @ts-nocheck
import React from "react";
import {
  AreaChartOutlined,
  PieChartOutlined,
  RiseOutlined,
  AlignRightOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useState } from "react";
import { TABLENAME } from "../utils/Variable";

const items = [
    {
        key: 1,
        label: '目录',
        icon: <AlignRightOutlined />
    },{
        key: 2,
        label: TABLENAME.BALANCETABLE.name,
        icon: <PieChartOutlined />
    },{
        key: 3,
        label: TABLENAME.CASHFLOWTABLE.name,
        icon: <AreaChartOutlined />
    },{
        key: 4,
        label: TABLENAME.INCOMETABLE.name,
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
