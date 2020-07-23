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
    get size() {
        return this.length;
    }
}

const list = new LinkedList();
list.append('a');
list.append('b');
list.append('c');
list.append('d');
list.append('e');
list.removeAt(2);
console.log(list.getHead())