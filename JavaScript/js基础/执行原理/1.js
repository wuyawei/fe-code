// function bar() {
// 	console.log(n);
// }
// function foo() {
// 	var n = 1;
// 	bar();
// }
// var n = 2;
// foo(); // 2

// function foo() {
// 	function bar() {
// 		console.log(n);
// 	}
// 	var n = 1;
// 	bar();
// }
// var n = 2;
// foo(); // 1

const a = {
	a: 1
}
Object.defineProperty(a, 'a', {
	// enumerable: false
	get() {
		return 2
	}
})
// for (let k in a) {
//     console.log("k", k);
// }
// console.log(Object.keys(a))
// console.log("Object.getOwnPropertyNames(a)", Object.getOwnPropertyNames(a)) 
// console.log("Reflect.ownKeys(a)", Reflect.ownKeys(a))
a.a = 3;
console.log(a.a)