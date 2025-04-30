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

// 新建节点，不改变原链表
const reverseListI = (oldList) => {
    let newList = null;
    let curr = oldList;
    while(curr) {
        const node = new ListNode(curr.val);
        node.next = newList;
        newList = node;
        curr = curr.next;
    }
    return newList;
}

// 迭代
const reverseList = (head) => {
    let prev = null;
    let curr = head;
    while (curr) {
        let temp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = temp;
    }
    return prev;
}

const reverseListR = (head) => {
    let prev = null;
    let curr = head;
    const _reverse = (p, c) => {
        if(!c) return p;
        let temp = c.next;
        c.next = p;
        return _reverse(temp, c)
    }
    return _reverse(prev, curr)
}



// 递归
var reverseListO = function(head) {
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

