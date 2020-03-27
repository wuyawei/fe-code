const path = require('path');
const loaderUtils = require('loader-utils'); // 获取loader配置参数 options
const schemaUtils = require('schema-utils'); // 校验options参数类型
module.exports = function(source) {
    // source 源内容 或者是上个loader处理后的内容
    const options = loaderUtils.getOptions(this); // 获取options
    return source;
}