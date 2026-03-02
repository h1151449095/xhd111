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

// 修复语法错误：移除不兼容的通配符星号
app.use((req, res) => {
  res.json({ success: true });
});

app.listen(3000, '0.0.0.0', () => console.log('Mock API running on port 3000'));
