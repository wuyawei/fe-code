// 给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。
// 说明：本题中，我们将空字符串定义为有效的回文串。
// 输入: "A man, a plan, a canal: Panama"
// 输出: true

const str = "A man, a plan, a canal: Panama";
// const isPalindrome = (s) => {
//     const str = s.replace(/\W|_/g, '').toLowerCase();
//     return str.split('').reverse().join('') === str;
// }

const isPalindrome = (s) => {
    const str = s.replace(/\W|_/g, '').toLowerCase();
    let left = 0;
    let right = str.length -1;
    while(left < right) {
        if(str[left] !== str[right]) {
            return false;
        }
        left ++;
        right --;
    }
    return true;
}

console.log(isPalindrome(str));