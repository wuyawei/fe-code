import Router from './Router';
import {createHashHistory} from './history';
const HashRouter = ({children}) => {
    return <Router history={createHashHistory()} children={children}/>
}
export default HashRouter;