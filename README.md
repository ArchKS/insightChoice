/*
 * @Author: zendu 
 * @Date: 2022-06-22 18:46:24 
 * @Last Modified by: zendu
 * @Last Modified time: 2022-06-25 14:00:05
 */


Todo
1. Js解析XLSX数据格式
    a.xlsx读取Excel文件，转为table可以辩识的数据格式」
    
    ​		了解xlsx读取的数据格式
    
    ​		了解table接收的数据格式
    
    ​	    编写covert函数
    
    b. 支持表格事件点击
    c. 支持修改值
    d. 支持批量导入
    
2. 将数据形成Table

3. 单张Table的数据可视化

4. 多张Table的数据可视化









# XLSX

1.   JSON
2.   Sheet
3.   Book
4.   XLSX

```javascript
// ====== 1
let json = [
  {name: 'zven',age: 20},
  {name: 'nancy',age: 29},
]

// ====== 2
let sheet = XLSX.utils.json_to_sheet(json);

// ====== 3
let workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook,sheet,"sheetName");

// ====== 4
XLSX.writeFile(workbook,"workbookName.xlsx");
```





# 数据类型

1.   xlsx读取excel文件后生成的数据 BookSheet格式
2.   xlsxt将booksheet转为json后的格式
3.   table所需要的row和column的格式
4.   echarts option需要的格式







Roadmap：

1.   获取数据
2.   提取数据
3.   处理数据
4.   打包数据
5.   发布数据

从HTML现有的Table DOM 提取数据，将其打包为xlsx文件

>   https://docs.sheetjs.com/docs/getting-started/roadmap







# Todo & Done

- [x] 读取Excel文件并转换为Table可以辩识的数据格式

    - [ ] ps：不能用useState，会显示无限循环
- [x] 设定table的单击事件，点击后格式化选中行的数据，并赋值到Echarts图形









- [ ] 整理项目格式，包括Table的操作以及Table Click事件后向Echarts的传参
- [ ] 单表的数据操作，比如叠加`交易性金融资产`和`货币资金`，或纵向的叠加
- [ ] 多表的数据操作，叠加不同表，不同列的数值，比如不同银行不同时间段的ROE






![image-20220625180940297](img/image-20220625180940297.png)





# Reference

xlsx_component  https://docs.sheetjs.com/docs/example/

table_component https://ali-react-table.js.org/docs/table/basic-usage/

explain about xlsx 1  https://www.cnblogs.com/liuxianan/p/js-excel.html

React Data Table Component  https://react-data-table-component.netlify.app/?path=/docs/api-props--page



