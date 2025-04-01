## 1. 语言深度与 Web 平台核心

> 精通 JS/TS，深入理解浏览器、网络和基础原理。

-   **计算机原理与网络**:
    -   **进程与线程**: 浏览器多进程模型, JS 单线程与 Web Workers。
    -   **网络协议**: HTTP/1.1, HTTP/2, HTTP/3 核心特性与差异; HTTPS 与 TLS/SSL。
    -   浏览器渲染机制: 关键渲染路径 (CRP) 详解与优化。
    -   浏览器缓存: 强缓存与协商缓存策略。
-   **JavaScript/TypeScript**:
    -   精通 ES6 至 ES2025+ 核心特性与最佳实践 (持续关注 TC39)。
    -   深入理解异步编程: Event Loop (宏/微任务), Promise, async/await。
    -   掌握函数式编程思想及应用。
    -   TypeScript 高级应用: 泛型, 条件类型, 类型守卫, `tsconfig.json` 精调。
    -   底层机制: 原型链, 作用域与闭包, `this`, 内存管理与 V8 GC。
-   **HTML/CSS**:
    -   语义化与 Web 可访问性 (a11y) 高级实践 (ARIA)。
    -   精通现代布局: Flexbox, Grid。
    -   CSS 工程化方案: CSS 变量, 预处理器 (Sass/Less), 原子化 CSS (如 **Tailwind CSS**)。
    -   CSS 性能优化: 动画 GPU 加速, `will-change`。

## 2. 工程化与效能提升

> 掌握全链路工程化，提升开发效率、质量和部署能力。

-   **构建工具链**:
    -   深入理解 **Vite** 或 **Webpack** (原理, 插件, 优化)。
    -   关注 **Turbopack / Rspack / ESBuild** 等新一代工具。
    -   **构建速度优化** 策略。
-   **开发流程与规范**:
    -   **包管理 (npm/yarn/pnpm)** 与 **Monorepo** (pnpm workspace/Turborepo)。
    - **Monorepo** 架构实践
    -   **模块化系统 (ES Modules)** 深入应用。
    -   代码规范与质量保证 (ESLint, Prettier, TS)。
    -   自动化测试 (单元, 集成, E2E - Jest/Vitest, Cypress/Playwright)。
    -   CI/CD 实践。
-   **云与部署**:
    -   **云计算模型 (IaaS, PaaS, SaaS)**: 理解基础概念。
    -   **Serverless** 概念与实践 (Vercel, Netlify)。
    -   **容器化** 基础 (Docker)。


## 3. 框架精通与架构设计

> 熟练运用主流框架，具备复杂应用架构能力。

-   **框架原理与生态**:
    -   **React**: 原理 (Fiber, Hooks), 生态 (Router, **Next.js**), 状态管理 (Redux/Zustand 等)。
    -   **Vue**: 原理 (响应式, Composition API), 生态 (Router, **Nuxt.js**), 状态管理 (Pinia/Vuex)。
    -   了解 **Svelte/Solid.js** 等新兴框架设计思想。
-   **前端架构**:
    -   组件化与模块化设计。
    -   大型项目状态管理策略。
    -   **微前端** 架构方案 (如 **qiankun**, Module Federation)。

## 4. 性能优化与安全保障

> 具备极致优化能力和全面安全防护思维。

-   **Web 性能优化**:
    -   **页面加载速度** 优化 (Web Vitals, CRP, 资源优化, 网络优化, 缓存)。
    -   运行时性能优化 (JS 执行, 渲染优化)。
    -   性能监控与分析工具 (DevTools, Lighthouse)。
-   **Web 安全**:
    -   深入理解 **XSS / CSRF** 等**常见攻击手段**原理。
    -   掌握防御策略: 输出转义, CSP, HttpOnly/SameSite, CSRF Token, CORS。

## 5. Node.js与服务端开发

> 掌握 Node.js 后端开发能力。
-   **核心技术**:
    -   深入理解**事件循环与异步 I/O 模型**。
    -   熟练运用 **Stream** 流处理与 **Buffer**。
    -   Node.js **模块系统 (CJS/ESM)** 与互操作。
    -   **性能调优**与**内存管理 (GC 监控)**。
-   **Web 服务与 API 开发**:
    -   使用 **Express / Koa / NestJS** 等框架构建 **RESTful API** 或 **GraphQL API**。
    -   中间件原理与实践。
    -   **数据库交互**: ORM (如 Prisma, TypeORM) 或 ODM (如 Mongoose) 的基本使用。
    -   **身份验证与授权**: JWT, OAuth 基础。
-   **(工程化侧重)** 工具链开发:
    -   开发复杂的 **npm 包 / CLI** 工具 (文件操作, 进程通信等)。
    -   编写构建工具插件 (Webpack/Vite)。
    
## 6. AI 赋能与前沿探索

> 探索 AI 在前端领域的应用。

-   **AI 核心概念理解**:
    -   **Agent** 的概念与实现思路。
    -   **RAG (检索增强生成)** 的原理与应用。
    -   **记忆 (Memory)** 在会话式 AI 中的作用。
-   **AI 辅助开发**:
    -   高效利用 AI 编码助手 (**Cursor, Copilot, Fig** 等) 进行代码生成、解释、调试。
    -   **Prompt 工程**技巧，提升与 AI 协作的效率。
    -   探索 AI 驱动的 UI 设计/原型生成工具 (如 v0.dev)。
-   **前端集成 AI 能力**:
    -   调用 LLM API (如 OpenAI, Claude) 为应用增加智能交互 (Chatbots, 内容生成)。
    -   了解客户端 AI (如 **TensorFlow.js**) 的基础应用场景 (简单模型推理)。
    -   使用 AI 相关 SDK/框架简化集成 (**LangChain.js, Vercel AI SDK** 等)。
-   **(了解) AI 框架与平台**:
    -   了解 **AutoGPT / CrewAI / MetaGPT** 等 Agent 框架的设计思想。
