import React, {useContext} from 'react';
import RouterContext from './RouterContext';
import HistoryContext from './HistoryContext';
import matchPath from './matchPath';

export const useHistory = () => {
    return useContext(HistoryContext);
}

export const useLocation = () => {
    const {location} = useContext(RouterContext);
    return location;
}

export const useParams = () => {
    const {match} = useContext(RouterContext);
    return match ? match.params : {};
}

export const useRouteMatch = (path) => {
    const {match, location} = useContext(RouterContext);
    return path ? matchPath(location.pathname, path) : match;
}