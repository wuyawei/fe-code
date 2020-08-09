/* 
当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域之外执行，这时就产生了闭包。
1. 函数
2. 作用域外引用未销毁
*/

// for (var i=1; i<=5; i++) {     
//     try {
//         throw i;   
//     } catch (j) {
//         console.log(j)     
//         setTimeout( 
//             function timer() {             
//                 console.log( j );        
//             }, 
//         j*1000 );
//     }
// }

// for (var i=1; i<=5; i++) {     
//     let j = i;
//     setTimeout( 
//         function timer() {             
//             console.log( j );        
//         }, 
//     j*1000 );
// }

// for (let i=1; i<=5; i++) {      
//     setTimeout( 
//         function timer() {             
//             console.log( i );        
//         }, 
//     i*1000 );
// }

// for (var i=1; i<=5; i++) {     
//     const j = i;
//     setTimeout( 
//         function timer() {             
//             console.log( j );        
//         }, 
//     j*1000 );
// }

// for (var i=1; i<=5; i++) {     
//     (function(j) {
//         setTimeout( 
//             function timer() {             
//                 console.log( j );        
//             }, 
//         j*1000 )
//     })(i)
// }