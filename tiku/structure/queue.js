// 先进先出
class Queue {
    constructor() {
        this.dataStore = [];
    }
    enqueue(ele) {
        this.dataStore.push(ele);
    }
    dequeue() {
        return this.dataStore.shift();
    }
    isEmpty() {
        return this.dataStore.length === 0;
    }
    front(){
        // 队列首元素
        return this.dataStore[0]
    }
    get size() {
        return this.dataStore.length;
    }
}
