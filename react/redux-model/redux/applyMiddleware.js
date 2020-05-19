import compose from './compose';

// 中间件形式
const logger = ({getState, dispatch}) => next => action => {
    const result = next(action);
    console.log('dispatch', getState());
    return result;
    // 最终是 dispatch 的返回值 result = dispatch(...)
    // 但是如果某个中间件没有 return，也就拿不到了
}
// 构建中间件
const applyMiddleware = (...middlewares) => createStore => (reducer, ...args) => {
    const store = createStore(reducer, ...args);
    let dispatch = () => {
        throw new Error('不能在构建中间件时派发！！！');
    }
    const middlewareAPI = {
        getState: store.getState,
        dispatch: (actions, ...args) => dispatch(actions, ...args) // 引用 dispatch
    }
    const chain = middlewares.map(middleware => middlewares(middlewareAPI)); // 初始化中间件链
    dispatch = compose(...chain)(store.dispatch); // 构建强化的 dispatch，即中间件的 next，即下一个中间件
    // 此时的 dispatch，是 middlewares 的函数从右到左依次将执行返回值（也是函数）作为参数传入的结果
    // 执行的时候从左边开始执行，就像洋葱，左边第一个就是最外层的函数，一层一层执行
    // 之所以一层层执行的原因是中间件调用了 next，next 就是 compose 时接收的右边的返回函数
    return {
        ...store,
        dispatch
    }
}