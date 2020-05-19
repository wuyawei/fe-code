const createStore = (reducer,initState) => {
    let currentState = initState;
    let currentListeners = [];
    const getState = () => currentState;
    const subscribe = (listener) => {
        currentListeners.push(listener);
        const unSubscribe = () => {
            currentListeners = currentListeners.filter(lis => lis !== listener);
        }
        return unSubscribe;
    }
    const dispatch = (action) => {
        currentState = reducer(currentState, action);
        currentListeners.forEach(fn => fn());
    }
    return {
        getState,
        dispatch,
        subscribe
    }
}