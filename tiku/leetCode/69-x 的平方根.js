/* 
实现 int sqrt(int x) 函数。

计算并返回 x 的平方根，其中 x 是非负整数。

由于返回类型是整数，结果只保留整数的部分，小数部分将被舍去。

示例 1:

输入: 4
输出: 2
示例 2:

输入: 8
输出: 2
说明: 8 的平方根是 2.82842..., 
     由于返回类型是整数，小数部分将被舍去。 
*/

var mySqrt = function(x) {
    if(x < 2) return x;
    let l = 1, r = x / 2 + 1, mid = 1;
    while(l <= r) {
        mid = (l+r) >> 1;
        if(mid ** 2 > x) {
            r = mid -1;
        } else if(mid ** 2 < x) {
            l = mid + 1;
        } else {
            return mid
        }
    }
    return r;
};

console.log("mySqrt(10)", mySqrt(10));