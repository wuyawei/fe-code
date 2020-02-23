!function(modules) {
    const installModules = {};
    function __w_require__(moduleId) {
        // 是否缓存
        if(installModules[moduleId]){
            return installModules[moduleId].exports
        };
        let module = installModules[moduleId] = {
            exports: {}
        };
        modules[moduleId].call(modules.exports, module, module.exports, __w_require__);
        return module.exports;
    }
    return __w_require__('./test/index.js');
}({"./test/index.js":function(module, exports, __w_require__){
            eval(`const logName = __w_require__("./test/log.js");
const name = __w_require__("./test/name.js");
logName(name);`)
        },"./test/log.js":function(module, exports, __w_require__){
            eval(`const composeName = __w_require__("./util/composeName.js");
const log = (name) => {
    console.log(composeName(name));
}
module.exports = log;`)
        },"./util/composeName.js":function(module, exports, __w_require__){
            eval(`module.exports = (name) => {
    return '我的名字叫'+name;
}`)
        },"./test/name.js":function(module, exports, __w_require__){
            eval(`module.exports = '张三';`)
        },});