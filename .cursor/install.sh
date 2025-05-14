#!/bin/bash
set -e

echo "开始安装依赖..."

# 确保工作目录存在
if [ ! -d "/workspace" ]; then
  echo "错误: 工作目录 /workspace 不存在"
  exit 1
fi

# 进入工作目录
cd /workspace
echo "当前目录: $(pwd)"

# 如果存在 package.json 则安装依赖
if [ -f "package.json" ]; then
  echo "检测到 package.json，开始安装依赖"
  
  # 优先使用 yarn，如果失败则使用 npm
  if command -v yarn &> /dev/null; then
    echo "使用 yarn 安装依赖"
    yarn install --frozen-lockfile || npm install
  else
    echo "使用 npm 安装依赖"
    npm install
  fi
else
  echo "未检测到 package.json，跳过依赖安装"
fi

# 查看安装的 node 和 npm 版本
node -v
npm -v

echo "安装依赖完成"

# 构建项目（如果需要）
# npm run build 