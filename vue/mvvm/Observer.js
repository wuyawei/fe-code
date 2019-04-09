/**
 * Created by wyw on 2019/3/10.
 */
// 在需要订阅的地方（如：模版编译），添加观察者（watcher），并立刻通过取值触发指定属性的get方法，从而将观察者添加进订阅系统Dep，然后在 Set 的时候，进行 notify，通知给所有观察者进行响应的update
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