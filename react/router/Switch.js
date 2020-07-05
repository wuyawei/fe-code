import React, {useContext} from 'react'; 
import RouterContext from './RouterContext';
import matchPath from './matchPath';

const Switch = ({children, ...props}) => {
    const context = useContext(RouterContext);
    const location = props.location || context.location;

    let element, match;
    // 匹配到第一个成功，就停止
    React.Children.forEach(this.props.children, child => {
        if (match == null && React.isValidElement(child)) {
          element = child;
          const path = child.props.path || child.props.from;
          match = path
            ? matchPath(location.pathname, { ...child.props, path })
            : context.match;
        }
    });
    return <>
        {match
            ? React.cloneElement(element, { location, computedMatch: match })
            : null
        }
    </>
}
export default Switch;