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
    return undefined;
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

function getName(): string {
    return 'hi'
}

console.log(getName())

enum Directions {
    Up = <any>'Up',
    Down = 1,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
console.log(directions)


const enum Colors {
    red,
    yellow,
    blue
}

const colors = [Colors.red, Colors.yellow, Colors.blue];
console.log(colors)

class Tick {
    public queue: any[] = [];
    constructor(public render: () => any) {
        this.render = render;
    }
    push(task: ()=> any): void {
        this.queue.push(task);
    }
    nextTick(): void {
        this.render()
        // ...
    }
}

let tick = new Tick(() => {console.log('hi')});
// let tick1 = new Tick(666);
tick.nextTick();


interface Alarm {
    alert();
}

interface Light {
    lightOn();
    lightOff();
}

class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}

function copyFields<T extends U, U>(target: T, source: U): T {
    for (let id in source) {
        target[id] = (<T>source)[id];
    }
    return target;
}

let x = { a: 1, b: 2, c: 3, d: 4 };

console.log(copyFields(x, { b: 10, d: 20 }));

interface A {a:number};
interface B {b:string};

const a:A = {a:1};
const b:B = {b:'1'};
const ab:A&B = {...a, b: '233'};


class Pepole<U> {
    who: U;
    
    constructor(who: U) {
        this.who = who;
    }

    say(code:U): string {
        return this.who + ' :i am ' + code;
    }
}

let zs =  new Pepole(123);
console.log(zs)

function convert<T>(input:T):T{
    return input;
}

// 定义泛型类型
interface Convert {
    <T>(input:T):T
}

let convert2 = convert;
let convert3: Convert = s => s;
console.log(convert2('666'), convert3('999'))

let arr = []; // :any[]
arr.push('233');

type A1 = Exclude<number|string, string|number[]>

const abc:A1 = 123;
// 兼容
type A2 = Exclude<number|string, number|boolean>
// 相同或兼容类型筛除，不同则以前一个为准
const abcd:A2 = '123';

type Ex = string extends '123' ? string : '123';
const Ex:Ex = '123';

type Tail<T extends any[]> = ((...args: T) => void) extends ((a: number, ...args: infer Ts) => void) ? Ts : never;

const ts1: Tail<any[]> = ['1', '2', '3'];