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
    while(origin.next) {
        let copyNode = new Node(origin.val);
        copyNode.next = origin.next;
        copyMap.set(origin, copyNode);
    
        copy.next = copyNode;
        copy = copyNode.next;
        origin = origin.next;
    }
    origin = head;
    copy = copyHead.next;
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

