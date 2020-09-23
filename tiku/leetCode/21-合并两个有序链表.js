/*
 * @lc app=leetcode.cn id=21 lang=javascript
 *
 * [21] 合并两个有序链表
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
// 递归
var mergeTwoLists1 = function(l1, l2) {
    if(l1 === null) return l2;
    if(l2 === null) return l1;
    if(l1.val < l2.val) {
        l1.next = mergeTwoLists1(l1.next, l2);
        return l1;
    } else {
        l2.next = mergeTwoLists1(l2.next, l1);
        return l2;
    }
};
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}
// 迭代
var mergeTwoLists = function(l1, l2) {
    if(l1 === null) return l2;
    if(l2 === null) return l1;
    let head = new ListNode(0);
    let cur = head;
    while(l1 && l2) {
        if(l1.val < l2.val) {
            cur.next = l1;
            l1 = l1.next;
            cur = cur.next;
        } else{
            cur.next = l2;
            l2 = l2.next;
            cur = cur.next;
        }
    }
    if(l2 === null) {
        cur.next = l1;
    }
    if(l1 === null) {
        cur.next = l2;
    }
    return head.next;
};
// @lc code=end

