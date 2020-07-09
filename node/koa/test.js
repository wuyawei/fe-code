const {a, setA, b, setB} = require('./fn');
console.log("b", b)
console.log("a", a);
setTimeout(() => {
    setA();
    console.log("a", a);
    setB();
    console.log("b", b)
}, 1000);