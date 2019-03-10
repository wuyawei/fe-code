/**
 * Created by wyw on 2019/3/10.
 */
// 在添加观察者(watcher)的时候，通过取值触发指定data数据的get方法，从而初始化订阅系统（Dep）。此时因为defineProperty时的get方法形成了闭包，所以会收集对应的watcher。然后在set方法触发时，调用发布方法，进行相应的数据更新操作。
// 通过一个例子来弄懂这个原理 也是发布订阅的核心
class Dep{
    constructor() {
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    notify() {
        console.log(this.subs);
    }
}
function observer(data, key, val) {
    let dep = new Dep();
    Object.defineProperty(data, key, {
        get() {
            Dep.target && dep.addSub(Dep.target);
            return val;
        },
        set(newval) {
            val = newval;
            dep.notify();
        }
    })
}

let obj = {name: 'a', age: 18, sex: 'man'};
Object.keys(obj).forEach(k => {
   observer(obj, k, obj[k]);
});

Dep.target = 1;
console.log(obj.name);
Dep.target = null;

Dep.target = 2;
console.log(obj.age);
Dep.target = null;

obj.name = 'b';
obj.age = 32;
obj.name = 'cccccc';
console.log(obj.name, obj.age);