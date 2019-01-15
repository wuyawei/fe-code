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
//         this.hy = val;
//     }
// })
// ironman.hobbies[1] = 123;
// ironman.hobbies.push('wine')
// ironman['hy']='1111111'
// console.log(ironman)
var arr = [1,2,3,4]
arr.forEach((item,index)=>{
    Object.defineProperty(arr,index,{
        set:function(val){
            console.log('set')
            item = val
        },
        get:function(val){
            console.log('get')
            return item
        }
    })
})
// arr[1]; // get  2
arr[1] = 1; // set  1
console.log(arr[1]);