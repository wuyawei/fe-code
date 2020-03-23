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
            // getState: store.getState,
            dispatch: (action, ..._args) => dispatch(action, ..._args)
        }
        console.log('aaa',createStore)
        console.log('ccc',reducer)
        const chain = middlewares.map(middleware => middleware(middlewaresAPI));
        dispatch = compose(...chain)(store.dispatch);
        return {...store, dispatch};
    }
}
// const store = createStore(reducer, applyMiddleware(logger));
// 等同于
// const store = compose(applyMiddleware(logger))(createStore)(reducer, ...args);
// compose 接收 createStore 并最终传给applyMiddleware，其它中间件则可以处理 dispatch 等，以加强处理 action 的能力