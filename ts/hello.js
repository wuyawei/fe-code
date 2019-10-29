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
    return n;
}
logInfo();
var value = 12;
console.log(value.text);
