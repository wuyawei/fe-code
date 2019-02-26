import app from './app';
import img from './1.jpg';
let myimg = new Image();
myimg.src = img;
myimg.style.width="520px";
let ele = app();
document.querySelector("#app").appendChild(myimg);
document.querySelector("#app").appendChild(ele);
if (module.hot) {
    module.hot.accept('./app.js', function() {
        document.querySelector("#app").removeChild(ele);
        ele = app();
        document.querySelector("#app").appendChild(ele);
    })
}