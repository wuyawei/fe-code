// 字母数字转换
// 完成一个转换函数，将数字转成对应的大写字母，满足下面的对应关系
// 1 => A；2 => B；3 => C ...
// 26 => Z；27 => AA；28 => AB；29 => AC ...
// 52 => AZ；53 => BA；54 => BB

function convert(num) {
    let str = '';
    while(num) {
        let remainder = num % 26;
        let isO = remainder === 0;
        str = String.fromCharCode('A'.charCodeAt(0) + (isO ? 25 : remainder - 1)) + str;
        num = num / 26 | 0;
        num = isO ? num - 1 : num;
    }
    return str;
}
// console.log(convert(26)) // Z
// console.log(convert(52)) // AZ
// console.log(convert(54)) // BB
// console.log(convert(27)) // AA
// console.log(convert(78)) // BZ
// console.log(convert(999)) // ALK
// console.log(convert(99999)) // EQXC




// 实现一个方法decodeStr，输入一个字符串，根据约定规则输出编码结果。约定规则如下：
// str = "2[a]1[bc]", 返回 "aabc".
// str = "2[e2[d]]", 返回 "eddedd"
// str = "3[abc]2[cd]ff", 返回 "abcabcabccdcdff".
// 可以看出: N[string]，表示string 正好重复 N 次。假设字符串一定是有效正确的字符串
function decodeStr(inputStr) {
    const queue = [];
    let index = 0;
    let str = '';
    while(index < inputStr.length) {
        if(inputStr[index] === '[') {
            queue.push(index);
        } else if(inputStr[index] === ']') {
            const i = queue.pop();
            let item = inputStr.slice(i + 1, index);
            let num = inputStr[i-1];
            let s = '';
            while(num > 0) {
                s+=item;
                num --;
            }
            str+=s;
        }
        index++;
    }
    return str;
}
console.log(decodeStr("2[a]1[bc]"))
// console.log(decodeStr("2[e2[d]]"))
console.log(decodeStr("3[abc]2[cd]ff"))


