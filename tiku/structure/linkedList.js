// 链表
// {node, next: {node, next: {...}}}
class LinkedList{
    constructor() {
        this.head = null;
        this.length = 0;
    }
    node(element) {
        return {
            node: element,
            next: null
        }
    }
    append(element) {
        const node = this.node(element);
        if(this.head === null) {
            this.head = node;
        } else {
            let current = this.head;
            while(current.next) {
                current = current.next;
            }
            current.next = node;
        }
        this.length++;
    }
    removeAt(position) {
        if (position > -1 && position < this.length){
            let current = this.head;
            let previous = null;
            let index = 0;
            if(position === 0) {
                this.head = current.next;
            } else {
                while(index++ < position) {
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
            }
            this.length --;
            return current.node;
        }
        return null;
    }
    insert(position, element) {
        if (position > -1 && position <= this.length){
            const node = this.node(element);
            let current = this.head;
            let previous = null;
            let index = 0;
            if(position === 0) {
                // 
                node.next = current;
                this.head = node;
            } else {
                while(index++ < position) {
                    previous = current;
                    current = current.next;
                }
                previous.next = node;
                node.next = current;
            }
            this.length ++;
            return  true;
        } else {
            return false;
        }
    }
    indexOf(element) {
        let current = this.head;
        let index = 0;
        while(current) {
            if(element === current.node) {
                return index;
            }
            current = current.next;
            index++;
        }
        return -1;
    }
    remove(element) {
        const index = this.indexOf(element);
        return this.removeAt(index);
    }
    getHead() {
        return this.head;
    }
    isEmpty() {
        return this.length === 0;
    }
    toString() {
        let current = this.head;
        let str = '';
        while(current.next) {
            str += current.node;
            current = current.next; 
        }
        return str;
    }
    replace(list) {
        this.head = list;
        return this;
    }
    get size() {
        return this.length;
    }
}

// 合并链表
const mergeList = (l1, l2) => {
    if(l1 === null) {
        return l2;
    }
    if(l2 === null) {
        return l1;
    }
    if(l1.node < l2.node) {
        l1.next = mergeList(l1.next, l2);
        return l1;
    } else {
        l2.next = mergeList(l2.next, l1);
        return l2;
    }
}

const list1 = new LinkedList();
list1.append(1);
list1.append(3);
list1.append(5);

const list2 = new LinkedList();
list2.append(2);
list2.append(4);
list2.append(5);

const list = new LinkedList();
console.log(list.replace(mergeList(list1.getHead(), list2.getHead())).toString())
