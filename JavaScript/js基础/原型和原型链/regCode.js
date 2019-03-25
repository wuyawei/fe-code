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
        fontSize: 20, // 字体大小
        fontFamily: 'Georgia', // 字体类型
        fontStyle: 'fill', // 字体绘制方法，fill/stroke
        content: 'acdefhijkmnpwxyABCDEFGHJKMNPQWXY12345789', // 验证码因子
        len: 4 // 验证码长度
    }, params);
    Object.keys(p).forEach(k => { // 将所有属性组合后添加到this上
        this[k] = p[k];
    });
    this.canvas = null; // canvas dom
    this.paint = null; // canvas 2d
}

Regcode.prototype.getColor = function(arr) { // 随机获取颜色
    let colors = new Array(3).fill(''); // 创建一个长度为3的数组，值都填充为 ''
    colors = colors.map(v => this.getRand(...arr)); // 每个成员随机获取一个强度值重组为新数组
    console.log(colors);
    return colors;
};

Regcode.prototype.getRand = function(...arr) { // 获取某个区间的随机数
    arr.sort((a, b) => a - b); // 将传入的参数从小到大排序
    return Math.floor(Math.random() * (arr[1] - arr[0]) + arr[0]);
};

Regcode.prototype.getText = function() { // 随机获取验证码
    let len = this.content.length, str = '';
    for (let i = 0; i < this.len; i++) {
        str += this.content[this.getRand(0, len)];
    }
    return str;
};

Regcode.prototype.line = function() { // 绘制线条
    for (let i = 0; i < this.lineNum; i++) {
        // 随机获取线条的起止坐标
        let x = this.getRand(0, this.canvas.width), y = this.getRand(0, this.canvas.height),
            endx = this.getRand(0, this.canvas.width), endy = this.getRand(0, this.canvas.width);

        this.paint.beginPath();
        this.paint.lineWidth = this.lineWidth;

        // 随机获取路径颜色
        let colors = this.getColor(this.foregroundColor);
        this.paint.strokeStyle = `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, 0.8)`;

        // 指定绘制路径
        this.paint.moveTo(x, y);
        this.paint.lineTo(endx, endy);
        this.paint.closePath();
        this.paint.stroke(); // 进行绘制
    }
};

Regcode.prototype.arc = function() { // 绘制圆点
    for (let i = 0; i < this.dotNum; i++) {
        // 随机获取圆心
        let x = this.getRand(0, this.canvas.width), y = this.getRand(0, this.canvas.height);
        this.paint.beginPath();

        // 指定圆周路径
        this.paint.arc(x, y, this.dotR, 0, Math.PI * 2, false);
        this.paint.closePath();

        // 随机获取路径颜色
        let colors = this.getColor(this.foregroundColor);
        this.paint.fillStyle = `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, 0.8)`;

        // 绘制
        this.paint.fill();
    }
};

Regcode.prototype.font = function() { // 绘制文字
    let str = this.getText(); // 获取验证码
    this.callback(str); // 利用回调函数输出文字，用于与用户输入验证码进行比对

    // 指定文字风格
    this.paint.font = `${this.fontSize}px ${this.fontFamily}`;
    this.paint.textBaseline = 'middle'; // 设置文本基线，middle是整个文字所占方框的高度的正中。

    // 指定文字绘制风格
    let fontStyle = `${this.fontStyle}Text`;
    let colorStyle = `${this.fontStyle}Style`;

    for (let i = 0; i < this.len; i++) { // 循环绘制每个字
        let fw = this.paint.measureText(str[i]).width; // 获取文字绘制的实际宽度

        // 获取每个字的允许范围，用来确定绘制单个文字的横坐标
        let x = this.getRand(this.canvas.width / this.len * i, (this.canvas.width / this.len) * i + fw/2);

        // 随机获取字体的旋转角度
        let deg = this.getRand(-6, 6);

        // 随机获取文字颜色
        let colors = this.getColor(this.foregroundColor);
        this.paint[colorStyle] = `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, 0.8)`;

        // 开始绘制
        this.paint.save();
        this.paint.rotate(deg * Math.PI / 180);
        this.paint[fontStyle](str[i], x, this.canvas.height / 2);
        this.paint.restore();
    }
};

Regcode.prototype.draw = function(dom, callback = function () {}) { // 绘图
    // 获取canvas dom
    if (!this.paint) {
        this.canvas = dom;
        // console.log(dom instanceof HTMLElement);
        if (!this.canvas) return;
        this.paint = this.canvas.getContext('2d');
        if (!this.paint) return;

        // 回调函数赋值给this，方便使用
        this.callback = callback;
        this.canvas.onclick = () => {
            this.drawAgain();
        }
    }

    // 随机画布颜色，使用背景色
    let colors = this.getColor(this.backgroundColor);
    this.paint.fillStyle = `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, 0.8)`;

    // 绘制画布
    this.paint.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘图
    this.arc();
    this.line();
    this.font();
};

Regcode.prototype.clear = function() { // 清空画布
    this.paint.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Regcode.prototype.drawAgain = function() { // 更新画布
    this.clear();
    this.draw(this.callback);
};

if (typeof module !== 'undefined' && !module.nodeType && module.exports) {
    module.exports = Regcode;
}
