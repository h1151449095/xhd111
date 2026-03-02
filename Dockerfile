FROM node:20-alpine

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm install

# 复制源码
COPY . .

# 安装 mock server 依赖
RUN npm install express --no-save

# 暴露端口
EXPOSE 5173

# 启动脚本
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["sh", "/app/start.sh"]
