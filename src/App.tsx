import React, { useState } from "react";
import Sidebar from './components/Sidebar/sidebar';
import LyTabs from './components/LyTabs/tab';

function App() {

  return (
    <div className="App">
      <div className="left_wrapper">
        <Sidebar></Sidebar>
      </div>
      <div className="right_wrapper">
        <div className="top">
          <LyTabs ></LyTabs>
        </div>
        <div className="bottom"></div>
      </div>
    </div>
  );
}
export default App;

