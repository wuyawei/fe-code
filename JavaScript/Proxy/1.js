class Dep {
    constructor() {
        this.subs = new Map();
    }
    addSub(key, sub) {
        const hasSub = this.subs.get(key);
        if (hasSub) {
            hasSub.add(sub);
        } else {
            this.subs.set(key, new Set([sub]));
        }
    }
    notify(key) {
        if (this.subs.get(key)) {
            this.subs.get(key).forEach(sub => {
                sub.update();
            });
        }
    }
}
class Watcher {
    constructor(obj, key, cb) {
        this.obj = obj;
        this.key = key;
        this.cb = cb; // 回调
        this.value = this.get(); // 获取老数据
    }
    get() {
        Dep.target = this;
        let value = this.obj[this.key];
        Dep.target = null;
        return value;
    }
    // 将订阅者放入待更新队列等待批量更新
    update() {
        let newVal = this.obj[this.key];
        if (this.value !== newVal) {
            this.cb(newVal);
        }
    }
}
function Observer(obj) {
    Object.keys(obj).forEach(key => { // 做深度监听
        if (typeof obj[key] === 'object') {
            obj[key] = Observer(obj[key]);
        }
    });
    let dep = new Dep();
    let handler = {
        get: function (target, key, receiver) {
            Dep.target && dep.addSub(key, Dep.target);
            return Reflect.get(target, key, receiver);
        },
        set: function (target, key, value, receiver) {
            let result = Reflect.set(target, key, value, receiver);
            dep.notify(key);
            return result;
        }
    };
    return new Proxy(obj, handler)
}
let data = {
    name: '渣渣辉'
};
function print1(data) {
    console.log('我系', data);
}
function print2(data) {
    console.log('我今年', data);
}
data = Observer(data);
new Watcher(data, 'name', print1);
data.name = '杨过'; // 我系 杨过

new Watcher(data, 'age', print2);
data.age = '24'; // 我今年 24
console.log(data);