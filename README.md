# 软件网 - 网站导航

## 一键部署

```bash
docker run -d --name binnav -p 5173:5173 -e ADMIN_PASSWORD=AAssdd123 --restart unless-stopped $(docker build -q https://github.com/h1151449095/xhd111.git)
```

或者：

```bash
git clone https://github.com/h1151449095/xhd111.git && cd xhd111 && docker compose up -d
```

## 访问

- 前台：`http://你的IP:5173`
- 后台：`http://你的IP:5173/admina`
- 默认密码：`AAssdd123`
