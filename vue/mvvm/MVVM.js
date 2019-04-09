class Dep { // 发布订阅
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

class Watcher{ // 观察者
    constructor(vm, exp, cb){
        this.vm = vm; // 实例
        this.exp = exp; // 观察数据的表达式
        this.cb = cb; // 更新触发的回调
        this.value = this.get(); // 保存旧值
    }
    get(){
        Dep.target = this;
        let value = resolveFn.getValue(this.vm, this.exp);
        Dep.target = null;
        return value;
    }
    update(){
        let newValue = resolveFn.getValue(this.vm, this.exp);
        if(newValue !== this.value){
            this.cb(newValue);
            this.value = newValue;
        }
    }
}

class Observer{ // 数据劫持
    constructor(data){
        this.observe(data);
    }
    observe(data){
        if(data && typeof data === 'object') {
            if (Array.isArray(data)) {
                data.forEach(v => {
                    this.observe(v);
                });
                return;
            }
            Object.keys(data).forEach(k => {
                this.defineReactive(data, k, data[k]);
            });
        }
    }
    defineReactive(obj, key, value) {
        let that = this;
        this.observe(value);
        let dep = new Dep();
        Object.defineProperty(obj, key, {
            get(){
                console.log(obj, key, Dep.target, dep);
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set(newVal){
                if(newVal !== value) {
                    that.observe(newVal);
                    value = newVal;
                    dep.notify();
                }
            }
        })
    }
}

class Compiler{
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        let fragment = this.createFragment(this.el);
        this.compile(fragment);
        this.el.appendChild(fragment);
    }
    createFragment(node) { // 将 dom 元素，转换成文档片段
        let fragment = document.createDocumentFragment();
        let firstChild;
        while(firstChild = node.firstChild) {
            fragment.appendChild(firstChild);
        }
        return fragment;
    }
    isDirective(attrName) {
        return attrName.startsWith('v-');
    }
    isElementNode(node) { // 是否是元素节点
        return node.nodeType === 1;
    }
    compile(node) {
        let childNodes = node.childNodes;
        [...childNodes].forEach(child=>{
            if(this.isElementNode(child)){
                this.compile(child);
                let attributes = child.attributes; // 获取元素节点的所有属性 v-model class 等
                [...attributes].forEach(attr => { // 以  v-on:click="clear" 为例
                    let {name, value: exp} = attr; // 结构获取 "clear"
                    if(this.isDirective(name)) { // 判断是不是指令属性
                        let [, directive] = name.split('-'); // 结构获取指令部分 v-on:click
                        let [directiveName, eventName] = directive.split(':'); // on，click
                        resolveFn[directiveName](child, exp, this.vm, eventName); // 执行相应指令
                    }
                })
            }else{
                let content = child.textContent;
                if(/\{\{(.+?)\}\}/.test(content)) { // 惰性匹配
                    resolveFn.text(child, content, this.vm);
                }
            }
        });
    }
}

resolveFn = {
    getValue(vm, exp) {
        return exp.split('.').reduce((data, current)=>{
            return data[current];
        }, vm.$data);
    },
    setValue(vm, exp, value) {
        exp.split('.').reduce((data, current, index, arr)=>{
            if(index === arr.length-1) {
                return data[current] = value;
            }
            return data[current];
        }, vm.$data);
    },
    model(node, exp, vm) {
        new Watcher(vm, exp, (newVal) => {
            node.value = newVal;
        });
        node.addEventListener('input', (e) => {
            let value = e.target.value;
            this.setValue(vm, exp, value);
        });
        let value  = this.getValue(vm, exp);
        node.value = value;
    },
    html(node, exp, vm) {
        new Watcher(vm, exp, newVal => {
            node.innerHTML = newVal;
        });
        let value  = this.getValue(vm, exp);
        node.innerHTML = value;
    },
    on(node, exp, vm, eventName) {
        node.addEventListener(eventName, e => {
            vm[exp].call(vm, e);
        })
    },
    text(node, exp, vm) {
        // 惰性匹配，避免连续多个模板时，会直接取到最后一个花括号
        // {{name}} {{age}} 不用惰性匹配 会一次取全 "{{name}} {{age}}"
        // 我们期望的是 ["{{name}}", "{{age}}"]
        let reg = /\{\{(.+?)\}\}/;
        let expr = exp.match(reg);
        node.textContent = this.getValue(vm, expr[1]);
        new Watcher(vm, expr[1], () => {
            node.textContent = this.getValue(vm, expr[1]);
        });
    }
};

class MVVM {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        let computed = options.computed;
        let methods = options.methods;
        let that = this;
        if(this.$el){
            for(let key in computed){
                Object.defineProperty(this.$data, key, {
                    get() {
                        console.log(key);
                        return computed[key].call(that);
                    }
                })
            }
            for(let key in methods){
                Object.defineProperty(this, key, {
                    get(){
                        return methods[key];
                    }
                })
            }
            new Observer(this.$data);
            this.proxyData(this.$data);
            new Compiler(this.$el, this);
        }
    }
    proxyData(data) { // 数据代理
        for(let key in data){
            Object.defineProperty(this, key, {
                get(){
                    return data[key];
                },
                set(newVal){
                    data[key] = newVal;
                }
            })
        }
    }
}