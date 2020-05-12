const combineReducers = (reducers) => {
    const resultReducers = {}; 
    Object.keys(reducers).forEach(K => {
        if (typeof reducers[k] === 'function') {
            resultReducers[k] = reducers[k];
        }
    });
    return (state, action) => {
        const newState = {};
        let hasChanged = false;
        Object.keys(resultReducers).forEach(k => {
            const reducer = resultReducers[k];
            const cacheStateForKey = state[k]; // 缓存上一次的 state for key
            const newStateForKey = reducer(cacheStateForKey, action);
            if (typeof newStateForKey === 'undefined') {
                throw new Error('reducer 必须有默认返回值');
            }
            newState[k] = newStateForKey;
            hasChanged = hasChanged || newStateForKey !== cacheStateForKey; // hasChanged 判断每个 state 是否有变化，有一个变化则需要更新
        })
        hasChanged = hasChanged || Object.keys(resultReducers).length !== Object.keys(state).length; // 判断是否有给了state 默认值，但reducer不合法的情况，有的话用最新的
        return hasChanged ? newState : state;
    }
}