## 三、(工程化) 工具链与 CLI 开发

Node.js 不仅仅用于构建 Web 服务器，它在前端工程化领域也扮演着至关重要的角色。几乎所有的现代前端构建工具、脚手架、代码检查器等都是基于 Node.js 开发的。本章将探讨如何利用 Node.js 开发实用的 NPM 包、命令行接口 (CLI) 工具以及构建工具插件。

### 3.1 开发 NPM 包 / CLI 工具

将可复用的代码或工具封装成 NPM 包，既方便自己在不同项目中共享，也可以发布到 NPM 社区供他人使用。CLI 工具则能极大地提升开发效率和自动化水平。

#### 开发 NPM 包

-   **`package.json` 核心字段**:
    -   `name`: 包名，必须全局唯一且符合命名规范（小写字母、数字、`-`, `_`）。如果是带 scope 的包，格式为 `@scope/package-name`。
    -   `version`: 包的版本号，遵循 **语义化版本 (Semantic Versioning, SemVer)** 规范（`MAJOR.MINOR.PATCH`）。
        -   `MAJOR`: 不兼容的 API 变更。
        -   `MINOR`: 向下兼容的功能性新增。
        -   `PATCH`: 向下兼容的问题修正。
    -   `description`: 包的简短描述。
    -   `main`: 包的**入口文件**（CommonJS 模块）。当其他项目 `require('your-package')` 时，Node.js 会查找并加载这个文件。通常是 `index.js` 或编译后的 JS 文件。
    -   `module`: 包的**ES Module 入口文件**（如果提供 ESM 版本）。构建工具（如 Webpack, Rollup, Vite）会优先使用这个字段。
    -   `exports`: (Node.js v12.7.0+) 更现代、更强大的方式来**声明包的导出**，可以精确控制哪些文件或目录可以被外部访问，并可以同时指定 CJS 和 ESM 入口，以及条件导出（如根据 Node.js 版本或环境导出不同实现）。**推荐使用 `exports` 字段**来代替 `main` 和 `module`。
        ```json
        // package.json 中的 exports 示例
        "exports": {
          ".": { // 包的主入口 (require('your-package') or import 'your-package')
            "import": "./dist/index.mjs", // ESM 入口
            "require": "./dist/index.cjs"  // CJS 入口
          },
          "./feature": { // 导出子路径 (require('your-package/feature'))
            "import": "./dist/feature.mjs",
            "require": "./dist/feature.cjs"
          },
          "./package.json": "./package.json" // 允许访问 package.json
        }
        ```
    -   `type`: 指定包内 `.js` 文件默认使用的模块系统。`"module"` 表示 ESM，`"commonjs"` (默认) 表示 CJS。
    -   `files`: 一个数组，指定**发布到 NPM 时应包含**的文件或目录（白名单）。可以减少发布包的体积。默认包含 `package.json`, `README`, `LICENSE` 以及 `main` 指定的文件。通常包含编译后的代码 (`dist` 目录)、类型声明文件 (`*.d.ts`) 等。`.npmignore` 文件则用于指定忽略的文件（黑名单）。
    -   `bin`: 如果你的包是一个 CLI 工具，这个字段用于指定可执行文件的路径。NPM 在全局或项目本地安装时，会将这里指定的文件链接到 `node_modules/.bin/` 目录下或全局 `bin` 目录，使其可以直接在命令行执行。
        ```json
        // package.json 中的 bin 示例
        "bin": {
          "my-cli-tool": "./bin/cli.js" // 命令名 -> 可执行文件路径
        }
        ```
    -   `scripts`: 定义一些可以通过 `npm run <script-name>` 执行的脚本命令（如 `test`, `build`, `lint`）。
    -   `dependencies`: 生产环境依赖。这些包是你的包**正常运行所必需**的。
    -   `devDependencies`: 开发环境依赖。这些包仅在**开发和测试**时需要（如测试框架、构建工具、Linter）。默认不会被安装到使用你的包的项目中。
    -   `peerDependencies`: 同等依赖。指定你的包**兼容**的宿主环境（通常是某个框架或库）的版本范围。安装你的包时，如果宿主项目中没有安装符合范围的同等依赖，NPM 会给出警告。你的包**不应**直接依赖这些包（假设宿主环境会提供）。
    -   `repository`, `keywords`, `author`, `license` 等元数据字段。

-   **开发流程**:
    1.  **初始化项目**: `npm init` 或 `npm init -y` 创建 `package.json`。
    2.  **编写代码**: 实现包的功能，遵循模块化原则。
    3.  **添加依赖**: `npm install <package>` 安装生产依赖，`npm install --save-dev <package>` (或 `-D`) 安装开发依赖。
    4.  **(可选) 编译/构建**: 如果使用 TypeScript 或需要转换代码，设置构建脚本（如使用 `tsc`, `babel`, `rollup`）将源码编译到 `dist` 目录。确保 `main`/`module`/`exports` 指向编译后的文件，并将源码目录添加到 `.npmignore` 或从 `files` 中排除。
    5.  **编写测试**: 使用 Jest, Vitest 等框架编写单元测试和集成测试，并在 `package.json` 的 `scripts` 中添加 `test` 命令。
    6.  **本地测试/链接**: 使用 `npm link` 将当前包链接到全局，然后在另一个测试项目中运行 `npm link <your-package-name>` 来像使用已发布的包一样测试它。完成后记得 `npm unlink`。
    7.  **准备发布**:
        *   确保 `package.json` 信息完整准确。
        *   确保 `files` 字段或 `.npmignore` 配置正确，只包含必要文件。
        *   编写 `README.md` 说明文档。
        *   运行 `npm version <patch|minor|major>` 更新版本号（会自动打 Git Tag）。
    8.  **发布到 NPM**:
        *   注册 NPM 账号 (如果还没有)。
        *   在命令行运行 `npm login` 登录。
        *   运行 `npm publish` （如果包是带 scope 的，可能需要 `npm publish --access public`）。

#### 开发 CLI 工具

-   **目标**: 创建可以通过命令行直接调用的工具，用于自动化任务、项目脚手架、代码生成等。
-   **核心技术**:
    1.  **指定可执行文件**: 在 `package.json` 中使用 `bin` 字段。
    2.  **Shebang (#! /usr/bin/env node)**: 在可执行脚本文件 (如 `bin/cli.js`) 的**第一行**添加 Shebang，告诉操作系统使用 `node` 来执行这个脚本。
    3.  **解析命令行参数与选项**:
        *   直接使用 `process.argv`: 最原始的方式，需要手动解析参数数组。
        *   **使用库 (推荐)**:
            *   `yargs`: 功能强大、灵活的命令行参数解析库，支持命令、选项、别名、类型检查、帮助信息生成等。
            *   `commander`: 另一个流行且易于使用的库，API 简洁。
    4.  **与用户交互**:
        *   `inquirer`: 提供各种交互式命令行界面元素，如提问、列表选择、确认等，用于获取用户输入。
    5.  **命令行输出样式**:
        *   `chalk`: 添加颜色和样式的库，使输出更易读、更吸引人。
        *   `ora`: 显示加载中的 Spinner 动画。
        *   `boxen`: 创建带边框的文本框。
    6.  **文件系统操作**: 使用 Node.js 内置的 `fs` 模块（推荐 `fs.promises`）进行文件和目录的读写、创建、删除、遍历等操作。
    7.  **执行其他命令**: 使用 `child_process` 模块（如 `spawn` 或 `execa` 库）执行其他 shell 命令或脚本。
    8.  **模板引擎**: 如果 CLI 用于生成项目文件，可以使用模板引擎（如 `ejs`, `handlebars`）根据用户输入动态生成文件内容。

```javascript
#!/usr/bin/env node
// bin/my-cli-tool.js (假设这是 package.json 中 bin 指定的文件)

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

// 使用 yargs 定义命令、选项和处理逻辑
yargs(hideBin(process.argv))
  .command( // 定义一个命令 'create <project-name>'
    'create <project-name>',
    '创建一个新项目',
    (yargs) => { // 配置命令的选项
      return yargs
        .positional('project-name', {
          describe: '项目名称',
          type: 'string',
        })
        .option('template', {
          alias: 't',
          type: 'string',
          description: '使用的模板 (e.g., react, vue)',
          default: 'default',
        })
        .option('git', {
            type: 'boolean',
            description: '是否初始化 Git 仓库',
            default: false
        });
    },
    async (argv) => { // 命令的处理函数
      console.log(chalk.green(`准备创建项目: ${argv.projectName}`));
      console.log(chalk.blue(`使用模板: ${argv.template}`));

      const projectPath = path.resolve(process.cwd(), argv.projectName);

      try {
        // 检查目录是否存在
        await fs.access(projectPath);
        console.error(chalk.red(`错误: 目录 "${argv.projectName}" 已存在.`));
        process.exit(1);
      } catch (err) {
        // 目录不存在，可以继续
      }

      // 使用 inquirer 进行交互式提问 (示例)
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmCreation',
          message: `确认在 "${projectPath}" 创建项目吗?`,
          default: true,
        },
      ]);

      if (!answers.confirmCreation) {
        console.log(chalk.yellow('操作已取消.'));
        process.exit(0);
      }

      console.log(chalk.cyan('正在创建项目结构...'));
      // 在这里添加创建目录、复制模板文件、写入配置等逻辑...
      await fs.mkdir(projectPath, { recursive: true });
      await fs.writeFile(path.join(projectPath, 'README.md'), `# ${argv.projectName}\n`);
      console.log(chalk.green('项目创建成功!'));

      if (argv.git) {
          console.log(chalk.cyan('正在初始化 Git 仓库...'));
          // const { execa } = await import('execa'); // 使用 execa 执行命令
          // await execa('git', ['init'], { cwd: projectPath });
          console.log(chalk.green('Git 仓库初始化完成!'));
      }
    }
  )
  .demandCommand(1, '你需要指定一个命令 (例如: create)') // 要求至少一个命令
  .help() // 启用 --help 选项
  .alias('h', 'help')
  .strict() // 对未知命令或选项报错
  .argv; // 解析参数并执行

```

### 3.2 编写构建工具插件 (Webpack/Vite)

现代前端开发离不开构建工具（如 Webpack, Vite, Rollup, ESBuild）。这些工具通常提供了插件机制，允许开发者扩展其功能，实现自定义的构建逻辑。

#### 基本原理

-   **构建流程**: 构建工具通常会经历一系列阶段，如：
    1.  **配置解析**: 读取并处理配置文件。
    2.  **启动构建**: 初始化环境。
    3.  **依赖解析**: 从入口文件开始，分析模块间的依赖关系，构建模块依赖图。
    4.  **模块加载与转换**: 读取模块内容，并可能使用 **Loader** (Webpack) 或 **Transform Hook** (Rollup/Vite) 对模块代码进行转换（如 TS 转 JS, Sass 转 CSS, 图片优化）。
    5.  **代码生成与优化**: 将转换后的模块打包（Bundle）、进行代码分割 (Code Splitting)、Tree Shaking、压缩 (Minification) 等优化。
    6.  **资源输出**: 将最终生成的 JS, CSS, 图片等资源写入到输出目录。
-   **插件机制**:
    -   构建工具在其生命周期的不同阶段会触发**钩子 (Hooks)** 或**事件 (Events)**。
    -   插件是一个**对象或类**，它包含一个 `apply` 方法 (Webpack) 或一系列与钩子同名的方法 (Rollup/Vite)。
    -   在 `apply` 方法或钩子方法中，插件可以**注册回调函数**来监听特定的钩子/事件。
    -   当构建工具运行到触发该钩子的阶段时，就会执行插件注册的回调函数。
    -   回调函数可以访问构建过程中的上下文信息（如编译器对象 `compiler`, 编译对象 `compilation`, 模块信息, AST 等），并可以修改构建行为或产物。

#### Webpack Loader 与 Plugin

-   **Loader**:
    -   **作用**: 用于**转换特定类型文件的源代码**。Loader 是一个函数，接收源文件内容作为输入，返回转换后的内容。
    -   **链式调用**: 可以链式调用多个 Loader，上一个 Loader 的输出是下一个 Loader 的输入。
    -   **配置**: 在 `webpack.config.js` 的 `module.rules` 中配置，通过 `test` 匹配文件类型，`use` 指定使用的 Loader。
    -   **示例**: `babel-loader` (JS 转换), `css-loader` (处理 CSS `@import`/`url()`), `style-loader` (将 CSS 注入 DOM), `file-loader` (处理文件资源), `ts-loader` (编译 TS)。

```javascript
// 一个简单的 Webpack Loader 示例 (将 console.log 替换为 console.warn)
// my-log-loader.js
module.exports = function(source) {
  // this 上下文包含 Loader API
  console.log(`[MyLogLoader] Processing: ${this.resourcePath}`);
  const transformedSource = source.replace(/console\.log/g, 'console.warn');
  // 可以返回转换后的代码，也可以调用 this.callback 返回更多信息 (如 Source Map)
  return transformedSource;
};

// webpack.config.js (部分配置)
// module.exports = {
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         use: [
//           'babel-loader', // 先执行 babel-loader
//           path.resolve(__dirname, 'my-log-loader.js') // 再执行自定义 loader
//         ],
//         exclude: /node_modules/,
//       },
//     ],
//   },
// };
```

-   **Plugin**:
    -   **作用**: **更强大**，可以**钩入 Webpack 构建流程的几乎所有阶段**，执行更广泛的任务，如资源优化、环境变量注入、生成 HTML 文件、分析构建结果等。
    -   **实现**: 通常是一个**类 (Class)**，包含一个 `apply` 方法。`apply` 方法接收 `compiler` 对象作为参数。
    -   **钩子**: 在 `apply` 方法中，通过 `compiler.hooks.<hookName>.tap(pluginName, callback)` (同步钩子) 或 `tapAsync`/`tapPromise` (异步钩子) 来注册监听器。Webpack 提供了非常多的钩子（如 `run`, `compile`, `compilation`, `emit`, `done`）。
    -   **`compilation` 对象**: 在某些钩子（如 `compilation`, `emit`）的回调中可以访问 `compilation` 对象，它代表了一次具体的编译过程，包含模块、依赖、Chunk、Asset 等信息，插件通常通过操作 `compilation` 对象来修改构建结果。

```javascript
// 一个简单的 Webpack Plugin 示例 (在构建结束后打印信息)
// MyDonePlugin.js
class MyDonePlugin {
  // apply 方法会在 Webpack 启动时被调用一次
  apply(compiler) {
    // 注册 'done' 钩子 (在编译完成后触发)
    compiler.hooks.done.tap(
      'MyDonePlugin', // 插件名称，用于调试
      (stats /* stats 对象包含编译信息 */) => {
        console.log('\n-----------------------------');
        console.log('MyDonePlugin: 构建完成!');
        if (stats.hasErrors()) {
          console.error('构建包含错误.');
        } else {
          const duration = stats.endTime - stats.startTime;
          console.log(`构建耗时: ${duration}ms`);
        }
        console.log('-----------------------------\n');
      }
    );

    // 注册 'emit' 钩子 (在生成资源到 output 目录之前触发，可以修改资源)
    compiler.hooks.emit.tapAsync(
        'MyDonePlugin',
        (compilation, callback) => {
            console.log('MyDonePlugin: 即将生成资源...');
            // compilation.assets 包含所有即将输出的资源
            // 可以添加、修改或删除资源
            compilation.assets['extra-info.txt'] = {
                source: () => '这是一个由插件添加的文件内容。',
                size: () => Buffer.byteLength('这是一个由插件添加的文件内容。')
            };
            callback(); // 异步钩子需要调用 callback
        }
    );
  }
}
module.exports = MyDonePlugin;

// webpack.config.js (部分配置)
// const MyDonePlugin = require('./MyDonePlugin');
// module.exports = {
//   plugins: [
//     new MyDonePlugin(), // 实例化插件
//     // ... 其他插件
//   ],
// };
```

#### Vite Plugin

-   **统一接口**: Vite 的插件接口设计**同时服务于开发环境 (Dev Server) 和生产构建 (Rollup)**。插件格式**基于 Rollup 的插件接口**，并进行了一些 Vite 特有的扩展。
-   **钩子 (Hooks)**: 插件是一个包含各种**钩子方法**的对象。Vite 会在构建的不同阶段调用相应的钩子。
    -   **通用钩子 (Universal Hooks)**: 在开发和构建时都会调用（如 `options`, `buildStart`, `resolveId`, `load`, `transform`, `buildEnd`）。
    -   **Vite 独有钩子**: 仅在 Vite 特定场景下调用（如 `config`, `configureServer`, `transformIndexHtml`, `handleHotUpdate`）。
    -   **构建阶段钩子**: 仅在生产构建时调用（继承自 Rollup，如 `renderStart`, `renderChunk`, `generateBundle`, `writeBundle`）。
-   **常用钩子**:
    -   `config(config, { command })`: 修改 Vite 配置。
    -   `configureServer(server)`: 配置和扩展 Vite 开发服务器（添加中间件等）。
    -   `resolveId(source, importer)`: 自定义模块解析逻辑。
    -   `load(id)`: 加载模块内容。
    -   `transform(code, id)`: 转换模块代码。
    -   `transformIndexHtml(html)`: 转换 `index.html` 文件。
    -   `handleHotUpdate({ file, server })`: 自定义热更新处理逻辑。

```javascript
// 一个简单的 Vite Plugin 示例 (在 transform 钩子中注入全局变量)
// my-vite-plugin.js
export default function myVitePlugin() {
  const virtualModuleId = 'virtual:my-global-data'; // 定义一个虚拟模块 ID
  const resolvedVirtualModuleId = '\0' + virtualModuleId; // Rollup 约定，避免冲突

  return {
    name: 'my-vite-plugin', // 插件名称

    // resolveId 钩子：解析虚拟模块 ID
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },

    // load 钩子：为虚拟模块提供内容
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const globalData = { version: '1.0.0', buildTime: new Date().toISOString() };
        return `export const myGlobal = ${JSON.stringify(globalData)};`;
      }
    },

    // transform 钩子：在每个 JS/TS 模块顶部注入代码 (示例性，实际可能需要更精确匹配)
    transform(code, id) {
      if (id.includes('src/main.') || id.includes('src\\main.')) { // 仅在主入口注入
         // console.log(`[MyVitePlugin] Transforming: ${id}`);
         return {
             // 在代码顶部添加导入语句
             code: `import { myGlobal } from '${virtualModuleId}';\nconsole.log('My Global Data:', myGlobal);\n${code}`,
             map: null // 如果没有生成 Source Map，设为 null
         };
      }
    },

    // configureServer 钩子：给开发服务器添加中间件 (示例)
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            if (req.url === '/my-plugin-ping') {
                res.end('Pong from My Vite Plugin!');
            } else {
                next();
            }
        });
    }
  };
}

// vite.config.js (部分配置)
// import { defineConfig } from 'vite';
// import myVitePlugin from './my-vite-plugin';
//
// export default defineConfig({
//   plugins: [
//     myVitePlugin(), // 使用插件
//     // ... 其他插件 (如 @vitejs/plugin-react)
//   ],
// });

// 在你的 main.ts/js 中 (被 transform 注入后):
// import { myGlobal } from 'virtual:my-global-data';
// console.log('My Global Data:', myGlobal);
// ... 你的原始 main 代码 ...
```

#### 应用

-   **定制构建流程**: 实现特定的代码转换、资源优化、文件处理逻辑。
-   **集成第三方工具**: 将 Linter、测试框架、文档生成器等集成到构建过程中。
-   **开发框架或库**: 为特定框架或库提供构建支持和开发时特性（如 Vue/React 的 Vite/Webpack 插件）。
-   **注入环境变量或全局数据**: 在构建时动态注入配置信息。
-   **优化构建性能或产物**: 实现更精细的代码分割、资源预加载、按需编译等策略。