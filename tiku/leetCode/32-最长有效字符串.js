/* 
给定一个只包含 '(' 和 ')' 的字符串，找出最长的包含有效括号的子串的长度。

示例 1:

输入: "(()"
输出: 2
解释: 最长有效括号子串为 "()"
示例 2:

输入: ")()())"
输出: 4
解释: 最长有效括号子串为 "()()"

*/

/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function(s) {
    // 哨兵
    const stack = [-1];
    let max = 0;
    for (let i = 0; i < s.length; i++) {
        if(s[i] === '(') {
            // 左括号，下标入栈
            stack.push(i);
        } else {
            const node = stack.pop();
            // 匹配到的出完后，第一个为接下来的哨兵
            if(stack.length === 0) {
                stack.push(i);
            }
            // 和栈顶下标相减，得到现有长度
            max = Math.max(max, i- stack[stack.length -1]);
        }
    }
    return max;
};