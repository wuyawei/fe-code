/* 
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const subFlow = createFlow([() => delay(1000).then(() => log("c"))]);

createFlow([
  () => log("a"),
  () => log("b"),
  subFlow,
  [() => delay(1000).then(() => log("d")), () => log("e")],
]).run(() => {
  console.log("done");
});

// 需要按照 a,b,延迟1秒,c,延迟1秒,d,e, done 的顺序打印
*/
var { log } = console;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createFlow = (arr) => {
    const queue = arr.flat();
    const run = async (done) => {
        done && queue.push(done);
        for(let i = 0; i < queue.length; i++) {
            const fn = queue[i];
            if (typeof fn.run === 'function') {
                await fn.run();
            } else {
                await fn();
            }
        }
    }
    return {
        run
    };
};
const createFlow1 = (arr) => {
    const queue = arr.flat();
    const run = (done) => {
        done && queue.push(done);
        let p = Promise.resolve();
        for(let i = 0; i < queue.length; i++) {
            const fn = queue[i];
            if (typeof fn.run === 'function') {
                p = p.then(() => fn.run())
            } else {
                p = p.then(() => fn());
            }
        }
        return p;
    }
    return {
        run
    };
};


const subFlow = createFlow([() => delay(1000).then(() => log("c"))]);
createFlow([
    () => log("a"),
    () => log("b"),
    subFlow,
    [() => delay(1000).then(() => log("d")), () => log("e")],
  ]).run(() => {
    console.log("done");
}); 