function sayHello(person: string) {
    return 'Hello, ' + person;
}
let user = '2';
console.log(sayHello(user));

let isMan: boolean = true;
let age: number = 12;
let Name: string = '张三';
let u: undefined = undefined;
let n: null = null;

function logInfo():void {
    console.log(`${Name}${isMan ? '是' : '不是'}男生，今年${age}岁;`);
    return n;
}
logInfo()
let value: any = 12;
console.log(value.text)
let strAndNum: string | number = 12;
strAndNum = '13';
console.log(strAndNum)

interface Person {
    readonly id ?: number; // 只读且可以不写
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};

setTimeout(() => {
    tom = {
        id: 123,
        name: 'Tom',
        gender: 'male'
    }
    console.log(tom)
}, 1000)

let numList: number[] = [1, 3, 5, 7, 9];
let strList: Array<string> = ['1', '3', '5', '7', '9'];
let anyList: any[] = ['1', 3, {}];