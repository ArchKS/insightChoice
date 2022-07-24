
type T = "Number" | "String" | "Boolean" | "Array" | "Object";

function getType(val: any): T {
    let res = Object.prototype.toString.call(val); // [object Array]
    let type = / (\w+)]$/.exec(res)?.pop() as T;
    return type;
}


export default getType;

// 是Empty返回true，不是返回false
export function isEmpty(val: any) {
    let valType = getType(val);
    let flag: boolean;
    switch (valType) {
        case "Number": flag = val === 0 ? true : false; break;
        case "String": flag = val.trim() === "" ? true : false; break;
        case "Boolean": flag = val; break;
        case "Object": flag = JSON.stringify(val) === "{}" ? true : false; break;
        case "Array": flag = JSON.stringify(val) === "[]" ? true : false; break;
    }
    return flag
}

export const deepClone = <T>(Op: T): T => {
    /* ps JSON.stringfy & parse have some bug */
    /* 1. delete Symbol Type */
    /* 2. error with BigInt Type */
    /* 3. change re to empty object */
    /* 4. change data type to string */
    /* 5. delete undefined type */

    let res: any;
    if (getType(Op) === "Object") {
        res = {};
    } else if (getType(Op) === "Array") {
        res = [];
    }

    let keys = [
        ...Object.keys(Op),
        ...Object.getOwnPropertySymbols(Op)
    ];

    keys.forEach((key: any) => {
        // @ts-ignore
        let item = Op[key];
        if (getType(item) === 'Object') {
            res[key] = deepClone(item);
        } else {
            res[key] = item;
        }
    })
    return res;
}

export const isDigital = (val: any): Boolean => {
    return /^[+-]?\d+(\.\d+)?$/.test(val);
}