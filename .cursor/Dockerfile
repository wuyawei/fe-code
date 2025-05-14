FROM ubuntu:latest

# 安装基础工具
RUN apt-get update && apt-get install -y \
    curl \
    git \
    nodejs \
    npm \
    sudo

# 安装 Node.js 版本管理器
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# 设置工作目录
WORKDIR /workspace
