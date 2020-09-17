/* 
给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。

示例 1：

输入: "babad"
输出: "bab"
注意: "aba" 也是一个有效答案。
示例 2：

输入: "cbbd"
输出: "bb"

*/


/**
 * @param {string} s
 * @return {string}
 */
// 最长回文数
// 回文数特征
// 奇数回文中心，下两个必定和它相等。此时开始左右一起查找，找到该回文的起止点。
// 偶数回文中心，下一个必定和它相等。此时开始左右一起查找，找到该回文的起止点。
var longestPalindrome = function(s) {
    let result = s[0] || "";
    for(var i = 0; i < s.length; i++){
        for(var j = 1; j <= 2; j++){ //奇数偶数回文 
            var left = i;
            var right = i + j;
            console.log("longestPalindrome -> right", left, right)
            while(left >= 0 && right < s.length && s[left] === s[right]){
                left--;
                right++;
            }
            var len = (right - left) - 1;
            console.log("longestPalindrome -> right", left, right)
            if(len > result.length){
                result = s.substr(left + 1, len);
                console.log("longestPalindrome -> result", result)
            }
        }
    }
    return result;
};
longestPalindrome('adadabbcadada1');

/**
 * 动态规划
 * @param {string} s
 * @return {string}
 */
var longestPalindrome1 = function(s) {
    const n = s.length;
    const dp = [];
    let res = '';
    for(let i = n - 1; i >= 0; i--) {
        dp[i] = [];
        for(let j = i; j < n; j++) {
            dp[i][j] = s[i]==s[j] && (j - i < 2 || dp[i+1][j-1]);
            if(dp[i][j] && j - i + 1 > res.length) {
                res = s.slice(i, j+1);
            }
        }
    }
    return res;
};