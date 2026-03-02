const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json({ limit: '50mb' }));

app.post('/api/verify-password', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, message: '验证成功' });
  } else {
    res.status(401).json({ success: false, message: '密码错误' });
  }
});

app.get('/api/get-config', (req, res) => {
  console.log('GET /api/get-config requested');
  res.json({ 
    success: true, 
    sha: 'local-file-sha-' + Date.now(),
    message: 'Success',
    contentType: 'text'
  });
});

app.post('/api/update-config', (req, res) => {
  console.log('POST /api/update-config requested');
  const newContent = req.body.config;
  const filePath = path.join(__dirname, 'src/websiteData.js');
  try {
    if (!newContent) throw new Error('No content received');
    fs.writeFileSync(filePath, newContent, 'utf-8');
    res.json({ success: true, message: '本地配置更新成功' });
  } catch (e) {
    console.error('Update failed:', e);
    res.status(500).json({ success: false, message: e.message });
  }
});

// 备份数据 - 打包所有关键文件
app.get('/api/backup', (req, res) => {
  try {
    const websiteData = fs.readFileSync(path.join(__dirname, 'src/websiteData.js'), 'utf-8');
    
    // 收集 public/assets 下的图片文件名
    const assetsDir = path.join(__dirname, 'public/assets');
    let assets = [];
    if (fs.existsSync(assetsDir)) {
      assets = fs.readdirSync(assetsDir).filter(f => /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i.test(f));
    }

    // 收集 public/logos 下的图片
    const logosDir = path.join(__dirname, 'public/logos');
    let logos = [];
    if (fs.existsSync(logosDir)) {
      logos = fs.readdirSync(logosDir).filter(f => /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i.test(f));
    }

    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      websiteData,
      assets,
      logos
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=binnav-backup-${new Date().toISOString().slice(0,10)}.json`);
    res.json({ success: true, backup });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// 恢复数据
app.post('/api/restore', (req, res) => {
  try {
    const { backup } = req.body;
    if (!backup || !backup.websiteData) {
      return res.status(400).json({ success: false, message: '无效的备份文件' });
    }

    // 先备份当前数据
    const currentData = fs.readFileSync(path.join(__dirname, 'src/websiteData.js'), 'utf-8');
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    fs.writeFileSync(path.join(backupDir, `websiteData-${Date.now()}.js.bak`), currentData);

    // 恢复数据
    fs.writeFileSync(path.join(__dirname, 'src/websiteData.js'), backup.websiteData, 'utf-8');

    res.json({ success: true, message: '数据恢复成功！页面将自动刷新。' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// 修复语法错误：移除不兼容的通配符星号
app.use((req, res) => {
  res.json({ success: true });
});

app.listen(3000, '0.0.0.0', () => console.log('Mock API running on port 3000'));
