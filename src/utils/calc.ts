/* 
    1. 获取用户输入的项， such as 应收款项
    2. 从表单中获取值， such as {"应收款项": [3,3,3,3]}
    3. 根据公式计算表单的值， such as 总营收/应收款项 => [6,6,6,6]/[3,3,3,3]
        数组的：+-*\/() -> calcTwoArray
*/

const isValue = v => /[\u4e00-\u9fa5a-zA-Z0-9]+/.test(v);
import { isDigital, isEmpty } from "./getType";


const Symbols = {
    leftBrackets: "(（",
    rightBrackets: ")）",
    brackets: "()（）",
    operators: "+-*/",
    isLeftBrackets: (v) => Symbols.leftBrackets.indexOf(v) >= 0,
    isRightBrackets: (v) => Symbols.rightBrackets.indexOf(v) >= 0,
    isBrackets: (v) => Symbols.brackets.indexOf(v) >= 0,
    isOperators: (v) => Symbols.operators.indexOf(v) >= 0,

}


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

        ret[index] = a === inValidValue ? inValidValue : +Number(a).toFixed(4);
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

export function miniCalc(listArr: string[], objData: TObjData, ARRAYLENGTH: number): number[] {
    let stack: number[][] = [],
        itemName: number[] | string = "",
        sign = "",
        itemArray: number[] = [];

    while (listArr.length != 0) {
        let currentChar = listArr.shift();
        if (isValue(currentChar)) {
            itemName += currentChar!;
        } else if (Symbols.isLeftBrackets(currentChar)) { // 是左括号
            itemArray = miniCalc(listArr, objData, ARRAYLENGTH);
        }
        // 固定=(固定资产+在建工程)/资产总计;
        if (Symbols.isOperators(currentChar) || listArr.length === 0 || itemArray.length > 0 || Symbols.isRightBrackets(currentChar)) {
            // console.log(`currentChar:${currentChar},sign:${sign}`);
            let topItemArray;
            if (itemName && itemArray.length === 0) { // 有itemArray就先用itemArray，没有再构造
                if (isDigital(itemName)) {
                    itemArray = new Array(ARRAYLENGTH).fill(+itemName); // 如果是数字，则转为[365,365,365,365]
                } else if (typeof itemName === 'string') {
                    itemArray = objData[itemName];
                    if (!isEmpty(itemName) && itemArray === undefined) {
                        console.log(`不存在:【${itemName}】， 项目名称只能是数字、字母和中文`);
                        break;
                    }
                }
            }
            switch (sign) {
                case "+":
                case "": // 第一个，默认加号
                    stack.push(itemArray);
                    break;
                case "-":
                    stack.push(itemArray.map(v => -Number(v)));
                    break;
                case "*":
                    topItemArray = stack.pop();
                    stack.push(mulArr(itemArray, topItemArray));
                    break;
                case "/":
                    topItemArray = stack.pop();
                    stack.push(divArr(topItemArray, itemArray));
                    break;
            }
            // console.log(sign, itemArray, topItemArray, listArr.join(''));
            itemName = "";
            itemArray = [];
            sign = currentChar!;
        }


        if (Symbols.isRightBrackets(currentChar)) break;
    }
    return stack.filter(v => v.length > 0).reduce((a, b) => addArr(a, b));
}

























