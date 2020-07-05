import React, {useContext} from 'react'; 
import RouterContext from './RouterContext';
import matchPath from './matchPath';

const Route = ({computedMatch, component, render, children, ...args}) => {
    const context = useContext(RouterContext);
    const location = args.location || context.location;
    // computedMatch Switch 中计算好的 match
    const props = {
        ...context,
        location,
        match: computedMatch ? computedMatch : args.path ? matchPath(location.pathname, args) : context.match
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