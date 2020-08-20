/* 
let task1 = function (next) {
  setTimeout(() => {
    console.log(1);
    next();
  }, 1000);
};

let tast2 = function (next, num) {
  setTimeout(() => {
    console.log(num);
    next();
  }, 3000);
};

let task = new Task();
task.add(task1).add(tast2, null, 2);
task.run();
// 其中 next 表示执行下一个方法
// 一秒后输出1,再过三秒后输出2
*/

const delay = timeout => new Promise((resolve, reject) => setTimeout(resolve, timeout));
class Task {
    constructor() {
        this.queue = [];
    }
    add(fn, context, ...args) {
        this.queue.push((next = () => {}) => fn.bind(context, next, ...args));
        return this;
    }
    stop(time) {
        this.queue.push((next = () => {}) => () => {
            console.log(`现在暂停${time}`);
            setTimeout(next, time);
        })
        return this;
    }
    run(fn) {
        const compose = arr => arr.reduce((pre, cur) => (...args) => pre(cur(...args)));
        const task = compose(this.queue)(fn);
        task();
    }
}
let task1 = function (next) {
    console.log('task1')
    setTimeout(() => {
      console.log(1);
      next();
    }, 1000);
  };
  
  let tast2 = function (next, num) {
      console.log('tast2')
    setTimeout(() => {
      console.log(num);
      next();
    }, 3000);
  };
  
let task = new Task();
task.add(task1).stop(2000).add(tast2, null, 2);
task.run(() => {
    console.log('done');
});
