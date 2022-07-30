// 计算数组 
const isValue = v => /[\u4e00-\u9fa5a-zA-Z0-9]+/.test(v);
const isDigtal = v => /^[+-]?(\d|([1-9]\d+))(\.\d+)?$/.test(v);

const isDigital = (val) => {
    return /^[+-]?\d+(\.\d+)?$/.test(val);
}

const calcTwoArray = (arr1, arr2, operator, inValidValue = "") => {
  operator
  arr1
  arr2

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
            case "+":
                a = a1 + a2;
                break;
            case "-":
                a = a1 - a2;
                break;
            case "*":
                a = a1 * a2;
                break;
            case "/":
                a = Number(a2) === 0 ? inValidValue : a1 / a2;
                break;
        }

        ret[index] = a === inValidValue ? inValidValue : +Number(a).toFixed(2);
    }
    return ret;
}

// getRowDatasByTitleObj


const addArr = (arr1, arr2) => calcTwoArray(arr1, arr2, "+");
const mulArr = (arr1, arr2) => calcTwoArray(arr1, arr2, "*");
const divArr = (arr1, arr2) => calcTwoArray(arr1, arr2, "/");


let obj = {
    "营业收入": [1, 2, 3, 4],
    "存货价值": [-1, 2, 3, 6]
}
let len = obj[Object.keys(obj)[0]].length;
let arrList = "10-(营业收入/存货价值)".split('');
console.log(arrList, obj, len);
let result = miniCalc(arrList, obj, len);
result

export function miniCalc(listArr, objData, ARRAYLENGTH) {
    if (isValue(listArr[0])) listArr.unshift("+");
    let stack = [],
        itemName = "",
        sign = "",
        index = 0;
    while (listArr.length != 0) {
        let singleChar = listArr.shift();

        if (isValue(singleChar)) {
            itemName += singleChar;
        } else if (singleChar === "(") {
            itemName = miniCalc(listArr, objData, ARRAYLENGTH);
        }

        if (index === 0) {
            sign = singleChar;
        };

        index++;

        if (itemName && !isValue(singleChar) || listArr.length === 0) {
          let topItemArray;
          let itemNameArray;
          if (isDigtal(itemName)) {
            itemNameArray = new Array(ARRAYLENGTH).fill(+itemName); // 如果是数字，则转为[365,365,365,365]
          } else if (typeof itemName === 'string') {
            itemNameArray = obj[itemName];
          } else if (typeof itemName === "object") {
            itemNameArray = itemName;
          }
          itemName
          itemNameArray
          singleChar

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
            sign = singleChar;
        }

        if (singleChar === ")") {
            break;
        }
    }
    stack

    return stack.reduce((a, b) => addArr(a, b));
}