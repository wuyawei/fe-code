/*
 * @lc app=leetcode.cn id=92 lang=javascript
 *
 * [92] 反转链表 II
 *  反转从位置 m 到 n 的链表。请使用一趟扫描完成反转。
    说明:
    1 ≤ m ≤ n ≤ 链表长度。

    示例:

    输入: 1->2->3->4->5->NULL, m = 2, n = 4
    输出: 1->4->3->2->5->NULL
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
 * @param {number} m
 * @param {number} n
 * @return {ListNode}
 */
var reverseBetween = function(head, m, n) {
    if(!m || !n || !head) {
        return head;
    }
    let start = null;
    let end = null;
    let center = null;
    let centerRight = null;
    let curr = head;
    let index = 0;
    while(curr) {
        index++;
        if(index < m) {
            start = curr;
            curr = curr.next;
        }
        if(index >= m && index <= n) {
            let tmp = curr.next;
            curr.next = center;
            center = curr;
            curr = tmp;
            if(index === m) {
                centerRight = center;
            }
        }
        if(index > n) {
            end = curr;
            break;
        }
    }
    start ? start.next = center : head = center;
    centerRight && (centerRight.next = end);
    return head;
};
// @lc code=end

