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
    constructor(vm, expr, cb){
        this.vm = vm; // 实例
        this.expr = expr; // 观察数据的表达式
        this.cb = cb; // 更新触发的回调
        this.value = this.get(); // 保存旧值
    }
    get(){
        Dep.target = this;
        let value = utils.getValue(this.vm, this.expr);
        Dep.target = null;
        return value;
    }
    update(){
        let newValue = utils.getValue(this.vm, this.expr);
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
        let fragment = this.node2fragment(this.el);
        this.compile(fragment);
        this.el.appendChild(fragment);
    }
    isDirective(attrName) {
        return attrName.startsWith('v-');
    }
    compileElement(node) {
        let attributes = node.attributes;
        [...attributes].forEach(attr=>{
            let {name, value: expr} = attr;
            if(this.isDirective(name)) {
                let [, directive] = name.split('-');
                let [directiveName, eventName] = directive.split(':');
                utils[directiveName](node, expr, this.vm, eventName);
            }
        })
    }
    compileText(node) {
        let content = node.textContent;
        if(/\{\{(.+?)\}\}/.test(content)){ // 惰性匹配
            utils['text'](node, content, this.vm);
        }
    }
    compile(node) {
        let childNodes = node.childNodes;
        [...childNodes].forEach(child=>{
            if(this.isElementNode(child)){
                this.compileElement(child);
                this.compile(child);
            }else{
                this.compileText(child);
            }
        });
    }
    node2fragment(node) {
        let fragment = document.createDocumentFragment();
        let firstChild;
        while(firstChild = node.firstChild) {
            fragment.appendChild(firstChild);
        }
        return fragment;
    }
    isElementNode(node) {
        return node.nodeType === 1;
    }
}

utils = {
    getValue(vm, expr) {
        return expr.split('.').reduce((data, current)=>{
            return data[current];
        }, vm.$data);
    },
    setValue(vm, expr, value) {
        expr.split('.').reduce((data, current, index, arr)=>{
            if(index === arr.length-1) {
                return data[current] = value;
            }
            return data[current];
        }, vm.$data);
    },
    model(node, expr, vm) {
        new Watcher(vm, expr, (newVal) => {
            this.modelUpdater(node, newVal);
        });
        node.addEventListener('input', (e) => {
            let value = e.target.value;
            this.setValue(vm, expr, value);
        });
        let value  = this.getValue(vm, expr);
        this.modelUpdater(node, value);
    },
    html(node, expr, vm) {
        new Watcher(vm, expr, newVal => {
            this.htmlUpdater(node, newVal);
        });
        let value  = this.getValue(vm, expr);
    },
    getContentValue(vm, expr) {
        return expr.replace(/\{\{(.+?)\}\}/g, (...args)=>{
            return this.getValue(vm, args[1]);
        })
    },
    on(node, expr, vm, eventName) {
        node.addEventListener(eventName, e => {
            vm[expr].call(vm, e);
        })
    },
    text(node, expr, vm) {
        let content = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
            new Watcher(vm, args[1],() => {
                this.textUpdater(node, this.getContentValue(vm, expr));
            });
            return this.getValue(vm, args[1]);
        });
        this.textUpdater(node, content);
    },
    htmlUpdater(node, value) {
        node.innerHTML = value;
    },
    modelUpdater(node, value) {
        node.value = value;
    },
    textUpdater(node, value) {
        node.textContent = value;
    }
};

class MVVM {
    constructor(options){
        this.$el = options.el;
        this.$data = options.data;
        let computed = options.computed;
        let methods = options.methods;
        if(this.$el){
            new Observer(this.$data);
            for(let key in computed){
                Object.defineProperty(this.$data,key,{
                    get:()=>{
                        return computed[key].call(this);
                    }
                })
            }

            for(let key in methods){
                Object.defineProperty(this,key,{
                    get(){
                        return methods[key]
                    }
                })
            }
            this.proxyVm(this.$data);

            new Compiler(this.$el,this);
        }
    }
    proxyData(data) { // 数据代理
        for(let key in data){
            Object.defineProperty(this,key,{
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