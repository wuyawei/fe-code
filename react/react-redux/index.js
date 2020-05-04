// const mapStateToProps = (state, ownProps) => {
//     console.log(state); // state
//     console.log(ownProps); // ownProps
// }

// function mapDispatchToProps(dispatch) {
//     return { actions: bindActionCreators(actionCreators, dispatch) }
// }

// connect(mapStateToProps, mapDispatchToProps)(WrappedComponent)

// connect => mapStateToProps => selectorFactory(dispatch) => mapStateToProps(state)

// connect 接收 mapStateToProps 后，构建 selectorFactory 函数
// const selectorFactory = (dispatch, options) => (state, props) => mapStateToProps(state);
// 创建 wrapWithConnect 接收 WrappedComponent
// 一系列状态和构建等操作
// 最终将 selectorFactory 组合好的 props 传递给 WrappedComponent
// 之所以能拿到 store 是因为 connect 里引入了同一个 Context

// dispatch 更新 store 的 state，但是 store 和 react 本身是没有关系的，dispatch 并不会直接触发 react 的更新
// react-redux 通过 subscribeUpdates 订阅了 store 的 state 的更新，即 dispatch 会触发 subscribeUpdates
// 而 subscribeUpdates 会关联 react 的 setState 或 useState，从而触发 react 的更新
// 所以 react-redux 通过发布订阅把 react 和 redux 联系在一起

// react 的 Subscription 和 store 的 subscribe，被同一个 onStateChange（即 subscribeUpdates）订阅