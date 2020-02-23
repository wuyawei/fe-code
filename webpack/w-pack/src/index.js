#! /usr/bin/env node
const path = require('path');
const fs = require('fs');
// 默认配置
const defaultConfig = {
  entry:'./src/index.js',
  outputPath: './dist',
  output:{
    filename:'bundle.js'
  }
}

const config = {...defaultConfig, ...require(path.resolve('./w.config.js'))};

class WPack {
    constructor(config) {
        this.root = process.cwd(); // 工作路径
        this.config = config;
        this.entry = config.entry; //入口文件
        this.output = config.output; //出口配置
        this.modules = {}; // 收集依赖文件及内容
    }
    parseFile(content, parentPath) {
        const deps = [];
        const code = content.replace(/require\('(.*)'\)/g, ($, $1) => {
            const depPath = `./${path.join(parentPath, $1)}`.replace(/\\/g, '/');
            deps.push(depPath);
            return `__w_require__("${depPath}")`;
        });
        return {
            code,
            deps
        };
    }
    createModules(modulePath, name) {
         // 读取文件内容
        const fileContent = fs.readFileSync(modulePath,'utf-8');
        // 替换 require 为 __w_require__,并收集文件中的其它文件依赖; path.dirname 字符串转成目录层级
        const {code, deps} = this.parseFile(fileContent, path.dirname(name));
        this.modules[name] = `function(module, exports, __w_require__){
            eval(\`${code}\`)
        }`;
        deps.forEach(dep => {
            this.createModules(path.resolve(this.root, dep), dep); // 文件引用路径作为name
        });
    }
    stringifyModule(modules){
        let depsContent = "";
        Object.keys(modules).forEach(name=>{
            depsContent += `"${name}":${modules[name]},`
        })
        return depsContent;
    }
    outputFile() {
        let outputContent = fs.readFileSync(path.resolve(__dirname, './output.js'),'utf-8');
        outputContent = outputContent.replace('__entry__', this.entry)
        .replace('__depsContent__', this.stringifyModule(this.modules));

        fs.writeFileSync(`${this.config.outputPath}/`+this.output.filename, outputContent);
    }
    run() {
        console.log('启动了');
        this.createModules(path.resolve(this.root, this.entry), this.entry); // 文件引用路径作为name
        console.log(this.modules);
        this.outputFile();
        console.log('build end');
    }
}
const w = new WPack(config);
w.run();