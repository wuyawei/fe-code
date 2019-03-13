const recast  = require('recast');
const TNT = recast.types.namedTypes;
recast.run( function(ast, printSource){ // 读取js语法树
    // printSource(ast) // 控制台打印
    recast.visit(ast, { // 遍历语法树
        visitExpressionStatement: function({node}) {
            // console.log(node); // AST对象
            // printSource(node); // AST对象对应的源码
            // 判断是否为ExpressionStatement，正确则输出一行字。
            // if(TNT.ExpressionStatement.check(node)){
            //     console.log('这是一个ExpressionStatement')
            // }
            // 判断是否为ExpressionStatement，正确不输出，错误则全局报错
            TNT.ExpressionStatement.assert(node);
            return false
            // return false  或者以下写法
            // this.traverse(path) // path.node
        }
    });
});