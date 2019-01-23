/**
 * @desc 函数节流
 * @param       fn              Function     事件处理函数
 * @param       delay           Number       设定执行时间
 */
function throttle(fn, delay) {
    var timer = null;
    var prev = Date.now();
    return function() {
        var that = this;
        var args = [].slice.call(arguments);
        var now = Date.now();
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

// 使用
window.addEventListener('resize', debounce(function() {
    console.log('节流了');
}, 600))