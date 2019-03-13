在线解析 http://esprima.org/demo/parse.html#
相关文章 https://segmentfault.com/a/1190000016231512
## ast 抽象语法树
> Babel、webpack等许多前端工具都用到了ast

  Babel的编译过程和大多数其他语言的编译器大致相同，可以分为三个阶段。
  
1. 解析(PARSE)：将代码字符串解析成抽象语法树。
2. 转换(TRANSFORM)：对抽象语法树进行转换操作。
3. 生成(GENERATE): 根据变换后的抽象语法树再生成代码字符串。

### ast的常用包 recast
* 安装 
```
    npm i recast -S
```
* 使用 运行 node read ast 查看ast中的js语法树
``` javascript
    recast.parse(code); // 解析器
    recast.visit // 遍历
    const {variableDeclaration, variableDeclarator, functionExpression} = recast.types.builders; // 模具
    recast.print(ast).code; // 还原成code 
    recast.prettyPrint(ast, { tabWidth: 2 }).code; //还原时可以指定参数
    // 即
    recast.print(recast.parse(source)).code === source
    // TNT，即recast.types.namedTypes  判断AST对象类型
    // TNT.Node.assert() 类型不匹配
    // TNT.Node.check()  判断类型是否一致，并输出False和True
    // Node可以替换成任意AST对象，例如TNT.ExpressionStatement.check(),TNT.FunctionDeclaration.assert()
```
  