/**
 * Created by wyw on 2019/2/26.
 */

function Person(){
    this.say = function(){
        console.log('Person');
    }
}
Person.prototype.say = function(){
    console.log('Person.prototype');
};

function Zs(){
     this.say = function(){
         console.log('Zs');
     }
}

Zs.prototype = Person.__proto__;
let zs = new Zs();
console.log(Person.prototype);
console.log(new Person());
console.log(Zs.prototype);
console.log(zs);
console.log(zs instanceof Zs);
zs.say();