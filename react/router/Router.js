import React, {useEffect} from 'react';
import RouterContext from './RouterContext';
import HistoryContext from './HistoryContext';

const computeRootMatch = (pathname) => {
    return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
}
const Router = ({history, children}) => {
    const [location, setlocation] = useState({})
    useEffect(() => {
        setlocation(history.location);
        const unListhen = history.listhen(({location}) => {
            setlocation(location);
        });
        return () => {
            unListhen && unListhen();
        }
    }, [])
    return <RouterContext.Provider value={{
        history,
        location,
        match: computeRootMatch(location.pathname)
    }}>
        <HistoryContext.Provider children={children} value={history}/>
    </RouterContext.Provider>
}

export default Router;