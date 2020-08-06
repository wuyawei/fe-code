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
        for(var j = 1; j <= 2; j++){
            //奇数偶数回文
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
longestPalindrome('adadabbcadada1')