// 将两个升序链表，合成一个
// 输入：1->2->4, 1->3->4
// 输出：1->1->2->3->4->4

/**
 * 链表结构
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 * @param {*} l1
 * @param {*} l2
 * @returns
 */
const mergeList = (l1, l2) => {
    if(l1 === null) {
        return l2;
    }
    if(l2 === null) {
        return l1;
    }
    if(l1.val < l2.val) {
        l1.next = mergeList(l1.next, l2);
        return l1;
    } else {
        l2.next = mergeList(l1, l2.next);
        return l2;
    }
}