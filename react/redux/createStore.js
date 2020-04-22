const randomString = () =>
    Math.random()
        .toString(36)
        .substring(7)
/**
 * @param {*} reducer 
 * @param {*} preloadedState 默认值
 * @param {*} enhancer  增强器
 */
const createStore = (reducer, preloadedState, enhancer) => {
    // 允许不传默认值时，第二参数传增强器
    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        enhancer = preloadedState;
        preloadedState = undefined;
    }
    if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') {
            throw new Error('enhancer 需要是一个函数')
        }
        // 执行增强器
        return enhancer(createStore)(reducer, preloadedState);
    }
    if (typeof reducer !== 'function') {
        throw new Error('reducer 需要是一个函数');
    }
    let currentReducer = reducer;
    let currentState = preloadedState;
    let currentListeners = []; // 当前监听器
    let isDispatching = false; // 是否正在派发

    const getState = () => {
        if (isDispatching) {
            throw new Error('当前正在派发，不能在此时获取 state');
        }
        return currentState;
    }

    /**
     * 绑定订阅者
     * @param {*} listener 订阅者
     * @returns unsubscribe 退订器
     */
    const subscribe = (listener) => {
        if (typeof listener !== 'function') {
            throw new Error('订阅者需要是函数');
        }
        if (isDispatching) {
            throw new Error('当前正在派发，不能在此时添加订阅者subscribe()');
        }
        currentListeners.push(listener); // 添加绑定
        let isSubscribed = true; // 记录是否已绑定
        // 返回退订器
        return function unsubscribe() {
            if(isSubscribed) return; // 已解绑
            if (isDispatching) {
                throw new Error('当前正在派发，不能在此时退订');
            }
            // 解绑
            isSubscribed = false;
            currentListeners = currentListeners.filter(lis !== listener);
        }
    }

    /**
     * 派发
     * @param {*} action 
     * @returns
     */
    const dispatch = (action) => {
        if (typeof action.type === 'undefined') {
            throw new Error('需要指定派发的 action.type');
        }
        if (isDispatching) {
            throw new Error('当前不能进行派发');
        }
        try {
            isDispatching = true;
            // 执行 reducer
            currentState = currentReducer(currentState, action);
        } finally {
            // 无论是否出错都重置
            isDispatching = false;
        }
        // 执行订阅器
        currentListeners.forEach(listener => listener());
        return action;
    }

    /**
     * 替换 reducer
     * 一般用于动态修改 reducer 新的 reducer
     * @param {*} nextReducer
     */
    const replaceReducer = (nextReducer) => {
        if (typeof nextReducer !== 'function') {
            throw new Error('nextReducer 需要是函数');
        }
        currentReducer = nextReducer;
        // 初始化 state
        dispatch({ type: randomString() });
    }

    /**
     * 添加 观察者
     * @returns unsubscribe 退订
     */
    const observable = () => {
        const outerSubscribe = subscribe;
        return {
            subscribe(observer) {
                if (typeof observer !== 'object') {
                    throw new Error('observer 需要是对象');
                }
                // 观察 state
                const observerState = () => {
                    // observer 通过 next 方法接收最新的 state
                    if (observer.next) {
                        observer.next(getState());
                    }
                }
                // 初始化拿到当前state
                observerState();
                // 给当前 observer 添加订阅，每次 dispatch 后，可以知道数据变化
                const unsubscribe = outerSubscribe(observerState);
                // 返回退订器
                return {
                    unsubscribe
                }
            }
        }
    }

    // 初始化 state
    dispatch({ type: randomString() });

    // store
    return {
        getState,
        subscribe,
        dispatch,
        replaceReducer,
        observable
    }
}