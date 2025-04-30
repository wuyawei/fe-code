const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// MIME类型映射
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif'
};

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  console.log(`请求: ${req.url}`);
  
  // 获取请求URL的文件路径
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './demo.html';
  }
  
  // 获取文件扩展名
  const extname = path.extname(filePath);
  
  // 默认Content-Type
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // 为JavaScript文件添加正确的CORS头
  if (extname === '.js' || extname === '.mjs') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  // 读取文件
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在
        res.writeHead(404);
        res.end('文件不存在');
      } else {
        // 服务器错误
        res.writeHead(500);
        res.end(`服务器错误: ${err.code}`);
      }
      return;
    }
    
    // 成功读取文件
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// 处理服务器错误
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用，请关闭占用该端口的进程或使用其他端口`);
    process.exit(1);
  } else {
    console.error('服务器错误:', err);
  }
});

// 处理进程退出
process.on('SIGINT', () => {
  console.log('正在关闭服务器...');
  server.close(() => {
    console.log('服务器已安全关闭');
    process.exit(0);
  });
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}/`);
  console.log(`请访问 http://localhost:${PORT}/demo.html 查看演示`);
}); 