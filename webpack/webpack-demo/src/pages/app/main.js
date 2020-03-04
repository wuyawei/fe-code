import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import {
    BrowserRouter as Router, Route, Switch
} from 'react-router-dom';
import { render } from 'react-dom';
import App from './app';
import Test from './test';
import img from 'static/img/2.jpg';

const Main = hot(() => {
    useEffect(() => {
        util.createImg(img, document.querySelector("#app"));
    }, [])
    return <Router>
                <Switch>
                    <Route path="/test" exact component={Test}></Route>
                    <Route path="/" exact component={App}></Route>
                </Switch>
            </Router>
});
export default render(<Main />, document.getElementById('app'));