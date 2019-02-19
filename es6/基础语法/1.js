let p = [1,2,3];
function test(args) {
    [...args].forEach(v => console.log('test', v));
}
function test1(...args) {
    args.forEach(v => console.log('test1', v));
}
test(p);
test1(...p);