
type T = "Number" | "String" | "Boolean" | "Array" | "Object" ;

function getType(val:any):T {
    let res =  Object.prototype.toString.call(val); // [object Array]
    let type = / (\w+)]$/.exec(res)?.pop() as T;
    return type;
}


export default getType;