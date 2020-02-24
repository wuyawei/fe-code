// vscode 配置node提示 
// cnpm i typings -g
// typings install dt~node --global --save
const fs = require('fs');
const req = (modulePath) => {
    const module = {
        exports: {}
    }
    const content = fs.readFileSync(modulePath, 'utf-8');
    const fun = (module, exports, req) => {
        eval(content);
        return module.exports;
    }
    return fun(module, module.exports);
}
const log = req('./test.js');
log(1); // 1