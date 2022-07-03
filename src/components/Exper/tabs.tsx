// @ts-nocheck
import { Button, Tabs } from 'antd';
import { useRef, useState } from 'react';
const { TabPane } = Tabs;


const defaultPanes = [
  {
    title: `Tab 1`,
    content: `Content of Tab Pane 1`,
    key: 1,
  },
  {
    title: `Tab 2`,
    content: `Content of Tab Pane 2`,
    key: 2,
  }
]

export default function CxsTab() {
  const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
  const [panes, setPanes] = useState(defaultPanes);
  const newTabIndex = useRef(0);

  const onChange = (key) => {
    setActiveKey(key);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    setPanes([
      ...panes,
      {
        title: 'New Tab',
        content: 'New Tab Pane',
        key: newActiveKey,
      },
    ]);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey) => {
    const targetIndex = panes.findIndex((pane) => pane.key === targetKey);
    const newPanes = panes.filter((pane) => pane.key !== targetKey);

    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
      setActiveKey(key);
    }

    setPanes(newPanes);
  };

  const onEdit = (targetKey, action ) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <div>
      <Tabs onChange={onChange} activeKey={activeKey} type="editable-card" onEdit={onEdit}>
        {panes.map((pane) => (<TabPane tab={pane.title} key={pane.key}>{pane.content} </TabPane>
        ))}
      </Tabs>
    </div>
  );
};
