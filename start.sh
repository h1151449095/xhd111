#!/bin/sh
# 安装依赖
npm install express --no-save
# 启动 Mock API 并将日志输出到文件
node mock-server.cjs > /app/mock.log 2>&1 &
# 等待启动
sleep 3
# 启动 Vite
npm run dev -- --host
