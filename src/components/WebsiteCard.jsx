import React, { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Lock } from 'lucide-react'

const WebsiteCard = ({ website }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [inputPassword, setInputPassword] = useState('')

  const handleCardClick = (e) => {
    // 如果有密码，拦截跳转
    if (website.viewPassword && website.viewPassword.trim() !== '') {
      setShowPasswordModal(true)
    } else {
      window.open(website.url, '_blank')
    }
  }

  const checkPassword = (e) => {
    e.stopPropagation()
    if (inputPassword === website.viewPassword) {
      setShowPasswordModal(false)
      window.open(website.url, '_blank')
      setInputPassword('')
    } else {
      alert('密码错误！')
    }
  }

  // 优先使用网站数据中的图标，fallback到自建API
  const getIconUrl = () => {
    // 1. 优先使用网站数据中的图标（静态文件路径或外网URL）
    if (website.icon) {
      return website.icon
    }

    // 2. 如果没有图标，使用自建图标API作为fallback
    try {
      const hostname = new URL(website.url).hostname
      // 使用自建图标API
      return `https://icon.nbvil.com/favicon?url=${hostname}`
    } catch (error) {
      return '/assets/logo.png'
    }
  }

  const handleIconError = (e) => {
    e.target.src = '/assets/logo.png'
    e.target.onerror = null 
  }

  return (
    <>
      <Card
        className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden h-24 hover:h-auto w-full relative"
        onClick={handleCardClick}
      >
        {website.viewPassword && (
          <div className="absolute top-2 right-2 text-gray-300 group-hover:text-blue-500 transition-colors">
            <Lock size={14} />
          </div>
        )}
        <CardContent className="h-full p-4 flex items-center justify-start">
          <div className="flex items-center space-x-3 w-full">
            <div className="flex-shrink-0">
              <img
                src={getIconUrl()}
                alt={website.name}
                className="w-8 h-8 rounded-md shadow-sm bg-gray-100 p-0.5"
                onError={handleIconError}
                style={{
                  display: 'block',
                  width: '32px',
                  height: '32px',
                  objectFit: 'contain',
                  flexShrink: 0
                }}
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  {website.name}
                </h3>
              </div>
              <p className="text-xs text-gray-600 truncate group-hover:whitespace-normal group-hover:line-clamp-none transition-all duration-300 leading-tight mb-1">
                {website.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 密码输入弹窗 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-80 text-center animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">访问受限</h3>
            <p className="text-sm text-gray-500 mb-6">请输入密码以访问 {website.name}</p>
            <input 
              type="password" 
              autoFocus
              className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center tracking-widest"
              placeholder="请输入访问密码"
              value={inputPassword}
              onChange={e => setInputPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && checkPassword(e)}
            />
            <div className="flex gap-3">
              <button 
                onClick={checkPassword}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all"
              >验证</button>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >取消</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default WebsiteCard 
