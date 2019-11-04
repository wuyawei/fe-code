function sayHello(person) {
    return 'Hello, ' + person;
}
var user = '2';
console.log(sayHello(user));
var isMan = true;
var age = 12;
var Name = '张三';
var u = undefined;
var n = null;
function logInfo() {
    console.log("" + Name + (isMan ? '是' : '不是') + "\u7537\u751F\uFF0C\u4ECA\u5E74" + age + "\u5C81;");
    return undefined;
}
logInfo();
var value = 12;
console.log(value.text);
var strAndNum = 12;
strAndNum = '13';
console.log(strAndNum);
var tom = {
    name: 'Tom',
    gender: 'male'
};
setTimeout(function () {
    tom = {
        id: 123,
        name: 'Tom',
        gender: 'male'
    };
    console.log(tom);
}, 1000);
var numList = [1, 3, 5, 7, 9];
var strList = ['1', '3', '5', '7', '9'];
var anyList = ['1', 3, {}];
function getName() {
    return 'hi';
}
console.log(getName());
var Directions;
(function (Directions) {
    Directions[Directions["Up"] = 'Up'] = "Up";
    Directions[Directions["Down"] = 1] = "Down";
    Directions[Directions["Left"] = 2] = "Left";
    Directions[Directions["Right"] = 3] = "Right";
})(Directions || (Directions = {}));
var directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
console.log(directions);
var colors = [0 /* red */, 1 /* yellow */, 2 /* blue */];
console.log(colors);
var Tick = /** @class */ (function () {
    function Tick(render) {
        this.render = render;
        this.queue = [];
        this.render = render;
    }
    Tick.prototype.push = function (task) {
        this.queue.push(task);
    };
    Tick.prototype.nextTick = function () {
        this.render();
        // ...
    };
    return Tick;
}());
var tick = new Tick(function () { console.log('hi'); });
// let tick1 = new Tick(666);
tick.nextTick();
var Car = /** @class */ (function () {
    function Car() {
    }
    Car.prototype.alert = function () {
        console.log('Car alert');
    };
    Car.prototype.lightOn = function () {
        console.log('Car light on');
    };
    Car.prototype.lightOff = function () {
        console.log('Car light off');
    };
    return Car;
}());
function copyFields(target, source) {
    for (var id in source) {
        target[id] = source[id];
    }
    return target;
}
var x = { a: 1, b: 2, c: 3, d: 4 };
console.log(copyFields(x, { b: 10, d: 20 }));
