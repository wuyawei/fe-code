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
    search(searchKey) {
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
        return searchNode(this.root, searchKey);
    }
    // 中序遍历 先去比自己小的 再到自己 再到比自己大的
    inOrderTraverse(callback) {
        const inOrderTraverseNode = (node, fn) => {
            if(node === null) return;
            inOrderTraverseNode(node.left, fn);
            fn(node.key)
            inOrderTraverseNode(node.right, fn);
        }
        inOrderTraverseNode(this.root, callback)
    }
    
    // 先序遍历 优先自己 再比自己小的 最后比自己大的
    preOrderTraverse(callback) {
        const preOrderTraverseNode = (node, fn) => {
            if(node === null) return;
            fn(node.key)
            preOrderTraverseNode(node.left, fn);
            preOrderTraverseNode(node.right, fn);
        }
        preOrderTraverseNode(this.root, callback)
    }
    
    // 后序遍历 先小的  再大的 最后自己
    postOrderTraverse(callback) {
        const postOrderTraverseNode = (node, fn) => {
            if(node === null) return;
            postOrderTraverseNode(node.left, fn);
            postOrderTraverseNode(node.right, fn);
            fn(node.key)
        }
        postOrderTraverseNode(this.root, callback)
    }

    remove(searchKey) {
        const removeNode = (node, key) => {
            if(node === null) return null;
            if(key < node.key) {
                node.left = removeNode(node.left, key);
                return node;
            } else if(key > node.ley) {
                node.right = removeNode(node.right, key);
                return node;
            } else {
                // 没有子节点
                if(node.left === null && node.right === null) {
                    node = null;
                    return node;
                }
                // 只有右子节点
                if(node.left === null && node.right) {
                    node = node.right;
                    return node;
                }
                // 只有左子节点
                if(node.left && node.right === null) {
                    node = node.left;
                    return node;
                }
                // 有两个子节点
                if(node.left && node.right) {
                    const tmp = node.right;
                    const min = this.findMinKey(tmp);
                    node.key = min;
                    node.right = removeNode(tmp, min);
                    return node;
                }
            }

        }
        removeNode(this.root, searchKey);
    }

    // 最大值
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

    findMinKey(node) {
        while(node && node.left) {
            node = node.left;
        }
        if (node) {
            return node.key;
        }
        return null;
    }

    //最小值
    min() { 
        return this.findMinKey(this.root);
    }
}