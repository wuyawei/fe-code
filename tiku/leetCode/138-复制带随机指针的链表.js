/*
 * @lc app=leetcode.cn id=138 lang=javascript
 *
 * [138] 复制带随机指针的链表
 */

// @lc code=start
/**
 * // Definition for a Node.
 * function Node(val, next, random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */

/**
 * 难点在于 random 的处理
 * 通过 map 的映射记录 node -> copyNode 之间的关系
 * @param {Node} head
 * @return {Node}
 */
var copyRandomList = function(head) {
    if(head === null) return head;
    let origin = head;
    let copyHead = new Node(0);
    let copy = copyHead;
    const copyMap = new Map();
    // 先拷贝一份
    while(origin) {
        let copyNode = new Node(origin.val);
        copyNode.next = origin.next;
        // 记录每个原来的节点对应的拷贝节点
        copyMap.set(origin, copyNode);

        copy.next = copyNode;
        origin = copyNode.next;
        copy = copyNode;
    }
    origin = head;
    copy = copyHead.next;
    // 处理random
    while(origin){
        if(origin.random) {
            copy.random = copyMap.get(origin.random);
        } else {
            copy.random = null;
        }
        origin = origin.next;
        copy = copy.next;
    }
    return copyHead.next;
};
// @lc code=end

