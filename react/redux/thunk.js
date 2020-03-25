const createThunkMiddleware = (extraArgument) => ({dispatch, getState}) => next => action => {
    if (typeof action === 'function') {
        return action(dispatch, getState, extraArgument);
    }
    return next(action);
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

// const api = "http://www.example.com/sandwiches/";
// const whatever = 42;
// const store = createStore(
//   reducer,
//   applyMiddleware(thunk.withExtraArgument({ api, whatever })),
// );
// function fetchUser(id) {
//   return (dispatch, getState, { api, whatever }) => {
//     // ...
//   };
// }