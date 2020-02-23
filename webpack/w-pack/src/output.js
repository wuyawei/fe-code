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
    return __w_require__('__entry__');
}({__depsContent__});