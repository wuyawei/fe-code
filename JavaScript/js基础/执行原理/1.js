// function bar() {
// 	console.log(n);
// }
// function foo() {
// 	var n = 1;
// 	bar();
// }
// var n = 2;
// foo(); // 2

function foo() {
	function bar() {
		console.log(n);
	}
	var n = 1;
	bar();
}
var n = 2;
foo(); // 1