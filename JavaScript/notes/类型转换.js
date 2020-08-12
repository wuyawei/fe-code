/* 
toString
1. 基本类型值的字符串化规则为：null 转换为 "null"，undefined 转换为 "undefined"，true转换为 "true"。数字的字符串化则遵循通用规则，极大值或极小值例外（指数）。
2. 普通对象的 toString/Object.prototype.toString，返回 [[class]] 值， 如"[object Object]"，最终用的是 ToPrimitive 方法。
3. 自己重新定义了 toString ，则用自己定义的。
*/

/* 
JSON.stringify()
1.如果对象定义了 toJson ，JSON.stringify 会先调用 toJson 得到返回值再将返回值序列化。
2.第二个参数 replacer，可以传字符串数组或函数，指定序列化时忽略哪些属性或者只要哪些属性。
*/


/* 
ToNumber
1. true 转换为 1，false 转换为 0。undefined 转换为 NaN，null 转换为 0。
2. 对象（包括数组）会首先被转换为相应的基本类型值，如果返回的是非数字的基本类型值，则再遵循以上规则将其强制转换为数字（ToPrimitive）。
*/