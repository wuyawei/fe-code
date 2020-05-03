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