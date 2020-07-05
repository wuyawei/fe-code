import React, {useContext} from 'react'; 
import RouterContext from './RouterContext';

const resolveToLocation = (to, location) => {
    return typeof to === 'function' ? to(location) : to;
}
const Redirect = ({to, push, computedMatch}) => {
    const context = useContext(RouterContext);
    const method = push ? history.push : history.replace;
    const _location = resolveToLocation(to, location);
    method(_location);
    return null;
}
export default Redirect;