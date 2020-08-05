/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    let result = s[0] || "";
    for(var i = 0; i < s.length; i++){
        for(var j = 1; j <= 2; j++){
            //奇数偶数回文
            var left = i;
            var right = i + j;
            while(left >= 0 && right < s.length && s[left] === s[right]){
                left--;
                right++;
            }
            var len = (right - left) - 1;
            if(len > result.length){
                result = s.substr(left + 1, len);
            }
        }
    }
    return result;
};