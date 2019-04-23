/**
 * @desc 函数防抖
 * @param       fn              Function     事件处理函数
 * @param       delay           Number       设定延时时间
 * @param       isImmediate     Boolean      事件触发时是否立刻执行
 */
function debounce(fn, delay, isImmediate) {
    var timer = null;
    return function() {
        var that = this;
        var args = [].slice.call(arguments);
        var callNow = !timer && isImmediate;

        if(timer) clearTimeout(timer);

        // delay执行
        timer = setTimeout(function() {
            timer = null;
            if(!isImmediate) fn.apply(that, args);
        }, delay);
        // 立即执行
        if(callNow) fn.apply(that, args);
    }
}
