// 输入两个链表，找出它们的第一个公共节点。

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 *  原理是由于共享一段路程。所以A=a+c+b，而B=b+c+a，所以假设是个环路，则当俩指针在这环形链表不断移动时，最后会相遇。
    思路：快慢指针同时走，当其中一个到达自己的尽头时，就切换到另一个所在链表头节点。有相交，会相等，没有则最终都会指向null，也相等。
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
    if(!headA || !headB) return null;
    let node1 = headA;
    let node2 = headB;
    while(node1 !== node2) {
        node1 = node1 === null ? headB : node1.next;
        node2 = node2 === null ? headA : node2.next;
    }
    return node1;
};