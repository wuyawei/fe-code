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
// let obj = { // 给对象添加迭代器
//     [Symbol.iterator]() {
//         return {
//             next: function () {
//                 return {
//                     value: 'hahaha',
//                     done: false
//                 };
//             }
//         };
//     }
// };
// for (let v of obj) {
//     console.log(v)
// }
// let arr = [{name: 'a', id: '1'}, {name: 'a', id: '2'}];
// let f1 = arr.every(v => {
//    return v.id === '1';
// });
// let f2 = arr.some(v => {
//     return v.id === '1';
// });
// let f3 = arr.filter(v => {
//     return v.id === '1';
// });
// let f4 = arr.map(v => {
//     return v.id;
// });
// console.log(f1,f2,f3,f4);

let arr = [{name: '红烧牛肉饭', price: 29}, {name: '黄焖鸡米饭', price: 22}, {name: '农家小炒肉', price: 28}];
let price_all = arr.reduce((prev, curr, index, arr) => {
    return prev + curr.price;
}, arr[0].price);
console.log(price_all);

let goods = arr.reduce((prev, curr, index, arr) => {
    if (index === arr.length -1) {
        return prev + curr.name;
    }
    return prev + curr.name + ' + ';
}, '您选择的商品为：');

console.log(goods);
