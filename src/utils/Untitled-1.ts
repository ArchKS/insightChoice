/* 
    1. 获取用户输入的项， such as 应收款项
    2. 从表单中获取值， such as {"应收款项": [3,3,3,3]}
    3. 根据公式计算表单的值， such as 总营收/应收款项 => [6,6,6,6]/[3,3,3,3]
        数组的：+-*\/() -> calcTwoArray
*/

const isValue = v => /[\u4e00-\u9fa5a-zA-Z0-9]+/.test(v);
const isDigtal = v => /^[+-]?(\d|([1-9]\d+))(\.\d+)?$/.test(v);

import { isDigital, isEmpty } from "./getType";


// 两个数字类型数组的操作 
// Usage: calcTwoArray([1,2,2,4],[1,2,3,4],"+");
type TCalcArray = any[];
type TOperator = "+" | "-" | "*" | "/";
const calcTwoArray = (arr1: TCalcArray, arr2: TCalcArray, operator: TOperator, inValidValue: any = ""): TCalcArray => {
    if (arr1.length !== arr2.length) {
        throw new Error("两个数组不相等");
    }
    let ret = new Array(arr1.length).fill(0);
    for (let index = 0; index < arr1.length; index++) {
        let a1 = arr1[index],
            a2 = arr2[index],
            a;

        if (!isDigital(a1)) a1 = 0;
        if (!isDigital(a2)) a2 = 0;

        switch (operator) {
            case "+": a = a1 + a2; break;
            case "-": a = a1 - a2; break;
            case "*": a = a1 * a2; break;
            case "/": a = Number(a2) === 0 ? inValidValue : a1 / a2; break;
        }

        ret[index] = a === inValidValue ? inValidValue : +Number(a).toFixed(2);
    }
    return ret;
}

// getRowDatasByTitleObj


const addArr = (arr1: number[], arr2: number[]): number[] => calcTwoArray(arr1, arr2, "+");
const mulArr = (arr1: number[], arr2: number[]): number[] => calcTwoArray(arr1, arr2, "*");
const divArr = (arr1: number[], arr2: number[]): number[] => calcTwoArray(arr1, arr2, "/");

type TObjData = {
    [key: string]: number[]
}
// let obj: TObjData = {
//     "营业收入": [1, 2, 3, 4],
//     "存货价值": [-1, 2, 3, 6]
// }
// let len = obj[Object.keys(obj)[0]].length as number;
// let arrList = "10-(营业收入/存货价值)".split('') as string[];
// let result = miniCalc(arrList, obj, len);

export function miniCalc(listArr: string[], objData: TObjData, ARRAYLENGTH: number): number[] {
    if (isValue(listArr[0])) listArr.unshift("+");
    if (/[()（）]/.test(listArr[0])) listArr.unshift("+");

    let stack: number[][] = [],
        itemName: number[] | string = "",
        sign = "",
        index = 0;
    while (listArr.length != 0) {
        let singleChar = listArr.shift();
        if (isValue(singleChar)) {
            itemName += singleChar!;
        } else if (singleChar === "(" || singleChar === "（") {
            itemName = miniCalc(listArr, objData, ARRAYLENGTH);
            console.log('itemName: ',itemName);
        }

        if (index === 0) {
            sign = singleChar!;
        };

        index++;

        if (itemName && !isValue(singleChar) || listArr.length === 0) {
            let topItemArray;
            let itemNameArray;
            if (isDigtal(itemName)) {
                itemNameArray = new Array(ARRAYLENGTH).fill(+itemName); // 如果是数字，则转为[365,365,365,365]
            } else if (typeof itemName === 'string') {
                itemNameArray = objData[itemName];
                if (!isEmpty(itemName) && itemNameArray === undefined) {
                    // alert(`不存在:【${itemName}】， 项目名称只能是数字、字母和中文`);
                    console.log(`不存在:【${itemName}】， 项目名称只能是数字、字母和中文`);
                    break;
                }

            } else if (typeof itemName === "object") {
                itemNameArray = itemName;
            }

            switch (sign) {
                case "+":
                    stack.push(itemNameArray);
                    break;
                case "-":
                    stack.push(itemNameArray.map(v => -Number(v)));
                    break;
                case "*":
                    topItemArray = stack.pop();
                    stack.push(mulArr(itemNameArray, topItemArray));
                    break;
                case "/":
                    topItemArray = stack.pop();
                    stack.push(divArr(topItemArray, itemNameArray));
                    break;
            }
            itemName = "";
            sign = singleChar!;
        }

        if (singleChar === ")" || singleChar === "）") {
            break;
        }
    }

    let res = stack.reduce((a, b) => addArr(a, b));
    return res;
}

























