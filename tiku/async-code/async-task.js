/* 
addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');
*/
const delay = timeout => new Promise((resolve, reject) => setTimeout(resolve, timeout));
const addTask = (time, info) => {
    const fn = async() => {
        await delay(time);
        console.log(info);
    }
    const callback  = () => {
        if(addTask.cache.length) {
            while(addTask.queue.length < 2) {
                addTask.queue.push(addTask.cache.shift());
            }
        }
    }
    const setUp = () => {
        for(let i = 0; i< addTask.queue.length; i++) {
            const f = addTask.queue[i];
            if(!f.start) {
                f.start = true;
                f().then(r => {
                    addTask.queue = addTask.queue.filter(v => v!==f);
                    callback();
                    setUp();
                })
            }
        }
    }
    if(addTask.queue.length < 2) {
        addTask.queue.push(fn);
        setUp();
    } else {
        addTask.cache.push(fn);
    }
}
addTask.queue = [];
addTask.cache = [];

// 保证同时执行的只有两个任务
// 且按照时间顺序打印
// 1000 > 500 + 300 && 1000 < 500 + 300 + 400
// 所以输出顺序 2、3、1、4
addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');