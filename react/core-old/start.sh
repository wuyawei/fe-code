#!/bin/bash

# 检查是否有先前运行的服务器进程
pkill -f "node server.js" 2>/dev/null

# 等待一会儿确保进程被终止
sleep 1

# 启动 Node.js 服务器
# cd /Users/wuyawei02/Desktop/wuyw/fe-code/react/core-old && ./start.sh
echo "启动简易版 React 演示服务器..."
echo "请在浏览器访问: http://localhost:3000/demo.html"
node server.js 