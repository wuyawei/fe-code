let a = 1;
const setA = () => ++a;
const b = {b: 1};
const setB = () => b.b++;
module.exports = {
    a,
    setA,
    b,
    setB
}