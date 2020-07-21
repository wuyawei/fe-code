class LinkedList{
    constructor() {
        this.length = 0;
        this.head = null;
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
    }
}

const list = new LinkedList();
list.append('a');
list.append('b');
list.append('c');
list.append('d');
list.append('e');
list.removeAt(2);
console.log(list.head)