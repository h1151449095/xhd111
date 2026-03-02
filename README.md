# 软件网 - 精选网站导航

基于 React + Vite 的网站导航系统，支持分类管理、后台管理、VPS 一键搭建等功能。

## 功能特性

- 🌐 网站分类导航，智能搜索
- 🔐 后台管理系统（网站管理、分类管理、系统设置）
- ⚡ VPS 一键搭建（VLESS+Reality / Shadowsocks）
- 💾 数据备份与恢复
- 📱 响应式设计，支持移动端

## 快速部署

### Docker 部署（推荐）

```bash
# 克隆项目
git clone https://github.com/h1151449095/xhd111.git
cd xhd111

# 修改管理员密码（可选）
# 编辑 docker-compose.yml 中的 ADMIN_PASSWORD

# 启动
docker compose up -d

# 访问
# 前台：http://你的IP:5173
# 后台：http://你的IP:5173/admina
```

### 手动部署

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev -- --host

# 另一个终端启动 API 服务
node mock-server.cjs
```

## VPS 一键搭建功能

如需使用 VPS 一键搭建功能，需要额外部署 VPS Panel：

```bash
# 进入 vps-panel 目录（如果有）
cd vps-panel
npm install
node server.js
```

## 配置说明

- **管理员密码**：通过环境变量 `ADMIN_PASSWORD` 设置，默认 `AAssdd123`
- **后台地址**：`/admina`
- **数据文件**：`src/websiteData.js`

## 目录结构

```
├── src/
│   ├── components/     # 组件
│   ├── pages/          # 页面
│   ├── hooks/          # 自定义 Hooks
│   └── websiteData.js  # 网站数据
├── public/
│   ├── assets/         # 静态资源
│   └── logos/          # Logo 图片
├── mock-server.cjs     # API 服务
├── Dockerfile          # Docker 构建
├── docker-compose.yml  # Docker Compose
└── start.sh            # 启动脚本
```

## License

MIT
