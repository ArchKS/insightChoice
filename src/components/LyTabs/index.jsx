import React, { Component } from "react";
import Tabs from "react-draggable-tabs";
import ReactDOM from "react-dom";

export default class LyTabs extends Component {
  constructor(props) {
    super(props);
    this.moveTab = this.moveTab.bind(this);
    this.selectTab = this.selectTab.bind(this);
    this.closedTab = this.closedTab.bind(this);
    this.addTab = this.addTab.bind(this);
    this.state = {
      tabs: [
        {
          id: 1,
          content: "tab 1",
          active: true,
          display: (
            <h1> id 1</h1>
          )
        },
        {
          id: 2,
          content: "tab 2",
          display: (
            <h1>id 2</h1>
          )
        },
        {
          id: 3,
          content: "tab 3",
          display: (
            <h1>id 3</h1>
          )
        }
      ]
    };
  }

  moveTab(dragIndex, hoverIndex) {
    this.setState((state, props) => {
      let newTabs = [...state.tabs]
      newTabs.splice(hoverIndex, 0, newTabs.splice(dragIndex, 1)[0]);

      return { tabs: newTabs };
    });
  }

  selectTab(selectedIndex, selectedID) {
    this.setState((state, props) => {
      const newTabs = state.tabs.map(tab => ({
        ...tab,
        active: tab.id === selectedID
      }));
      return { tabs: newTabs };
    });
  }

  closedTab(removedIndex, removedID) {
    this.setState((state, props) => {
      let newTabs = [...state.tabs];
      newTabs.splice(removedIndex, 1);

      if (state.tabs[removedIndex].active && newTabs.length !== 0) {
        // automatically select another tab if needed
        const newActive = removedIndex === 0 ? 0 : removedIndex - 1;
        newTabs[newActive].active = true;
      }

      return { tabs: newTabs };
    });
  }

  addTab() {
    this.setState((state, props) => {
      let newTabs = [...state.tabs];
      newTabs.push({
        id: newTabs.length + 1,
        content: "Cute *",
        display: <div key={newTabs.length + 1}>Cute *</div>
      });

      return { tabs: newTabs };
    });
  }
  
  render() {
    const activeTab = this.state.tabs.filter(tab => tab.active === true);
    return (
      <div>
        <Tabs
          moveTab={this.moveTab}
          selectTab={this.selectTab}
          closeTab={this.closedTab}
          tabs={this.state.tabs}
        >
          <button onClick={this.addTab}>+</button>
        </Tabs>
        {activeTab.length !== 0 ? activeTab[0].display : ""}
      </div>
    );
  }
}

