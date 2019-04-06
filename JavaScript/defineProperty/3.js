function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            console.log('get');
            return val;
        },
        set: function(newVal) {
            console.log('set');
            val += newVal;
        }
    });
}
let obj = {name: '成龙大哥', say: '：其实我之前是拒绝拍这个游戏广告的，'};
Object.keys(obj).forEach(k => {
    defineReactive(obj, k, obj[k]);
});
console.log(obj.name + obj.say);

// obj.say = '后来我试玩了一下，哇，好热血，蛮好玩的';
// console.log(obj.name + obj.say);