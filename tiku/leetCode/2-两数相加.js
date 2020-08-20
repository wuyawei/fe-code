/* 
给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。

如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。

您可以假设除了数字 0 之外，这两个数都不会以 0 开头。

示例：

输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 0 -> 8
原因：342 + 465 = 807

*/

// 相加后也为逆序
function ListNode(val) {
    this.val = val;
    this.next = null;
}

const addTwoNumbers = function(l1, l2) {
    const node = new ListNode('head');
    let temp = node;
    let add = 0; // 相加后思否需要进 1
    while(l1 || l2) {
        let sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + add;
        temp.next = new ListNode(sum % 10); // 两数相加后取余，再向前进 1
        add = sum >= 10 ? 1 : 0;
        l1 && (l1 = l1.next);
        l2 && (l2 = l2.next);
        temp = temp.next;
    }
    // 最后如果还超出了10位，依然需要进 1 
    add && (temp.next = new ListNode(add));
    return node.next;
};


// 递归解法
const addTwoNumbers2 = function(l1, l2, add = 0) {
    if(l1 || l2) {
        let sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + add;
        add = sum >= 10 ? 1 : 0;
        const noop = new ListNode(null);
        l1 = l1 ? l1.next : noop.next;
        l2 = l2 ? l2.next : noop.next;
        return {
            val: sum % 10,
            next: addTwoNumbers2(l1, l2, add )
        }
    } else {
        return add ? new ListNode(add) : null;
    }
}