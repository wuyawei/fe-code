/*
 * @lc app=leetcode.cn id=83 lang=javascript
 *
 * [83] 删除排序链表中的重复元素
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function(head) {
    const cache = new Set();
    let node = head;
    while(node){
        const val = node.val;
        // 连续下一个相等直接移走
        while(node.next && node.next.val === val) {
            node.val = node.next.val;
            node.next = node.next.next;
        }
        // 非连续相等移除
        if(cache.has(node.val)){
            if(node.next) {
                node.val = node.next.val;
                node.next = node.next.next;
            } else {
                // 处理最后一个
                node = null;
            }
        } else {
            // 首次出现
            cache.add(node.val);
            node = node.next;
        }
    }
    return head;
};
// @lc code=end

