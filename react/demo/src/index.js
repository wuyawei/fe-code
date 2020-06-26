// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
import React from './core-old/index';
// React.render('ohnanan', document.getElementById('root'))

const onClick = (e) => {
    alert(e.target.id);
}
// React.render(React.createElement('div', {id: 'test', onClick}, '点我'), document.getElementById('root'))

class Count extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            text: '呵呵'
        }
    }
    render() {
        return React.createElement('div', this.props, this.state.text);
    }
}
React.render(React.createElement(Count, {id: 'test', onClick}), document.getElementById('root'))