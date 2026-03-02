import { useState } from 'react'

function VpsInline() {
  const [sessionId, setSessionId] = useState(null)
  const [serverInfo, setServerInfo] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [installing, setInstalling] = useState({ vless: false, ss: false })
  const [installed, setInstalled] = useState({ vless: null, ss: null, xrayRunning: false })
  const [msg, setMsg] = useState('')
  const [copied, setCopied] = useState('')
  const [form, setForm] = useState({ host: '', port: '22', username: 'root', password: '' })

  const API = ''

  async function api(url, data) {
    try {
      const c = new AbortController()
      const t = setTimeout(() => c.abort(), 120000)
      const r = await fetch(API + url.replace('/api/', '/vps-api/'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: c.signal })
      clearTimeout(t)
      return r.json()
    } catch (e) { return { success: false, message: '请求超时' } }
  }

  function copy(text, label) {
    const ta = document.createElement('textarea')
    ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px'
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    setCopied(label); setTimeout(() => setCopied(''), 2000)
  }

  async function connect() {
    if (!form.host || !form.password) { setMsg('请填写完整信息'); return }
    setConnecting(true); setMsg('')
    const data = await api('/api/connect', { ...form, port: parseInt(form.port) || 22 })
    if (data.success) {
      setSessionId(data.sessionId)
      const info = await api('/api/info', { sessionId: data.sessionId })
      setServerInfo(info.success ? info.info : { os: '?', cpu: '?', memory: '?', disk: '?', ip: form.host, bbr: '?' })
      const check = await api('/api/check-installed', { sessionId: data.sessionId })
      if (check.success) setInstalled(check)
    } else { setMsg(data.message) }
    setConnecting(false)
  }

  async function disconnect() {
    await api('/api/disconnect', { sessionId })
    setSessionId(null); setServerInfo(null); setInstalled({ vless: null, ss: null, xrayRunning: false }); setMsg('')
  }

  async function installVless() {
    setInstalling(i => ({ ...i, vless: true })); setMsg('')
    const data = await api('/api/install-vless', { sessionId })
    if (data.success) setInstalled(p => ({ ...p, vless: { ...data.config, shareLink: data.shareLink }, xrayRunning: true }))
    else setMsg(data.message)
    setInstalling(i => ({ ...i, vless: false }))
  }

  async function installSS() {
    setInstalling(i => ({ ...i, ss: true })); setMsg('')
    const data = await api('/api/install-ss', { sessionId })
    if (data.success) setInstalled(p => ({ ...p, ss: { ...data.config, shareLink: data.shareLink }, xrayRunning: true }))
    else setMsg(data.message)
    setInstalling(i => ({ ...i, ss: false }))
  }

  // 未连接 - 显示登录表单
  if (!serverInfo) {
    return (
      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-3">🔗 SSH 连接</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} placeholder="服务器IP"
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400" />
            <input value={form.port} onChange={e => setForm({ ...form, port: e.target.value })} placeholder="端口"
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="用户名"
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400" />
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="密码"
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400" />
          </div>
          {msg && <p className="text-xs text-red-500">❌ {msg}</p>}
          <button onClick={connect} disabled={connecting}
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all">
            {connecting ? '连接中...' : '连接服务器'}
          </button>
        </div>
      </div>
    )
  }

  // 已连接
  return (
    <div className="p-4 space-y-3">
      {/* 服务器信息 */}
      <div className="bg-gray-50 rounded-xl p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1">📊 服务器信息 <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" /></h3>
          <button onClick={disconnect} className="text-xs text-red-400 hover:text-red-600 underline">断开</button>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <div className="bg-white rounded-lg px-2 py-1.5"><span className="text-gray-400">IP </span><span className="font-bold text-blue-500">{serverInfo.ip}</span></div>
          <div className="bg-white rounded-lg px-2 py-1.5"><span className="text-gray-400">系统 </span><span className="font-bold">{serverInfo.os}</span></div>
          <div className="bg-white rounded-lg px-2 py-1.5"><span className="text-gray-400">CPU </span><span className="font-bold">{serverInfo.cpu}</span></div>
          <div className="bg-white rounded-lg px-2 py-1.5"><span className="text-gray-400">内存 </span><span className="font-bold">{serverInfo.memory}</span></div>
          <div className="bg-white rounded-lg px-2 py-1.5"><span className="text-gray-400">磁盘 </span><span className="font-bold">{serverInfo.disk}</span></div>
          <div className="bg-white rounded-lg px-2 py-1.5"><span className="text-gray-400">BBR </span><span className={`font-bold ${serverInfo.bbr?.includes('已开启') ? 'text-green-500' : 'text-yellow-500'}`}>{serverInfo.bbr?.includes('已开启') ? '✅' : serverInfo.bbr}</span></div>
        </div>
      </div>

      {msg && <p className="text-xs text-red-500 text-center">❌ {msg}</p>}
      {copied && <p className="text-xs text-green-500 text-center">{copied}</p>}

      {/* VLESS */}
      <div className="bg-purple-50 rounded-xl p-3">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-bold text-purple-700">🛡️ VLESS+Reality</h4>
          <span className="text-[10px] bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full font-bold">推荐</span>
        </div>
        {installed.vless ? (
          <div className="space-y-2">
            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
              <p className="text-xs text-green-600 font-bold mb-1">🎉 已搭建 {installed.xrayRunning ? '(运行中)' : ''}</p>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-600">
                <div>IP: {installed.vless.serverIP}</div>
                <div>端口: {installed.vless.port}</div>
              </div>
            </div>
            <div onClick={() => copy(installed.vless.shareLink, '✅ VLESS 链接已复制！')}
              className="bg-white border border-purple-200 rounded-lg p-2 cursor-pointer hover:bg-purple-50 transition-colors">
              <p className="text-[10px] text-gray-400 mb-1">📋 点击复制分享链接</p>
              <p className="text-[11px] text-purple-600 break-all leading-relaxed">{installed.vless.shareLink}</p>
            </div>
          </div>
        ) : (
          <ul className="text-xs text-gray-500 space-y-0.5 mb-2">
            <li>✅ 随机端口 ✅ Reality 防探测 ✅ 不需域名</li>
          </ul>
        )}
        <button onClick={installVless} disabled={installing.vless}
          className="w-full mt-2 py-2 bg-gradient-to-r from-purple-500 to-purple-400 text-white text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-50">
          {installing.vless ? '安装中...' : installed.vless ? '重新搭建' : '一键安装 VLESS+Reality'}
        </button>
      </div>

      {/* SS */}
      <div className="bg-green-50 rounded-xl p-3">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-bold text-green-700">⚡ Shadowsocks</h4>
          <span className="text-[10px] bg-green-200 text-green-700 px-2 py-0.5 rounded-full font-bold">经典</span>
        </div>
        {installed.ss ? (
          <div className="space-y-2">
            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
              <p className="text-xs text-green-600 font-bold mb-1">🎉 已搭建 {installed.xrayRunning ? '(运行中)' : ''}</p>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-600">
                <div>IP: {installed.ss.serverIP}</div>
                <div>端口: {installed.ss.port}</div>
              </div>
            </div>
            <div onClick={() => copy(installed.ss.shareLink, '✅ SS 链接已复制！')}
              className="bg-white border border-green-200 rounded-lg p-2 cursor-pointer hover:bg-green-50 transition-colors">
              <p className="text-[10px] text-gray-400 mb-1">📋 点击复制分享链接</p>
              <p className="text-[11px] text-green-600 break-all leading-relaxed">{installed.ss.shareLink}</p>
            </div>
          </div>
        ) : (
          <ul className="text-xs text-gray-500 space-y-0.5 mb-2">
            <li>✅ 随机端口 ✅ blake3加密 ✅ 支持小火箭</li>
          </ul>
        )}
        <button onClick={installSS} disabled={installing.ss}
          className="w-full mt-2 py-2 bg-gradient-to-r from-green-500 to-green-400 text-white text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-50">
          {installing.ss ? '安装中...' : installed.ss ? '重新搭建' : '一键安装 Shadowsocks'}
        </button>
        <p className="text-xs text-red-500 mt-2 leading-relaxed">⚠️ SS 协议需要加中转，直连容易被墙 IP！</p>
      </div>
    </div>
  )
}

export default VpsInline
