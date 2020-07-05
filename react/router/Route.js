import React, {useContext} from 'react'; 
import RouterContext from './RouterContext';
import matchPath from './matchPath';

const Route = ({path, computedMatch, component, to, render, children}) => {
    const context = useContext(RouterContext);
    const match = computedMatch || context.match;
    const props = {
        ...context,
        match: path ? matchPath(path) : context.match
    }
    return <RouterContext.Provider value={props}>
        {props.match
            ? children
                ? typeof children === "function"
                    ? children(props)
                    : children
                : component
                    ? React.createElement(component, props)
                    : render ? render(props) : null
            : null
        }
    </RouterContext.Provider>
}
export default Route;