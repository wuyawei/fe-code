let ironman = {
    hobbies: ['1', '23', '56'],
    hy: ''
}
// Object.defineProperty(ironman.hobbies, 'push', {
//     value () {
//         console.log(`Push ${arguments[0]} to ${this}`)
//         this[this.length] = arguments[0]
//     }
// })
// Object.defineProperty(ironman, 'hy', {
//     set (val) {
//         console.log(val);
//     }
// })
// ironman.hobbies[1] = 123;
// ironman.hobbies.push('wine')
// ironman['hy']='1111111'
// console.log(ironman)
// var arr = [1,2,3,4]
// arr.forEach((item,index)=>{
//     Object.defineProperty(arr,index,{
//         set:function(val){
//             console.log('set')
//             item = val
//         },
//         get:function(val){
//             console.log('get')
//             return item
//         }
//     })
// })
// arr[1]; // get  2
// arr[1] = 1; // set  1
// console.log(arr[1]);
// 这是将要被劫持的对象
const data = {
    name: 'hahaha',
    idea: {a: 'hahaha'}
};

function say(name) {
    if (name === '古天乐') {
        console.log('给大家推荐一款超好玩的游戏');
    } else if (name === '渣渣辉') {
        console.log('戏我演过很多,可游戏我只玩贪玩懒月');
    } else {
        console.log('来做我的兄弟');
    }
}
walk();

function walk() {
    Object.keys(data).forEach(key => convert(key, data[key]));
}
// 遍历对象,对其属性值进行劫持
function convert(key, val) {
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            console.log('get');
            return val;
        },
        set: function(newVal) {
            // 当属性值发生变化时我们可以进行额外操作
            console.log(`大家好,我系${newVal}`);
            say(newVal);
            val = newVal;
            console.log(val);
        }
    });
}
// data.name = '渣渣辉';
data.idea = {a: '222'};
console.log(data.idea);
