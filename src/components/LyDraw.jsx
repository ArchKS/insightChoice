import * as React from 'react'
import { Drawer, Button, Tag, Input, Switch } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setVisible, setHasDrawTag } from '../store/features/setDraw';
import { getAllColumnName, getRandomColor, level1AndLevel2Combina } from '../utils/dataConvert'
import { resetOption } from '../store/features/setOption'
const { CheckableTag } = Tag;
/* 
    tag有两种
    1. 上面未分组过的
    2. 下面分组过的


*/
const LyDraw = () => {
    const dispatch = useDispatch();

    const { visible } = useSelector(store => store.setDraw);
    const { ActiveTable } = useSelector(store => store.setTable);
    const { hasDrawTag } = useSelector(store => store.setDraw);
    let [selectedTags, setSelectedTags] = React.useState([]);
    let [itemName, setItemName] = React.useState('');
    let [stackType, setStackType] = React.useState('stack');

    // 标记未分类tag：从所有tag中过滤出已经分类的tag
    let TableTags = getAllColumnName(ActiveTable);
    let FlatenHasDrawTag = hasDrawTag.map(v => v.tag).flat(1);
    let haveNotSelectedTags = [];
    for (let tag of TableTags) {
        if (FlatenHasDrawTag.indexOf(tag) === -1) {
            haveNotSelectedTags.push(tag);
        }
    }
    let [reminderTags, setReminderTags] = React.useState(haveNotSelectedTags);


    const onClose = () => {
        dispatch(setVisible(false));
    };

    /* 提交 */
    // 1. 构造multiObj 即 "资产":["货币","交易性金融资产"...]的形式
    // 2. 根据multiObj和table生成echarts option
    // 3. 设置抽屉为不可视
    const doSubmit = () => {
        let multiLevelObj = {};
        for (let v of hasDrawTag) {
            multiLevelObj[v.name] = v.tag;
        }
        let cpObj = JSON.parse(JSON.stringify(multiLevelObj));
        let opt = level1AndLevel2Combina(ActiveTable, cpObj, 'bar', stackType);
        dispatch(resetOption(JSON.parse(JSON.stringify(opt))));
        dispatch(setVisible(false));
    }


    const handleChange = (tag, checked) => {
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter((t) => t !== tag);
        setSelectedTags(nextSelectedTags);
    };

    // 点击在itemarea添加item
    // 1. 构造新item的对象格式
    // 2. 清空输入框
    // 3. 移出已经用过的标签
    // 4. 清空选择的标签下标
    // 5. 设置标签和新对象
    const addItem = () => {
        let newObj = [{ name: itemName, tag: selectedTags }, ...hasDrawTag]
        dispatch(setHasDrawTag(newObj));

        setItemName('') // 清空输入框
        let newTag = JSON.parse(JSON.stringify(reminderTags))
        for (let tag of selectedTags) { // 将选中的标签从上面删除
            let index = newTag.indexOf(tag);
            newTag.splice(index, 1);
        }
        setSelectedTags([]);
        setReminderTags(newTag);
    }
    const changeStackType = (checked) => {
        if (checked) {
            setStackType("all");
        } else {
            setStackType("");
        }
    }


    return (
        <div>
            <Drawer title="自定义分组" placement={'top'} closable={false} onClose={onClose} visible={visible} height={600} key={'top'} >

                <div className="tags_wrapper"> {
                    reminderTags.map((s) => {
                        return <CheckableTag
                            key={s}
                            checked={selectedTags.indexOf(s) > -1}
                            onChange={(checked) => handleChange(s, checked)}
                            color={getRandomColor()}
                        >{s}</CheckableTag>
                    })}
                </div>
                <div className="input_wrapper">
                    <Input placeholder="item name" value={itemName} onChange={(e) => { setItemName(e.target.value) }} />
                    <button type='primary' onClick={addItem} className="add_item_btn">Add Item</button>
                </div>

                <div className="group_wrapper">
                    {hasDrawTag.map((v) => {
                        let name = v.name;
                        let tags = v.tag;
                        return <p key={name}>
                            <Tag color={"orange"}>{name}</Tag>  {tags.map(t => <Tag color={"geekblue"} key={t}>{t}</Tag>)}
                        </p>
                    })}
                </div>
                <div className="submit_wrapper">
                    <Button type='primary' onClick={doSubmit} >SUBMIT</Button>
                </div>
                <div className="switch_wrapper">
                   是否堆叠  <Switch defaultChecked onChange={changeStackType}/>
                </div>
            </Drawer>
        </div>
    );
};

export default LyDraw;