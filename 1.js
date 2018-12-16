/**
 * Created by wyw on 2018/12/16.
 */
function Person(name){
    this.name=name;
}

Person.prototype.share=[];

Person.prototype.printName=function(callback){
    callback();
};

let zhangsan = new Person('zhangsan');
zhangsan.printName(_ => {
    console.log(zhangsan.name);
});

let lisi = new Person('lisi');