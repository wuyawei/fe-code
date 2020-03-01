const logName = require('./log.js');
const name = require('./name.js');
const composeName = require('../util/composeName.js');
require('./style.css');
logName(name);
const createComponent = () => {
    const div = document.createElement('div');
    div.classList.add('name');
    div.innerText = composeName(name);
    document.body.appendChild(div);
}
createComponent();