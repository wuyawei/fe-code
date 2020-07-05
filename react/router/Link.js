import React, {useContext} from 'react'; 
import RouterContext from './RouterContext';

const resolveToLocation = (to, location) => {
    return typeof to === 'function' ? to(location) : to;
}
const isModifiedEvent = (event) => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
const LinkAnchor = ({
    navigate,
    onClick,
    ...rest
}) => {
    let props = {
        ...rest,
        onClick: event => {
          try {
            if (onClick) onClick(event);
          } catch (ex) {
            event.preventDefault();
            throw ex;
          }
          if (
            !event.defaultPrevented && // 阻止 click
            event.button === 0 && // 忽略 左键
            (!target || target === "_self") && // 浏览器自己处理 "target=_blank" 等
            !isModifiedEvent(event) // 忽略带有 修饰键（ctrl/ALT...） 的点击
          ) {
            event.preventDefault();
            navigate();
          }
        }
    };
    return <a {...props}/>
}
const Link = ({replace, to, component = LinkAnchor, ...rest}) => {
    const { history, location } = useContext(RouterContext);
    const href = location ? history.createHref(location) : "";
    const props = {
        ...rest,
        href,
        navigate() {
          const _location = resolveToLocation(to, location);
          const method = replace ? history.replace : history.push;
          method(_location);
        }
    };
    return React.createElement(component, props);
}