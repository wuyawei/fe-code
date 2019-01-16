function aa(val) {
    console.log(val, arguments)
    val = 1;
    console.log(val, arguments)
    bb(val);
}
function bb(v) {
    console.log(v)
}
let a = 2;
aa(a);
console.log(a);