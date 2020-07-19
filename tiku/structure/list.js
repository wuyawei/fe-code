class List{
    constructor() {
        this.dataStore = [];
        this.listSize = 0;
        this.pos = 0;
    }
    get length() {
        return this.listSize;
    }
    clear() {
        this.dataStore = [];
        this.listSize = 0;
        this.pos = 0;
    }
    find(ele) {
        return this.dataStore.indexOf(ele);
    }
    append(ele) {
        this.dataStore[this.listSize++] = ele;
    }
    remove(ele) {
        this.dataStore = this.dataStore.filter(e => e !== ele);
    }
    insert(ele, after) {
        const index = this.find(after);
        if (index > -1) {
            this.dataStore.splice(index+1, 0, ele);
            return true;
        }
        return false;
    }
    contains(ele) {
        return this.find(ele) !== -1;
    }
    front() {
        this.pos = 0;
    }
    end() {
        this.pos = this.listSize - 1;
    }
    prev() {
        if (this.pos >= 0) {
            this.pos--;
        }
    }
    hasPrev() {
        return this.pos > 0;
    }
    next() {
        if (this.pos < this.listSize) {
            this.pos++;
        }
    }
    hasNext() {
        return this.pos < this.listSize;
    }
    moveTo(to){
        this.pos = to;
    }
    currPos() {
        return this.pos;
    }
    getElement() {
        return this.dataStore[this.pos];
    }
}

const list = new List();
const arr = new Array(10).fill('');
arr.forEach(() => list.append(Math.random().toString(16).slice(1)));

for(list.front(); list.hasNext(); list.next()) {
    console.log(list.currPos(), list.getElement())
}
console.log(list.currPos(), list.getElement())