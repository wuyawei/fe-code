/**
 * Created by wyw on 2019/3/2.
 */
function Regcode(params = {}) {
    let p = Object.assign({
        lineWidth: 0.5,  // 线条宽度
        lineNum: 2,  // 线条数量
        dotNum: 10, // 点的数量
        dotR: 1, // 点的半径
        foregroundColor: [10, 80], // 前景色区间
        backgroundColor: [150, 250], // 背景色区间
        fontSize: 28, // 字体大小
        fontFamily: 'Georgia', // 字体类型
        fontStyle: 'fill', // 字体绘制方法，fill/stroke
        content: 'acdefhijkmnpwxyABCDEFGHJKMNPQWXY12345789', // 验证码因子
        len: 4 // 验证码长度
    }, params);
    Object.keys(p).forEach(k => {
        this[k] = p[k];
    });
}
Regcode.prototype

console.log(new Regcode());