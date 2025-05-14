FROM ubuntu:20.04

# 避免交互式提示
ENV DEBIAN_FRONTEND=noninteractive

# 安装基础工具
RUN apt-get update && apt-get install -y \
    curl \
    git \
    nodejs \
    npm \
    sudo \
    python3 \
    python3-pip \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 安装 Node.js 版本管理器
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# 配置 nvm 环境变量
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install 16 && nvm use 16 && nvm alias default 16

# 全局配置
RUN echo "source $NVM_DIR/nvm.sh" >> /root/.bashrc
RUN npm install -g yarn

# 设置工作目录
WORKDIR /workspace
