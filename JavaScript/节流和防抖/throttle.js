/**
 * @desc 函数节流
 * @param       fn              Function     事件处理函数
 * @param       delay           Number       设定执行时间
 */
function throttle(fn, delay) {
    var timer = null;
    var prev = +new Date();
    return function() {
        var that = this;
        var args = [].slice.call(arguments);
        var now = +new Date();
        var diff = now - prev;
        if(timer) clearTimeout(timer);
        if(diff >= delay) {
            fn.apply(that, args);
            prev = now;
        }else {
            timer = setTimeout(function() {
                fn.apply(that, args);
                prev = Date.now();
                timer = null;
            }, delay)
        }
    }
}
