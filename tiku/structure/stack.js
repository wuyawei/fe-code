// 后进先出
class Stack {
    constructor() {
        this.dataStore = [];
    }
    push(ele) {
        this.dataStore.push(ele);
    }
    pop() {
        return this.dataStore.pop();
    }
    peek() {
        return this.dataStore[this.dataStore.length - 1]; // 获取栈顶元素
    }
    clear() {
        this.dataStore = [];
    }
    isEmpty() {
        return this.dataStore.length === 0;
    }
    get size() {
        return this.dataStore.length;
    }
}
