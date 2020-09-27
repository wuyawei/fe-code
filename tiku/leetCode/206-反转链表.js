/*
 * @lc app=leetcode.cn id=206 lang=javascript
 *
 * [206] 反转链表
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
// 迭代
// var reverseList = function(head) {
//     let curr = head;
//     let node = null;
//     while(curr) {
//         let tmp = curr.next;
//         curr.next = node;
//         node = curr;
//         curr = tmp;
//     }
//     return node;
// };

// 递归
var reverseList = function(head) {
    let curr = head;
    let result = null;
    const reverse = (cur, res) => {
        if(!cur) return res;
        let next = cur.next;
        cur.next = res;
        return reverse(next, cur);
    }
    return reverse(curr, result)
};
// @lc code=end

