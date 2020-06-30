const BeforeUnloadEventType = 'beforeunload';
const HashChangeEventType = 'hashchange';
const PopStateEventType = 'popstate';

/**
 * 事件发布的构造器
 * @returns
 */
const createEvents = () => {
    const handlers = [];
    return {
        push(fn) {
            handlers.push(fn);
            // 返回一个解绑器
            return () => handlers.filter(f => f !== fn);
        },
        call(arg) {
            handlers.forEach(fn => fn && fn(arg))
        }
    }
}

/**
 * popstate 事件监听
 * listeners 接收监听器并订阅 popstate 的改变
 * 包装 push、replace、go、back
 */
export const createBrowserHistory = () => {
    const globalHistory = window.history;
    const getLocation = () => {
        const { pathname, search, hash } = window.location;
        const state = globalHistory.state || {};
        return {
            pathname, 
            search,
            hash,
            state
        }
    }
    const handlePop = () => {
        listeners.call(getLocation())
    }
    window.addEventListener(PopStateEventType, handlePop);
    const listeners = createEvents();
    return {
        listen(listener) {
            return listeners.push(listener);
        },
    }
}


export const createHashHistory = () => {

}