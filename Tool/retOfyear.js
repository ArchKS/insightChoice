// 计算年化收益率r
let argv = process.argv;
let a = 0; // 本金
let b = 0; // 收益+本金
let c = 0; // 年限


[_, __, a, b, c] = argv;

let r = Math.pow(b / a, 1 / c) - 1 ;
r = (r * 100).toFixed(2) + '%';

console.log(r);

