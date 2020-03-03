import app from './app';
import img from './img/2.jpg';
console.log(util)
let myimg = util.createImg(img, document.querySelector("#app"));
let ele = app();
document.querySelector("#app").appendChild(ele);
if (module.hot) {
    module.hot.accept('./app.js', function() {
        document.querySelector("#app").removeChild(ele);
        ele = app();
        document.querySelector("#app").appendChild(ele);
    })
}