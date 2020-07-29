// 二叉搜索树
class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    node(key) {
        return {
            key: key,
            left: null,
            right: null
        }
    }
    insert(insertKey) {
        const insertNode = (node, newNode) => {
            if(newNode.key < node.key) {
                if(node.left === null) {
                    node.left = newNode;
                } else {
                    insertNode(node.left, newNode);
                }
            } else if(newNode.key > node.key) {
                if(node.right === null) {
                    node.right = newNode;
                } else {
                    insertNode(node.right, newNode)
                }
            }
        }
        const newNode = this.node(insertKey);
        if (this.root === null) {
            this.root = node;
        } else {
            insertNode(this.root, newNode);
        }
    }
    search(key) {
        const searchNode = (node, key) => {
            if(node === null) return false;
            if (key < node.key) {
                searchNode(node.left, key);
            } else if(key > node.key) {
                searchNode(node.right, key);
            } else {
                return true;
            }
            return false;
        }
        return searchNode(this.root, key);
    }
    max() {
        const node = this.root;
        while(node && node.right) {
            node = node.right;
        }
        if (node) {
            return node.key;
        }
        return null;
    }
    min() {
        const node = this.root;
        while(node && node.left) {
            node = node.left;
        }
        if (node) {
            return node.key;
        }
        return null;
    }
}