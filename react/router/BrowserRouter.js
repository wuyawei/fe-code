import Router from './Router';
import {createBrowserHistory} from './history';
const BrowserRouter = ({children}) => {
    return <Router history={createBrowserHistory()} children={children}/>
}
export default BrowserRouter;