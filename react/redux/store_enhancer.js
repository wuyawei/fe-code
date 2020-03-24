// store 中间件
// function logger({ getState }) {
//     return next => action => {
//       console.log('will dispatch', action)
//       const returnValue = next(action)
//       console.log('state after dispatch', getState())
//       return returnValue
//     }
//   }
// const store = createStore(todos, ['Use Redux'], applyMiddleware(logger))

const compose = (...fns) => {
    if (fns.length === 0) {
        return arg => arg
    }
    if (fns.length === 1) {
        return fns[0]
    }
    return fns.reduce((f,g) => (...args) => f(g(...args)));
}
const applyMiddleware = (...middlewares) => {
    return createStore => (reducer, ...args) => {
        const store = createStore(reducer, ...args);
        let dispatch = () => {
            throw new Error(
              '不能在构建中间件时派发'
            )
        }
        const middlewaresAPI = {
            getState: store.getState,
            dispatch: (action, ..._args) => dispatch(action, ..._args)
        }
        // 执行中间件，得到 next => action => {}
        const chain = middlewares.map(middleware => middleware(middlewaresAPI));
        // compose 连接一个或多个 next => action => {}，并将 store.dispatch 传入
        // 最终得到多个中间件处理后的dispatch 类似于 f1(f2(f3(dispatch)))(action) ...
        // 注意最终传入 action 时，middlewares[0] 是最先执行的，因为每个 middleware 返回值是函数。
        // compose 是从右往左执行，最终得到从左到右嵌套的函数（左边第一个在最外层）。
        // 这也是为什么 applyMiddleware 一般要放在第一个的原因，因为这里会包含异步的 action
        dispatch = compose(...chain)(store.dispatch);
        return {...store, dispatch};
    }
}
// c(b(a(dispatch)))(action)
const a = n => a => n(a+1);
const b = n => a => n(a+2);
const c = n => a => n(a+3);
c(b(a(console.log)))(1);
// 等同于
const _a = a => console.log(a+1);
const _b = a => _a(a+2);
const _c = a => _b(a+3);
_c(1);

// const store = createStore(reducer, applyMiddleware(logger));
// 等同于
// const store = applyMiddleware(logger)(createStore)(reducer, ...args);
// applyMiddleware 接收 createStore，其它中间件也可以处理 dispatch 等，以加强处理 action 的能力


// store 增强器  返回值和 applyMiddleware 一样
// function storeEnhancer() {
//     return createStore => (reducer, ...args) => {
//         const store = createStore(reducer, ...args);
//         //...
//         return store
//     }
// }
// const store = createStore(reducer, compose(applyMiddleware(logger), storeEnhancer));
// 等同于
// const store = compose(applyMiddleware(logger), storeEnhancer)(createStore)(reducer, ...args);
// compose 用来连接多个 storeEnhancer（增强器） 和 applyMiddleware（中间件）
// 每个增强器返回以下函数，作为下一个增强器或者 applyMiddleware 的 createStore，最终得到一个叠加的，增强过的 store。
//  (reducer, ...args) => {
//       const store = createStore(reducer, ...args);
//       //...
//       return store
//   }