/* 
给定一个排序链表，删除所有含有重复数字的节点，只保留原始链表中 没有重复出现 的数字。

示例 1:

输入: 1->2->3->3->4->4->5
输出: 1->2->5
示例 2:

输入: 1->1->1->2->3
输出: 2->3
*/

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * 排序链表，即所有重复节点都是连续的
 * 如果下一个不是重复，说明该节点没有重复
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function(head) {
    let node = head;
    let lastHead = new ListNode(0);
    lastHead.next = head;
    let last = lastHead;
    while(node && node.next){
        if(node.val === node.next.val) {
            let val = node.val;
            while(node && node.val === val) {
                node = node.next;
            }
            last.next = node;
        }else{
            last = last.next;
            node = node.next;
        }
    }
    return lastHead.next;
};