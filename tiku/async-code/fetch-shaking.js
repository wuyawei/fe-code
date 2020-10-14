const delay = timeout => new Promise((resolve, reject) => setTimeout(resolve, timeout));
const onChange = () => {
    let f = 0;
    let queue = [];
    return function (time) {
        const i = f++;
        queue.push(i);
        delay(time).then(() => {
            if (queue.includes(i)) {
                console.log('change', time);
            }
        }).finally(() => {
            queue = queue.filter(v => v > i);
        });
    };
};

const change = onChange();

// 最快返回的异步操作执行完后，先发出暂未返回的全部删掉
async function run() {
    change(500);
    await delay(100);
    change(100);
    await delay(50);
    change(300);
}
run();
// change(500);
// change(100);
// change(100);
// change(100);

const defferd = () => {
    const dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}
// const dfd = defferd();
// dfd.promise.then(r => {
//     console.log(r);
// });
// dfd.resolve(333);

// 另一种写法
const addTaskFn = () => {
    const queue = [];
    return (time) => {
        const dfd = defferd();
        queue.push(dfd);
        dfd.promise.then(() => {
            console.log('addTask-resolve', time);
            const i = queue.indexOf(dfd);
            queue.splice(0, i+1).forEach(d => d.reject());
        }).catch(() => {
            console.log('addTask-reject', time);
        })
        delay(time).then(() => {
            dfd.resolve();
        })
    }
}

const addTask = addTaskFn();

// 最快返回的异步操作执行完后，先发出暂未返回的全部删掉
async function runTask() {
    addTask(500);
    addTask(600);
    await delay(50);
    addTask(300);
}
runTask();