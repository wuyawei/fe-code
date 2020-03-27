class InlineScriptPlugin{
    constructor(options) {
        this.options = options;
    }
    apply(compiler){
        const that = this;
        compiler.hooks.compilation.tap('compilation', function(compilation) {
            // htmlWebpackPluginAlertAssetTags  是 html-webpack-plugin 添加到 compilation 的钩子
            compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync('changeTags', function(data, callback){
                data.body.forEach(function(bodyTag){
                    const src = bodyTag.attributes.src;
                    delete bodyTag.attributes.src;
                    const souceKey = src.replace(that.options.regSrc, '$1');
                    const source = compilation.assets[souceKey].source();
                    bodyTag.innerHTML = source;
                });
                callback(null, data) // 将处理后的内容返回去
            })
        })
    }
}
module.exports = InlineScriptPlugin;