/**
 * Created by wyw on 2019/2/25.
 */
function timeout(ms = 1000, value) {
    return new Promise((resolve) => {
        setTimeout(_ => {resolve(value);}, ms);
    });
}

async function asyncPrint(ms) {
    let value = await timeout(ms);
    console.log(value);
}

function* genPrint(ms) {
    let value = yield timeout(ms, 'hi');
    console.log(value);
    let oh = yield  timeout(ms, 'oh');
    console.log(oh);
    let na = yield  timeout(ms, 'nanana');
    console.log(na);
}

let g = genPrint(1000);
function co(gen) {
    let g = gen();
    function next(data) {
        let res = g.next(data);
        if (res.done) return res.value;
        res.value.then(r => {
            next(r);
        });
    }
    next();
}
co(genPrint);
// asyncPrint(2000, 'hahaha');
