// 双向链表
// {node, next: {node, next: {...}, prev: {...}}, prev: null}
class DoublyLinkedList{
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
    node(element) {
        return {
            node: element,
            next: null,
            prev: null
        }
    }
    append(element) {
        const node = this.node(element);
        if(this.head === null) {
            this.head = node;
            this.tail = node;
        } else {
            let current = this.head;
            while(current.next) {
                current = current.next;
            }
            current.next = node;
            node.prev = current;
            this.tail = node;
        }
        this.length++;
    }
    removeAt(position) {
        if (position > -1 && position < this.length){
            let current = this.head;
            let previous = null;
            let index = 0;
            if(position === 0) {
                current = current.next;
                // 列表只有一项，则更新尾巴
                if (this.length === 1) {
                    this.tail = null;
                } else {
                    current.prev = null;
                }
                this.head = current;
            } else {
                // 当前删除位置是最后一个
                if (position === this.length - 1) {
                    current = this.tail;
                    current = current.prev;
                    current.next = null;
                    this.tail = current;
                } else {
                    // 其他情况
                    while(index++ < position) {
                        previous = current;
                        current = current.next;
                    }
                    // 删除 current
                    previous.next = current.next;
                    current.next.prev = previous;
                }
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
                // 当前链表为空，即首次添加，记录尾部
                if (!head) {
                    this.head = node;
                    this.tail = node;
                } else {
                    node.next = current;
                    current.prev = node;
                    this.head = node;
                }
            } else {
                // 当前插入位置是最后一个
                if (position === this.length) {
                    current = this.tail;
                    current.next = node;
                    node.prev = current;
                    this.tail = node;
                } else {
                    // 其他情况
                    while(index++ < position) {
                        previous = current;
                        current = current.next;
                    }
                    previous.next = node;
                    node.next = current;
                    current.prev = node;
                    node.prev = previous;
                }
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
    get size() {
        return this.length;
    }
}

const list = new DoublyLinkedList();
list.append('a');
list.append('b');
list.insert(2, 'c')
console.log(list.getHead())