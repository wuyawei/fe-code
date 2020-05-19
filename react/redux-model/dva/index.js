const app = dva({
    initialState: { count: 1 },
});

app.model({
    namespace: 'todo',
    state: [],
    reducers: {
      add(state, { payload: todo }) {
        // 保存数据到 state
        return [...state, todo];
      },
    },
    effects: {
      *save({ payload: todo }, { put, call }) {
        // 调用 saveTodoToServer，成功后触发 `add` action 保存到 state
        yield call(saveTodoToServer, todo);
        yield put({ type: 'add', payload: todo });
      },
    },
    subscriptions: {
      setup({ history, dispatch }) {
        // 监听 history 变化，当进入 `/` 时触发 `load` action
        return history.listen(({ pathname }) => {
          if (pathname === '/') {
            dispatch({ type: 'load' });
          }
        });
      },
    },
  });

  const App = app.start();

  // 集成了 redux/react-redux/redux-saga/react-router-dom/connected-react-router

  // 完全定义了model层的写法，在 app.start() 方法中，将 model 拆解，
  // 并调用 redux 的 createStore 方法 创建 store。其中包括各种中间件、增强器的创建
  // 将 effects 拆解组合成 sagas 并调用 redux-saga 的 run 方法启动
  // 路由创建

  // 通过 onEffect 创建 model.loading，从而可以拿到所有 effect 的 loading 状态