class Dep {
    constructor(){
        this.subs = []; // watcher 观察者集合
    }
    // 订阅
    addSub(watcher){ // 添加 watcher
        this.subs.push(watcher);
    }
    // 发布
    notify(){
        this.subs.forEach(w => w.update());
    }
}

class Watcher{
    constructor(vm,expr,cb){
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        this.value = this.get(); // 保存旧值
    }
    get(){
        Dep.target = this;
        let value = util.getValue(this.vm, this.expr);
        Dep.target = null;
        return value;
    }
    update(){
        let newValue = util.getValue(this.vm,this.expr);
        if(newValue !== this.value){
            this.cb(newValue);
            this.value = newValue;
        }
    }
}