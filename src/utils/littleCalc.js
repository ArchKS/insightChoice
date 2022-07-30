//  ['1', '+', '3', '*', '(', '8', '+', '1', ')', '/', '2']
// 计算字符串运算符
function calc(l) {
    if (/^\d/.test(l[0])) { // 如果第一个值不是 运算符，则在开始添加 + 
        l.unshift("+");
    }

    let stack = [],
        num = 0,
        sign = "";


    while (l.length != 0) {
        /* 
            遍历数组，弹出首个元素
            1. 如果当前元素是数字，则合并到num
            2. 如果当前元素是操作符
                +、- 将刚刚的数字加入到栈中
                *、/ 将栈顶的元素取出，做乘法运算后放入栈中
            3. 如果当前元素是小括号
                左括号( : 把l放入calc中计算
                右括号) : 退出循环，返回num的值
        */
        let val = l.shift();
        if (/\d/.test(val)) {
            num = Number(val) + num * 10;
        } else if (val === "(") {
            num = calc(l);
        } else if (val === ")") {
            break;
        }
        if (!/\d/.test(val) || l.length === 1) {
            switch (sign) {
                case "+":
                    stack.push(num);
                    break;
                case "-":
                    stack.push(-num);
                    break;
                case "*":
                    let topVal = stack.pop();
                    stack.push(num * topVal);
                    break;
                case "/":
                    topVal = stack.pop();
                    stack.push(topVal / num);
                    break;
            }
            num = 0;
            sign = val;
        }
        console.log('stack: ', stack); // [+0,]
    }

    return stack.reduce((a, b) => a + b);
}


let s = "3*(8+1)/2"
let l = s.split('');
console.log(l);
let t = calc(l);
console.log('-> res: ', t);