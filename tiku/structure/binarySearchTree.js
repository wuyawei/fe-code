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
        const newNode = this.node();
        if (this.root === null) {
            this.root = node;
        } else {
            insertNode(this.root, newNode);
        }
    }
}