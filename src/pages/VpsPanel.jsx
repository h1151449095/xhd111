import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

function VpsPanel() {
  const [sessionId, setSessionId] = useState(null)
  const [serverInfo, setServerInfo] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [installing, setInstalling] = useState({ vless: false, ss: false })
  const [installed, setInstalled] = useState({ vless: null, ss: null, xrayRunning: false })
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({ host: '', port: '22', username: 'root', password: '' })

  const API = 'http://' + window.location.hostname + ':39217'

  async function api(url, data) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 60000)
      const r = await fetch(API + url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: controller.signal })
      clearTimeout(timeout)
      return r.json()
    } catch (e) {
      return { success: false, message: '请求超时' }
    }
  }

  function copyText(text) {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    setMsg('✅ 已复制到剪贴板！')
    setTimeout(() => setMsg(''), 2000)
  }

  async function connect() {
    if (!form.host || !form.password) { setMsg('❌ 请填写完整信息'); return }
    setConnecting(true); setMsg('正在连接...')
    const data = await api('/api/connect', { ...form, port: parseInt(form.port) || 22 })
    if (data.success) {
      setSessionId(data.sessionId)
      setMsg('✅ 连接成功，正在获取信息...')
      const info = await api('/api/info', { sessionId: data.sessionId })
      if (info.success) setServerInfo(info.info)
      else setServerInfo({ os: '未知', cpu: '未知', memory: '未知', disk: '未知', ip: form.host, bbr: '未知' })
      // 检查已安装
      const check = await api('/api/check-installed', { sessionId: data.sessionId })
      if (check.success) setInstalled(check)
      setMsg('')
    } else {
      setMsg('❌ ' + data.message)
    }
    setConnecting(false)
  }

  async function disconnect() {
    await api('/api/disconnect', { sessionId })
    setSessionId(null); setServerInfo(null); setInstalled({ vless: null, ss: null, xrayRunning: false })
  }

  async function installVless() {
    setInstalling(i => ({ ...i, vless: true }))
    const data = await api('/api/install-vless', { sessionId })
    if (data.success) {
      setInstalled(prev => ({ ...prev, vless: { ...data.config, shareLink: data.shareLink }, xrayRunning: true }))
    } else { setMsg('❌ ' + data.message) }
    setInstalling(i => ({ ...i, vless: false }))
  }

  async function installSS() {
    setInstalling(i => ({ ...i, ss: true }))
    const data = await api('/api/install-ss', { sessionId })
    if (data.success) {
      setInstalled(prev => ({ ...prev, ss: { ...data.config, shareLink: data.shareLink }, xrayRunning: true }))
    } else { setMsg('❌ ' + data.message) }
    setInstalling(i => ({ ...i, ss: false }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <a href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} /> 返回首页
          </a>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">⚡ VPS 一键搭建</h1>
          <p className="text-gray-400 mt-2">输入 SSH 信息，一键部署代理协议</p>
        </div>

        {/* 提示消息 */}
        {msg && <div className={`text-center text-sm mb-4 ${msg.startsWith('❌') ? 'text-red-400' : msg.startsWith('✅') ? 'text-green-400' : 'text-yellow-400'}`}>{msg}</div>}

        {/* SSH 连接 */}
        {!serverInfo ? (
          <div className="bg-white/5 backdrop-blur rounded-3xl border border-white/10 p-8 shadow-xl shadow-blue-500/5">
            <h2 className="text-xl font-bold mb-6">🔗 SSH 连接</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">服务器地址</label>
                <input value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} placeholder="1.2.3.4" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">端口</label>
                <input value={form.port} onChange={e => setForm({ ...form, port: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">用户名</label>
                <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">密码</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="SSH密码" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <button onClick={connect} disabled={connecting} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all">
              {connecting ? '连接中...' : '连接服务器'}
            </button>
          </div>
        ) : (
          <>
            {/* 服务器信息 */}
            <div className="bg-white/5 backdrop-blur rounded-3xl border border-white/10 p-8 mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">📊 服务器信息 <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" /></h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white/5 rounded-xl p-3"><p className="text-xs text-gray-400">IP</p><p className="font-bold text-blue-400 text-sm">{serverInfo.ip}</p></div>
                <div className="bg-white/5 rounded-xl p-3"><p className="text-xs text-gray-400">系统</p><p className="font-bold text-sm">{serverInfo.os}</p></div>
                <div className="bg-white/5 rounded-xl p-3"><p className="text-xs text-gray-400">CPU</p><p className="font-bold text-sm">{serverInfo.cpu}</p></div>
                <div className="bg-white/5 rounded-xl p-3"><p className="text-xs text-gray-400">内存</p><p className="font-bold text-sm">{serverInfo.memory}</p></div>
                <div className="bg-white/5 rounded-xl p-3"><p className="text-xs text-gray-400">磁盘</p><p className="font-bold text-sm">{serverInfo.disk}</p></div>
                <div className="bg-white/5 rounded-xl p-3"><p className="text-xs text-gray-400">BBR</p><p className={`font-bold text-sm ${serverInfo.bbr?.includes('已开启') ? 'text-green-400' : 'text-yellow-400'}`}>{serverInfo.bbr?.includes('已开启') ? '● 已开启' : serverInfo.bbr}</p></div>
                <div className="bg-white/5 rounded-xl p-3 col-span-2 flex justify-between items-center">
                  <div><p className="text-xs text-gray-400">状态</p><p className="font-bold text-green-400 text-sm">● 已连接</p></div>
                  <button onClick={disconnect} className="text-xs text-red-400 hover:text-red-300 underline">断开</button>
                </div>
              </div>
            </div>

            {/* VLESS */}
            <div className="bg-white/5 backdrop-blur rounded-3xl border border-white/10 p-8 mb-6 shadow-xl shadow-purple-500/5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">🛡️ VLESS + TCP + Reality</h2>
                  <p className="text-gray-400 text-sm mt-1">最安全的协议，伪装成正常 HTTPS 流量</p>
                </div>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full">推荐</span>
              </div>

              {installed.vless ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 space-y-3 mb-4">
                  <p className="text-green-400 font-bold">🎉 已搭建 {installed.xrayRunning ? '(运行中)' : '(已停止)'}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-400">服务器：</span>{installed.vless.serverIP}</div>
                    <div><span className="text-gray-400">端口：</span>{installed.vless.port}</div>
                    <div className="col-span-2"><span className="text-gray-400">UUID：</span><span className="text-blue-300 text-xs">{installed.vless.uuid}</span></div>
                  </div>
                  <div className="mt-3">
                    <p className="text-gray-400 text-xs mb-1">📋 点击复制分享链接：</p>
                    <div onClick={() => copyText(installed.vless.shareLink)} className="bg-black/40 rounded-xl p-3 cursor-pointer hover:bg-black/60 transition-colors text-blue-300 text-xs break-all leading-relaxed">
                      {installed.vless.shareLink}
                    </div>
                  </div>
                </div>
              ) : (
                <ul className="text-sm text-gray-300 space-y-1 mb-4">
                  <li>✅ 随机端口，更安全</li>
                  <li>✅ Reality 防探测，不需要域名</li>
                  <li>✅ 支持 V2rayN / Clash / 小火箭</li>
                </ul>
              )}
              <button onClick={installVless} disabled={installing.vless} className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all">
                {installing.vless ? '安装中，请等待1-3分钟...' : installed.vless ? '重新搭建 VLESS+Reality' : '一键安装 VLESS+Reality'}
              </button>
            </div>

            {/* SS */}
            <div className="bg-white/5 backdrop-blur rounded-3xl border border-white/10 p-8 shadow-xl shadow-green-500/5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">⚡ Shadowsocks (SS)</h2>
                  <p className="text-gray-400 text-sm mt-1">经典协议，兼容性最好，适合小火箭</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full">经典</span>
              </div>

              {installed.ss ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 space-y-3 mb-4">
                  <p className="text-green-400 font-bold">🎉 已搭建 {installed.xrayRunning ? '(运行中)' : '(已停止)'}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-400">服务器：</span>{installed.ss.serverIP}</div>
                    <div><span className="text-gray-400">端口：</span>{installed.ss.port}</div>
                    <div><span className="text-gray-400">加密：</span>{installed.ss.method}</div>
                    <div className="col-span-2"><span className="text-gray-400">密码：</span><span className="text-green-300 text-xs">{installed.ss.password}</span></div>
                  </div>
                  <div className="mt-3">
                    <p className="text-gray-400 text-xs mb-1">📋 点击复制分享链接：</p>
                    <div onClick={() => copyText(installed.ss.shareLink)} className="bg-black/40 rounded-xl p-3 cursor-pointer hover:bg-black/60 transition-colors text-green-300 text-xs break-all leading-relaxed">
                      {installed.ss.shareLink}
                    </div>
                  </div>
                </div>
              ) : (
                <ul className="text-sm text-gray-300 space-y-1 mb-4">
                  <li>✅ 随机端口，更安全</li>
                  <li>✅ 2022-blake3-aes-128-gcm 加密</li>
                  <li>✅ 完美支持 Shadowrocket（小火箭）</li>
                </ul>
              )}
              <button onClick={installSS} disabled={installing.ss} className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all">
                {installing.ss ? '安装中，请等待...' : installed.ss ? '重新搭建 Shadowsocks' : '一键安装 Shadowsocks'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VpsPanel
