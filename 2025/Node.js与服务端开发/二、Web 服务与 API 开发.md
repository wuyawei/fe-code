## 二、Web 服务与 API 开发

Node.js 最常见的应用场景之一就是构建 Web 服务器和 API。本章将探讨如何使用流行的框架、设计 API、与数据库交互、处理身份验证以及进行测试。

### 2.1 Web 框架应用 (Express/Koa/NestJS/Egg.js/Midway.js)

Web 框架提供了更高层次的抽象，简化了路由、请求处理、中间件管理等任务。

#### 框架对比

| 特性/框架      | Express                                      | Koa                                           | NestJS                                                         | Egg.js                                                         | Midway.js                                                        |
| :------------- | :------------------------------------------- | :-------------------------------------------- | :------------------------------------------------------------- | :------------------------------------------------------------- | :------------------------------------------------------------- |
| **核心理念**   | 简洁、灵活、无强制约束、中间件驱动           | 轻量、现代 (`async/await`)、洋葱模型中间件    | 结构化、强类型 (TS)、模块化、依赖注入、面向大型应用            | **企业级框架**、**约定优于配置**、插件机制、基于 Koa            | **企业级框架**、**面向未来** (Serverless 优先)、TS、**依赖注入**、基于 Koa |
| **中间件模型** | 线性回调 (`function(req, res, next)`)      | 洋葱模型 (`async function(ctx, next)`)        | 模块化系统内的守卫 (Guards)、拦截器 (Interceptors)、管道 (Pipes) | 基于 Koa 的洋葱模型，增加框架层面的加载和管理机制                | 基于 Koa 的洋葱模型，深度整合 DI 和装饰器                      |
| **内置功能**   | 路由、少量内置中间件 (v4.x+)                 | 核心极小，无内置中间件 (需自行引入)           | DI 容器、模块系统、CLI 工具、众多开箱即用模块 (需安装)           | **约定目录结构**、多进程模型、插件系统、安全、日志、配置管理    | **依赖注入**、装饰器路由、**Serverless 支持**、组件化、配置管理     |
| **主要优势**   | 生态庞大、学习曲线平缓、灵活                 | 中间件模型优雅、更轻量、基于 `async/await`    | 架构清晰、强类型安全、可扩展性强、适合团队协作和大型项目         | **开箱即用**、**规范统一**、性能优化、稳定、丰富的企业级插件      | **面向 Serverless**、**TypeScript 友好**、架构灵活、功能全面       |
| **主要劣势**   | 缺乏架构指导、异步错误处理需注意               | 需要自行组合大量中间件、生态相对 Express 较小 | 学习曲线陡峭、有一定约束性 (基于其架构)                      | 约定较强、相对不够灵活、国际化支持相对较弱                   | 相对较新、社区生态仍在发展中                                  |
| **适合场景**   | 快速原型、中小型项目、需要高度定制             | 喜欢现代 JS 特性、追求轻量核心              | 企业级应用、大型项目、需要强类型和架构指导的团队               | **大型企业应用**、需要规范和稳定性的团队                       | **现代企业应用**、**Serverless 应用**、中大型项目、TypeScript 项目  |

#### 核心代码示例

**Express (基本路由和中间件)**

```javascript
const express = require('express');
const app = express();

// 应用级中间件
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

// 路由
app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.listen(3000);
```

**Koa (洋葱模型中间件)**

```javascript
const Koa = require('koa');
const app = new Koa();

// 洋葱模型: 外层 -> 内层 -> 外层
app.use(async (ctx, next) => { // 外层
  const start = Date.now();
  await next(); // 调用内层
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`); // 内层执行完后执行
});

app.use(async ctx => { // 内层 (路由处理)
  ctx.body = 'Hello Koa!';
});

app.listen(3001);
```

**NestJS (控制器和服务的概念)**

```typescript
// app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} // 依赖注入

  @Get()
  getHello(): string {
    return this.appService.getHello(); // 调用服务方法
  }
}

// app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello NestJS!';
  }
}
```

### 2.2 中间件原理与实践

中间件是处理请求生命周期中横切关注点（如日志、认证、数据校验）的可组合函数。

-   **核心作用**: 执行代码、修改请求/响应对象、结束请求、调用下一个中间件。
-   **Express 中间件**: 签名 `function(req, res, next)`，线性执行，通过 `next()` 传递控制权。错误处理中间件有 4 个参数 `(err, req, res, next)`。
-   **Koa 中间件**: 签名 `async function(ctx, next)`，基于 `async/await` 实现洋葱模型，通过 `await next()` 调用下游并等待其完成。错误处理通常使用外层 `try...catch`。
-   **实践**: 保持单一职责、注意顺序、正确处理错误、合理使用第三方库 (`cors`, `helmet`, `morgan`等)。

### 2.3 RESTful API / GraphQL API 设计与实现

API 是前后端或服务间交互的契约。

#### API 风格对比

| 特性/风格    | RESTful API                                     | GraphQL API                                           |
| :----------- | :---------------------------------------------- | :---------------------------------------------------- |
| **核心思想** | 基于资源，使用标准 HTTP 方法操作，URI 定位      | 基于类型系统 (Schema)，客户端精确查询所需数据          |
| **数据获取** | 固定响应结构，可能 Over/Under-fetching           | 客户端指定字段，按需获取                                |
| **端点**     | 多个端点对应不同资源 (`/users`, `/posts/:id`) | 通常单一端点 (`/graphql`)                             |
| **协议**     | 主要基于 HTTP/HTTPS                             | 可基于 HTTP/HTTPS (通常 POST)，也支持 WebSocket (订阅) |
| **优点**     | 简单直观、基于 HTTP 标准、缓存友好、生态成熟     | 高效获取数据、无 Over/Under-fetching、强类型 Schema、API 易演进 |
| **缺点**     | Over/Under-fetching、N+1 问题、多端点管理        | 学习曲线陡峭、服务端实现复杂、缓存不如 HTTP 直观     |

#### 核心代码示例

**RESTful API (Express 路由定义)**

```javascript
// GET /users/:id - 获取单个用户
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  // ... 查询数据库 ...
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('Not Found');
  }
});

// POST /users - 创建新用户
app.post('/users', express.json(), (req, res) => {
  const userData = req.body;
  // ... 创建用户 ...
  res.status(201).json(newUser);
});
```

**GraphQL (查询语句示例)**

```graphql
# 客户端查询语句
query GetSpecificUserData {
  user(id: "123") { # 请求特定用户
    id             # 只请求 id, name, email
    name
    email
  }
}
```

### 2.4 数据库交互核心 (ORM/ODM)

ORM/ODM 提供了更高层次的抽象来简化数据库操作。

#### ORM vs ODM 对比

| 特性/工具      | ORM (Prisma / TypeORM / Sequelize)                | ODM (Mongoose)                                 |
| :------------- | :------------------------------------------------ | :--------------------------------------------- |
| **目标数据库** | 关系型数据库 (PostgreSQL, MySQL, SQLite 等)       | 文档数据库 (主要是 MongoDB)                     |
| **核心概念**   | 模型 (Model)/实体 (Entity) 映射 **表 (Table)**     | 模型 (Model) 映射 **集合 (Collection)**          |
| **数据结构**   | 处理结构化的行和列                              | 处理灵活的 BSON/JSON **文档 (Document)**        |
| **Schema 定义**| Prisma Schema / 装饰器 (TypeORM) / JS 对象 (Seq) | Mongoose Schema (定义结构、验证、方法等)     |
| **主要功能**   | SQL 生成、关联查询、迁移                          | 文档验证、中间件 (Hooks)、填充 (Population)    |

#### 核心代码示例

**Prisma (Schema 定义 和 Client 查询)**

```prisma
// schema.prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

```typescript
// 使用 Prisma Client
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getUsers() {
  const users = await prisma.user.findMany({
    where: { name: { contains: 'Alice' } }, // 查询 name 包含 Alice 的用户
  });
  console.log(users);
}
```

```typescript
// TypeORM 示例 (使用装饰器定义实体)
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, createConnection, Connection } from "typeorm";

@Entity() // 标记为实体 (对应数据库表 user)
export class User {
  @PrimaryGeneratedColumn() // 主键，自增
  id: number;

  @Column({ unique: true }) // 普通列，唯一约束
  email: string;

  @Column({ nullable: true }) // 可为空的列
  name: string;

  @OneToMany(() => Post, post => post.author) // 一对多关系 (User 有多个 Post)
  posts: Post[];
}

@Entity() // 标记为实体 (对应数据库表 post)
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text", { nullable: true }) // 指定数据库类型为 text
  content: string;

  @Column({ default: false })
  published: boolean;

  @ManyToOne(() => User, user => user.posts) // 多对一关系 (Post 属于一个 User)
  author: User;
}

// 使用 TypeORM (通常在服务中注入 Repository)
async function runTypeOrm() {
  let connection: Connection;
  try {
    connection = await createConnection({ // 配置数据库连接
      type: "sqlite", // 或 "postgres", "mysql" 等
      database: "database.sqlite",
      entities: [User, Post],
      synchronize: true, // 开发时自动创建/同步表结构 (生产环境禁用，应使用迁移)
      logging: false,
    });
    console.log("TypeORM 连接成功");

    const userRepository = connection.getRepository(User);
    // ... repository 操作 ...

  } catch (error) {
    console.error("TypeORM 错误:", error);
  } finally {
    if (connection) await connection.close();
  }
}
// runTypeOrm(); // 调用示例
```

#### ODM (Object-Document Mapping) - 用于文档数据库 (NoSQL, 如 MongoDB)

-   **目标**: 在**面向对象的编程语言**中的**对象**和**文档数据库** (将数据存储为类似 JSON 的文档) 中的**文档 (Document)** 之间建立映射。
-   **核心概念**:
    -   **模型 (Model)**: 代表数据库中的一个**集合 (Collection)**。
    -   **模式 (Schema)**: 定义文档的**结构、字段类型、验证规则、默认值、方法**等。ODM 通过 Schema 增强了数据一致性。
    -   **查询接口**: 提供面向对象的方法执行 CRUD 和复杂查询。
    -   **填充 (Population)**: 加载关联集合中的文档引用 (类似 JOIN)。
-   **流行的 Node.js ODM**:
    -   **Mongoose**: Node.js 操作 MongoDB **事实上的标准**。特点是强大的 Schema 定义、模型、连接管理、填充、中间件 (Hooks)。

```javascript
// Mongoose 示例 (Schema 和 Model 定义)
const mongoose = require('mongoose');

// 1. 连接数据库 (应在应用启动时进行)
// mongoose.connect('mongodb://localhost:27017/mydatabase').then(...).catch(...);

// 2. 定义 Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  age: { type: Number, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

// 3. 创建模型
const User = mongoose.model('User', userSchema);

// 4. 使用模型进行操作 (通常在路由处理器或服务中)
async function createUser(userData) {
  try {
    const newUser = new User(userData);
    await newUser.save(); // 保存到数据库
    console.log('新用户已创建:', newUser);
    return newUser;
  } catch (error) {
    console.error('创建用户失败:', error);
    throw error;
  }
}
```

#### ORM/ODM 核心应用

-   **简化数据库操作**: 将 SQL/MongoDB 查询封装成方法调用。
-   **代码可读性与可维护性**: 模型定义清晰反映数据结构。
-   **数据库无关性 (某种程度上)**: ORM 提供一定程度的数据库隔离。
-   **类型安全 (尤其配合 TS)**: Prisma 和 TypeORM 提供优秀的 TypeScript 支持。
-   **内置功能**: 提供迁移、验证、关联管理等。

**注意事项**:
-   **学习曲线**: 需要学习 ORM/ODM 本身的 API。
-   **性能开销**: 抽象层可能带来性能损耗，复杂查询可能需要原生语句。
-   **过度抽象风险**: 有时仍需理解底层查询。

### 2.5 身份验证与授权基础 (JWT/OAuth)

身份验证 (AuthN) 确认用户身份，授权 (AuthZ) 控制用户权限。

#### 认证机制对比

| 特性/机制      | Session-Cookie                             | Token-based (JWT)                            |
| :------------- | :----------------------------------------- | :------------------------------------------- |
| **状态**       | 有状态 (Stateful)，服务器需存储 Session    | 无状态 (Stateless)，服务器无需存储           |
| **存储**       | Session ID 存储在客户端 Cookie 中           | Token 由客户端自行存储 (LocalStorage等)      |
| **扩展性**     | 较差 (需 Session 共享)                    | 好，易于水平扩展                             |
| **客户端支持** | 主要依赖浏览器 Cookie 机制                 | 对各种客户端 (Web, App) 友好              |
| **CSRF 风险**  | 较高 (Cookie 自动发送)，需额外防御         | 较低 (Token 通常不自动发送)                  |
| **XSS 风险**   | Cookie 可设 HttpOnly 防脚本读取           | 若存 LocalStorage，易受 XSS 攻击获取 Token |
| **吊销**       | 容易 (删除服务端 Session)                 | 较难 (需黑名单机制)                          |

#### JWT (JSON Web Tokens)

-   **定义**: 一个开放标准 (RFC 7519)，定义了一种**紧凑且自包含**的方式，用于在各方之间安全地传输信息（通常是用户身份和声明）。由于信息是**数字签名**的，因此可以被验证和信任。
-   **结构**: JWT 由三部分组成，用点 (`.`) 分隔：
    1.  **Header (头部)**: Base64URL 编码的 JSON 对象，包含 Token 类型 (`typ`: "JWT") 和使用的签名算法 (`alg`: 如 "HS256", "RS256")。
        `{"alg": "HS256", "typ": "JWT"}` -> `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
    2.  **Payload (载荷)**: Base64URL 编码的 JSON 对象，包含**声明 (Claims)**。声明是关于实体（通常是用户）和其他数据的陈述。有三种类型的声明：
        *   **Registered Claims (注册声明)**: 预定义的一组声明，非强制但推荐使用（如 `iss` - 签发者, `sub` - 主题/用户ID, `aud` - 受众, `exp` - 过期时间戳 (Unix Timestamp), `nbf` - 不早于时间, `iat` - 签发时间, `jti` - JWT ID）。
        *   **Public Claims (公共声明)**: 自定义声明，但应避免与注册声明冲突，最好在 IANA JSON Web Token Registry 注册或使用包含命名空间的名称。
        *   **Private Claims (私有声明)**: 在签发方和使用方之间共享的自定义声明，名称应避免冲突。通常包含用户角色、权限等非敏感信息。
        **重要**: Payload 只是 Base64URL 编码，**不是加密**。**不应**在 Payload 中存放敏感信息（如密码）。
        `{"sub": "1234567890", "name": "John Doe", "iat": 1516239022}` -> `eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ`
    3.  **Signature (签名)**: 用于验证消息在传输过程中没有被篡改，并且可以验证发送者的身份（如果是使用非对称密钥）。计算方式是对编码后的 Header 和 Payload（由点 `.` 连接），加上一个**密钥 (Secret)**（用于 HS256 等对称算法）或**私钥 (Private Key)**（用于 RS256 等非对称算法），再应用 Header 中指定的签名算法 (`alg`) 进行计算。签名是 JWT 安全性的核心，确保了 Header 和 Payload 的完整性。
        *例如，使用 HS256 算法:*
        `HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)`

-   **使用流程**:
    1.  用户成功登录。
    2.  服务器使用密钥（或私钥）根据用户信息（Payload）生成 JWT。
    3.  服务器将 JWT 返回给客户端。
    4.  客户端存储 JWT（例如，在 HTTP Only Cookie 中以防 XSS，或者在内存、SessionStorage 中）。
    5.  客户端在后续需要认证的请求中，将 JWT 包含在 `Authorization: Bearer <token>` HTTP 头部中发送给服务器。
    6.  服务器接收请求，从头部提取 Token。
    7.  服务器使用**相同的密钥**（对称算法，如 HS256）或对应的**公钥**（非对称算法，如 RS256）和 Header 中指定的算法来**重新计算签名**，并与 Token 中提供的签名进行比较。
    8.  如果签名匹配，服务器接着检查 Payload 中的**声明**是否有效（例如，`exp` 声明判断 Token 是否过期，`aud` 声明判断接收者是否匹配等）。
    9.  所有验证通过后，服务器信任 Payload 中的信息（如用户 ID），并据此处理请求，通常会将用户信息附加到请求对象上（如 `req.user`）。

-   **优点/缺点**: 见上一节的 Token-based 认证机制对比。

#### JWT 核心代码示例 (使用 `jsonwebtoken` 库)

```javascript
const jwt = require('jsonwebtoken');

const secretKey = 'your-very-strong-secret-key'; // 密钥应保密且复杂，通常来自环境变量
const payload = { userId: 'user123', username: 'alice', roles: ['user'] };

// 1. 签发 JWT (通常在登录成功后)
const token = jwt.sign(
  payload,
  secretKey,
  { expiresIn: '1h' } // 设置过期时间为 1 小时
);
console.log('生成的 JWT:', token);

// 2. 验证 JWT (通常在处理受保护的 API 请求时，由中间件完成)
function verifyTokenMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // "Bearer ".length === 7
    try {
      // 验证签名和过期时间等
      const decodedPayload = jwt.verify(token, secretKey);
      req.user = decodedPayload; // 将解码后的用户信息附加到请求对象
      next(); // 验证通过，继续处理请求
    } catch (err) {
      // 验证失败 (如签名不匹配、Token 过期等)
      console.error('JWT 验证失败:', err.message);
      // 根据错误类型返回不同状态码可能更好
      return res.status(401).json({ error: '无效或过期的 Token' }); // 返回 401 未授权
    }
  } else {
    return res.status(401).json({ error: '需要提供 Token' });
  }
}

// 在需要保护的路由前使用中间件
// app.get('/api/protected-route', verifyTokenMiddleware, (req, res) => { ... });
```

#### OAuth 2.0 基础

-   **定义**: OAuth 2.0 是一个行业标准的**授权框架** (Authorization Framework)，**不是认证协议**。它允许用户授权第三方应用程序访问其在某个服务提供商上存储的私有资源，而无需将用户名和密码提供给第三方应用程序。
-   **核心角色**:
    -   **资源所有者 (Resource Owner)**: 通常是最终用户。
    -   **客户端 (Client)**: 第三方应用程序。
    -   **授权服务器 (Authorization Server)**: 验证用户身份并发放访问令牌。
    -   **资源服务器 (Resource Server)**: 托管受保护资源，验证访问令牌。
-   **访问令牌 (Access Token)**: 客户端用于访问资源的凭证，通常有范围和时效。
-   **常见授权流程 (Grant Types)**:
    -   **授权码流程 (Authorization Code Grant)**: 最常用、最安全，适用于 Web 应用。
    -   **客户端凭证流程 (Client Credentials Grant)**: 用于机器到机器的通信。
    -   其他流程（隐式、密码凭证、设备码、刷新令牌）适用于特定场景。
-   **范围 (Scope)**: 限制客户端可以访问的资源范围。

**Node.js 应用中的实践**:
-   **作为 OAuth 客户端**: 使用 `passport` 及策略库 (`passport-google-oauth20` 等) 实现第三方登录。
-   **作为 OAuth 提供者**: 使用 `oauth2-server` 等库构建自己的 OAuth 服务。

### 2.6 服务端测试基础 (单元/集成)

编写测试是确保服务端代码质量、功能正确性、可维护性和支持持续集成的关键实践。

-   **单元测试 (Unit Testing)**:
    -   **目标**: 测试**最小的可测试单元**（单个函数、方法），**隔离**外部依赖。
    -   **工具**: Jest, Vitest, Mocha + Chai + Sinon.js。
    -   **技术**: 模拟 (Mocking)、存根 (Stubbing)、间谍 (Spying)。

-   **集成测试 (Integration Testing)**:
    -   **目标**: 测试**多个单元协同工作**，可能涉及**真实或模拟的外部依赖**（数据库、API）。
    -   **场景**: 测试 API 端点、服务层与数据访问层的交互。
    -   **工具**: Jest/Vitest + Supertest (API 测试), Docker (启动依赖服务如数据库)。

```javascript
// 使用 Jest 和 Supertest 进行 API 集成测试 (简化示例)
const request = require('supertest');
// 假设你的 app 定义在 app.js 或通过某个工厂函数创建
const app = require('./app'); // 导入你的 app 实例

describe('GET /api/users/:id', () => {
  it('should return user data for valid id', async () => {
    const response = await request(app).get('/api/users/123'); // 使用 supertest 发送请求
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ // 检查响应体结构和内容
      id: '123',
      name: expect.any(String), // 期望 name 是字符串类型
    }));
  });

  it('should return 404 for non-existent id', async () => {
    const response = await request(app).get('/api/users/999');
    expect(response.statusCode).toBe(404);
  });
});
```

#### 应用

-   **保证代码质量**: 及早发现 Bug，减少回归错误。
-   **支持重构**: 有测试覆盖，可以更自信地修改和优化代码。
-   **文档作用**: 测试用例本身可以作为代码使用方式的一种文档。
-   **驱动设计**: 测试驱动开发 (TDD) 可以促使开发者编写更模块化、可测试的代码。
-   **持续集成 (CI)**: 自动化测试是 CI/CD 流程中的关键环节，确保每次代码提交后应用的稳定性。
