// 扩展运算符、rest运算符
/*let p = [1,2,3];
function test(args) {
    [...args].forEach(v => console.log('test', v));
}
function test1(...args) {
    args.forEach(v => console.log('test1', v));
}*/
// test(p);
// test1(...p);
// 1  2  3

/*let a1 = [1, 2];
let a2 = [...a1];
let [...a3] = a1;*/
// console.log(a2, a3);
// [1, 2]

/*let s = [...'hello'];
console.log(s);*/

/*let dom = document.querySelector('p');
console.log([...dom]);*/

// 数组
// let arrayLike = {
//     '0': 1,
//     '1': 2,
//     '2': 3,
//     length: 3
// };
// let arr2 = Array.from(arrayLike);
// let arr2 = Array.from(arrayLike, v => 2 * v);
// let arr2 = Array.from(arrayLike).map(v => 2 * v);
// console.log(arr2);

// let p = {price: 3};
// let a = [2, 3, 5, 1].find(function(n) { return n > this.price }, p);
// console.log(a);

// let i = 0;
// let a = i++;
// let b = ++i;
// console.log(a, b); // 0 2
