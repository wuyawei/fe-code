const bindActionCreator = (actionCreator, dispatch) => {
    return (...args) => dispatch(actionCreator.apply(this, args));
}

const bindActionCreators = (actionCreators, dispatch) => {
    if (typeof actionCreators === 'function') {
        return bindActionCreator(actionCreators, dispatch);
    }
    if (typeof actionCreators !== 'object' || actionCreators === null) {
        throw Error('参数不合法！！！');
    }
    const boundActionCreators = {};
    Object.keys(actionCreators).forEach(k => {
        const actionCreator = actionCreators[k];
        if (typeof actionCreator === 'function') {
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
        }
    })
    return boundActionCreators;
}