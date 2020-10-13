// new Person('lisi').say('hello').sleep(5000).age(10).getAge()
// 输出
// lisi
// hello
// 等待5s
// getAge 输出 10

class Person{
    constructor(name) {
        console.log("Person -> constructor -> name", name); 
    }
    say(val) {
        console.log("Person -> say -> val", val);
        return this;
    }
    sleep(time) {
        const pre = Date.now();
        while(Date.now() - pre <= time) {

        }
        return this;
    }
    age(age) {
        this.age=age;
        return this;
    }
    getAge() {
        console.log(this.age);
    }
}

new Person('lisi').say('hello').sleep(5000).age(10).getAge()