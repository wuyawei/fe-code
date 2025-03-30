## 一、HTML：内容结构与语义化

HTML (HyperText Markup Language) 是 Web 内容的骨架，它定义了页面的结构，并赋予内容语义。浏览器解析 HTML 来构建 DOM (Document Object Model)，这是后续 CSS 样式应用和 JavaScript 交互的基础。

### 1.1 核心概念

#### 1.1.1 文档结构 (Document Structure)

一个基本的 HTML 文档结构如下：

```html
<!DOCTYPE html> <!-- 文档类型声明，告知浏览器使用最新的 HTML 标准解析 -->
<html lang="zh-CN"> <!-- HTML 文档的根元素，lang 属性指定页面主要语言 -->
  <head>
    <!-- 元数据区域：包含文档的元信息，不会直接显示在页面上 -->
    <meta charset="UTF-8"> <!-- 指定文档的字符编码 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- 配置视口，用于响应式设计 -->
    <title>页面标题</title> <!-- 显示在浏览器标签页或窗口标题栏 -->
    <link rel="stylesheet" href="styles.css"> <!-- 链接外部 CSS 文件 -->
    <link rel="icon" href="favicon.ico" type="image/x-icon"> <!-- 网站图标 -->
    <script src="script.js" defer></script> <!-- 引入 JS 文件，defer 表示 HTML 解析完后执行 -->
  </head>
  <body>
    <!-- 页面主体内容区域：所有可见的内容都应放在这里 -->
    <h1>主标题</h1>
    <p>这是一个段落。</p>
    <!-- 更多内容... -->
  </body>
</html>
```

-   **`<!DOCTYPE html>`**: 必须位于文档最顶部，确保浏览器以标准模式渲染。
-   **`<html>`**: 根元素，包含整个页面的内容。`lang` 属性有助于搜索引擎和辅助技术。
-   **`<head>`**: 包含文档的元信息 (Metadata)。
    -   **`<meta charset="UTF-8">`**: 现代 Web 开发推荐使用 UTF-8 编码，支持多种语言字符。
    -   **`<meta name="viewport">`**: 控制页面在移动设备上的布局。`width=device-width` 使页面宽度适应设备宽度，`initial-scale=1.0` 设置初始缩放比例。对于响应式设计至关重要。
    -   **`<title>`**: 定义浏览器标签页标题，也是搜索引擎结果中显示的重要部分。
    -   **`<link>`**: 用于链接外部资源，最常见的是 CSS 文件 (`rel="stylesheet"`) 和网站图标 (`rel="icon"`)。
    -   **`<script>`**: 用于嵌入或引用 JavaScript 代码。`defer` 和 `async` 属性可以控制脚本的加载和执行时机，避免阻塞 HTML 解析（详见浏览器工作原理章节）。
-   **`<body>`**: 包含所有用户可见的页面内容，如文本、图片、链接、表单等。

#### 1.1.2 语义化标签 (Semantic Tags)

使用具有明确含义的 HTML 标签来组织内容，而不是仅仅依赖通用的 `<div>` 和 `<span>`。

-   **为什么重要？**
    -   **代码可读性与可维护性**: 结构清晰，更容易理解各部分内容的作用。
    -   **搜索引擎优化 (SEO)**: 搜索引擎能更好地理解页面结构和内容权重。
    -   **无障碍访问 (Accessibility)**: 屏幕阅读器等辅助技术能更好地解析页面，为残障用户提供更好的体验。
-   **常用语义化标签**:
    -   **页面结构**:
        -   `<header>`: 页面或区域的页眉，通常包含 Logo、导航、搜索框等。
        -   `<nav>`: 主要导航链接区域。
        -   `<main>`: 页面的主要核心内容，每个页面**应当只有一个** `<main>` 元素。
        -   `<article>`: 独立的、完整的内容块，可以单独发布或重用（如博客文章、新闻报道、论坛帖子）。
        -   `<section>`: 文档中一个通用的独立部分，通常包含一个标题 (`<h1>`-`<h6>`)。当没有更具体的语义标签可用时使用。
        -   `<aside>`: 与主要内容相关性较低的部分，常用于侧边栏、广告、引述块等。
        -   `<footer>`: 页面或区域的页脚，通常包含版权信息、联系方式、相关链接等。
    -   **内容组织**:
        -   `<h1>` - `<h6>`: 不同级别的标题，反映内容的层级结构。`<h1>` 通常用于页面主标题。
        -   `<p>`: 段落。
        -   `<ul>`: 无序列表。
        -   `<ol>`: 有序列表。
        -   `<li>`: 列表项。
        -   `<blockquote>`: 块级引用。
        -   `<figure>` & `<figcaption>`: 包裹图片、图表、代码块等，并为其提供标题/说明。
        -   `<address>`: 定义文档或文章作者/拥有者的联系信息。
    -   **文本级语义**:
        -   `<a>`: 超链接。
        -   `<em>`: 强调 (通常表现为斜体)。
        -   `<strong>`: 重要性强调 (通常表现为粗体)。
        -   `<code>`: 代码片段。
        -   `<pre>`: 预格式化文本 (保留空格和换行)。
        -   `<time>`: 定义日期或时间。
-   **避免滥用 `<div>` 和 `<span>`**:
    -   `<div>`: 通用块级容器，当没有其他更合适的语义标签时，用于**布局**或**组合内容**。
    -   `<span>`: 通用行内容器，当没有其他更合适的语义标签时，用于包裹**部分文本**以应用样式或脚本。

#### 1.1.3 表单 (`<form>`)

用于收集用户输入。

```html
<form action="/submit-data" method="post" enctype="multipart/form-data">
  <label for="username">用户名:</label>
  <input type="text" id="username" name="username" required minlength="4">

  <label for="password">密码:</label>
  <input type="password" id="password" name="password" required>

  <label for="gender">性别:</label>
  <select id="gender" name="gender">
    <option value="">请选择</option>
    <option value="male">男</option>
    <option value="female">女</option>
  </select>

  <label>
    <input type="checkbox" name="interests" value="coding"> 编程
  </label>
  <label>
    <input type="checkbox" name="interests" value="music"> 音乐
  </label>

  <label for="bio">简介:</label>
  <textarea id="bio" name="bio" rows="4"></textarea>

  <button type="submit">提交</button>
  <button type="reset">重置</button>
</form>
```

-   **`<form>` 属性**:
    -   `action`: 表单数据提交的 URL。
    -   `method`: HTTP 请求方法 (`get` 或 `post`)。`get` 将数据附加到 URL，`post` 将数据放在请求体中（更常用，尤其对于敏感信息或大量数据）。
    -   `enctype`: 当 `method` 为 `post` 时，指定数据的编码类型。上传文件时必须设置为 `multipart/form-data`。
-   **常用控件**:
    -   `<input>`: 最常用的控件，通过 `type` 属性区分类型：
        -   `text`, `password`, `email`, `number`, `tel`, `url`
        -   `checkbox` (多选), `radio` (单选，需相同 `name` 属性)
        -   `file` (文件上传)
        -   `date`, `time`, `datetime-local`
        -   `hidden` (隐藏字段)
        -   `submit`, `reset`, `button` (按钮类型)
    -   `<label>`: 关联表单控件，提高可访问性。点击标签可聚焦到对应控件。使用 `for` 属性指向控件的 `id`。
    -   `<select>` 和 `<option>`: 下拉选择框。
    -   `<textarea>`: 多行文本输入。
    -   `<button>`: 按钮。`type` 属性决定其行为 (`submit`, `reset`, `button`)。
-   **表单验证**: HTML5 提供了内置验证属性，如 `required`, `minlength`, `maxlength`, `min`, `max`, `pattern` (正则表达式)，可以在客户端进行基本验证，提升用户体验，但**服务器端验证仍是必需的**。

#### 1.1.4 多媒体 (Multimedia)

在网页中嵌入图片、音频和视频。

-   **`<img>`**: 嵌入图片。
    -   `src`: 图片 URL (必需)。
    -   `alt`: 替代文本 (必需)。图片无法加载时显示，对 SEO 和可访问性至关重要。
    -   `width`, `height`: 设置图片尺寸（建议设置以避免页面布局抖动）。
    -   `loading="lazy"`: 图片懒加载，提升页面初始加载性能。
-   **`<audio>`**: 嵌入音频。
    -   `src` 或 `<source>` 标签指定音频文件。
    -   `controls`: 显示浏览器默认播放控件。
    -   `autoplay`, `loop`, `muted` 等属性。
-   **`<video>`**: 嵌入视频。
    -   `src` 或 `<source>` 标签指定视频文件。
    -   `controls`, `autoplay`, `loop`, `muted`, `poster` (视频加载前显示的封面图) 等属性。
    -   使用 `<source>` 标签可以提供多种格式，让浏览器选择支持的格式。
    ```html
    <video controls width="640" height="360" poster="poster.jpg">
      <source src="movie.mp4" type="video/mp4">
      <source src="movie.webm" type="video/webm">
      您的浏览器不支持 Video 标签。
    </video>
    ```
-   **`<picture>`**: 实现更精细的图片响应式或格式选择。可以根据屏幕尺寸、分辨率或浏览器支持情况提供不同的图片源。
    ```html
    <picture>
      <source srcset="logo-large.webp" type="image/webp" media="(min-width: 600px)">
      <source srcset="logo-small.webp" type="image/webp">
      <source srcset="logo-large.png" type="image/png" media="(min-width: 600px)">
      <img src="logo-small.png" alt="Logo"> <!-- 必须包含一个 <img> 作为后备 -->
    </picture>
    ```

### 1.2 HTML5 重要特性回顾

HTML5 带来了许多重要的改进和新功能：

-   **语义化标签增强**: 引入 `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`, `<aside>`, `<main>` 等，使文档结构更清晰。
-   **Canvas**: 通过 JavaScript 绘制 2D 图形。适用于游戏、数据可视化、图像编辑等。
-   **SVG (Scalable Vector Graphics)**: 基于 XML 的矢量图形格式。可以通过 HTML 直接嵌入或作为文件引用。放大不失真，适合图标、图表等。
-   **多媒体支持**: `<video>` 和 `<audio>` 标签原生支持音视频播放，无需依赖 Flash 等插件。
-   **本地存储**:
    -   `localStorage`: 持久化本地存储，除非用户手动清除或代码删除，否则数据一直存在。容量较大 (通常 5-10MB)。
    -   `sessionStorage`: 会话级本地存储，数据仅在当前浏览器会话期间有效，关闭标签页或浏览器后清除。容量与 `localStorage` 类似。
    -   (注意：`Cookie` 虽然也能存储数据，但主要用于服务器通信，每次 HTTP 请求都会携带，容量小约 4KB)。
-   **Web Workers**: 允许在后台线程执行 JavaScript，避免阻塞主线程，用于耗时计算。
-   **WebSocket**: 提供全双工通信协议，实现浏览器与服务器之间的实时、双向数据传输。
-   **地理定位 (Geolocation API)**: 获取用户地理位置信息 (需用户授权)。
-   **新的表单控件类型和属性**: 如 `date`, `email`, `url`, `required`, `pattern` 等，增强了表单功能和验证。
-   **拖放 API (Drag and Drop)**: 实现页面元素的拖放交互。
-   **历史 API (History API)**: `pushState`, `replaceState` 允许在不刷新页面的情况下修改浏览器历史记录，用于单页应用 (SPA) 路由。

### 1.3 Web 可访问性 (Accessibility, a11y)

指创建能被尽可能多的人（包括残障人士）访问和使用的 Web 内容。这不仅是道德责任，有时也是法律要求，同时也能提升所有用户的体验。

-   **为什么重要？**
    -   **包容性**: 让视力障碍、听力障碍、行动不便、认知障碍等用户也能获取信息和使用功能。
    -   **SEO**: 搜索引擎爬虫可以看作是"盲人"用户，语义化和可访问性好的网站对 SEO 有利。
    -   **可用性**: 许多可访问性实践（如清晰的结构、键盘导航）也能提升普通用户的体验。
    -   **法律法规**: 许多国家和地区对网站可访问性有法律要求。
-   **核心实践**:
    1.  **使用语义化 HTML**: 正确使用标题 (`<h1>`-`<h6>`)、列表 (`ul`/`ol`/`li`)、段落 (`p`)、链接 (`a`)、按钮 (`button`) 等标签，让辅助技术能理解内容结构。
    2.  **为图片提供有意义的 `alt` 文本**: `alt` 属性描述图片内容，当图片无法显示或用户使用屏幕阅读器时使用。装饰性图片 `alt` 可以为空 (`alt=""`)。
    3.  **确保表单可访问**:
        -   使用 `<label>` 并通过 `for` 属性关联到对应的 `id`。
        -   使用 `<fieldset>` 和 `<legend>` 对相关的表单控件进行分组。
        -   提供清晰的错误提示和说明。
    4.  **保证键盘可导航**: 所有交互元素（链接、按钮、表单控件）都应能通过键盘（主要是 `Tab` 键）访问，并有清晰的焦点指示 (`:focus` 样式)。
    5.  **使用 ARIA (Accessible Rich Internet Applications) 属性**: 当原生 HTML 无法完全表达复杂 UI 组件（如下拉菜单、模态框、选项卡）的语义和状态时，使用 ARIA 属性进行补充。
        -   `role`: 定义元素的角色 (如 `role="navigation"`, `role="dialog"`)。
        -   `aria-*` 属性: 描述元素的状态和属性 (如 `aria-label`, `aria-labelledby`, `aria-hidden`, `aria-expanded`, `aria-required`)。
        -   **注意**: 优先使用原生 HTML 语义，仅在必要时使用 ARIA。错误的 ARIA 比没有 ARIA 更糟糕。
    6.  **确保足够的颜色对比度**: 文本内容与其背景色之间应有足够的对比度，以便视力不佳的用户阅读。可以使用在线工具检查对比度。
    7.  **提供替代方案**: 为多媒体内容提供文字稿 (音频) 或字幕/说明 (视频)。
    8.  **避免仅依赖颜色传递信息**: 使用文字、图标或其他视觉提示来补充颜色所表达的含义。

构建可访问的 Web 应用是一个持续的过程，需要开发、设计和测试团队的共同努力。使用自动化测试工具 (如 Axe) 和手动测试 (键盘导航、屏幕阅读器测试) 来验证可访问性。