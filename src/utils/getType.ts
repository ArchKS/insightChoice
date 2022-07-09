
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