// let reg = /12{3,4}5/g;
// console.log('12225'.match(reg));


let reg = /12[34]5/g;
console.log('12225'.match(reg)); // null
console.log('1235'.match(reg)); // [ '1235' ]