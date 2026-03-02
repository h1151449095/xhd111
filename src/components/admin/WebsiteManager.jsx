import React, { useState } from 'react'
import { Plus, Edit3, Trash2, GripVertical, ChevronUp, RefreshCw, CheckSquare, Square, ChevronRight, ChevronDown, Folder } from 'lucide-react'
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import WebsiteForm from './WebsiteForm'

const SortableWebsiteItem = ({
  website,
  onEdit,
  onDelete,
  editingWebsite,
  websiteForm,
  setWebsiteForm,
  onSaveWebsite,
  onCancelEdit,
  getCategoryName,
  config,
  isSelected,
  onToggleSelect
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: website.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className={`bg-white border ${isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md transition-all duration-200 min-h-[140px]`}>
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); onToggleSelect(website.id); }} className={`${isSelected ? 'text-blue-600' : 'text-gray-300'} hover:text-blue-500 transition-colors`}>
              {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
            </button>
            <div {...attributes} {...listeners} className="cursor-grab text-gray-300 hover:text-gray-500">
              <GripVertical size={18} />
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => onEdit(website)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit3 size={14} /></button>
            <button onClick={() => onDelete(website.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <img src={website.icon || '/assets/logo.png'} className="w-10 h-10 rounded-xl object-contain bg-gray-50 border border-gray-100" onError={e => e.target.src='/assets/logo.png'} />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-800 truncate">{website.name}</h4>
            <p className="text-[10px] text-gray-400 truncate mb-1">{website.url}</p>
            <div className="flex flex-wrap gap-1">
              {website.tags?.slice(0, 2).map((tag, index) => (
                <span key={index} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[9px] rounded-md truncate">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {website.description && (
          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed bg-gray-50/50 p-2 rounded-lg">
            {website.description}
          </p>
        )}
      </div>
    </div>
  )
}

const WebsiteManager = ({ config, onUpdateWebsiteData, showMessage, getCategoryName }) => {
  const [editingWebsite, setEditingWebsite] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [expandedCates, setExpandedCates] = useState({}) 
  const [websiteForm, setWebsiteForm] = useState({ name: '', description: '', url: '', category: '', tags: '', viewPassword: '' })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const toggleCate = (id) => setExpandedCates(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  const handleBatchDelete = () => {
    if (window.confirm(`确认删除选中的 ${selectedIds.length} 个网站？`)) {
      onUpdateWebsiteData(config.websiteData.filter(s => !selectedIds.includes(s.id)))
      setSelectedIds([])
      showMessage('success', '批量删除成功')
    }
  }

  const handleSaveWebsite = async () => {
    const newWebsite = {
      id: editingWebsite === 'new' ? Date.now() : editingWebsite,
      name: websiteForm.name.trim(),
      description: websiteForm.description.trim(),
      url: websiteForm.url.trim(),
      category: websiteForm.category,
      viewPassword: websiteForm.viewPassword || '',
      tags: typeof websiteForm.tags === 'string' ? websiteForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : (websiteForm.tags || []),
      icon: websiteForm.icon || `https://icon.nbvil.com/favicon?url=${new URL(websiteForm.url).hostname}`
    }
    if (editingWebsite === 'new') onUpdateWebsiteData([...config.websiteData, newWebsite])
    else onUpdateWebsiteData(config.websiteData.map(site => site.id === editingWebsite ? newWebsite : site))
    setEditingWebsite(null)
    showMessage('success', '已保存')
  }

  const groupedData = config.categories.map(cat => ({
    ...cat,
    websites: config.websiteData.filter(w => w.category === cat.id)
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-gray-800">管理中心</h3>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full border border-red-100">
              <span className="text-xs text-red-600 font-bold">已选 {selectedIds.length}</span>
              <button onClick={handleBatchDelete} className="text-red-600 hover:text-red-800"><Trash2 size={14} /></button>
              <button onClick={() => setSelectedIds([])} className="text-gray-400 text-[10px]">取消</button>
            </div>
          )}
        </div>
        <button onClick={() => { setEditingWebsite('new'); setWebsiteForm({ name: '', description: '', url: '', category: config.categories[0]?.id || '', tags: '', viewPassword: '' }) }} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
          <Plus size={18} /> 新增网站
        </button>
      </div>

      {editingWebsite && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setEditingWebsite(null)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-800">{editingWebsite === 'new' ? '添加新网站' : '编辑网站信息'}</h3>
              <button onClick={() => setEditingWebsite(null)} className="text-gray-400 hover:text-gray-600"><ChevronUp className="rotate-180" /></button>
            </div>
            <div className="p-8">
              <WebsiteForm websiteForm={websiteForm} setWebsiteForm={setWebsiteForm} onSave={handleSaveWebsite} onCancel={() => setEditingWebsite(null)} isEditing={editingWebsite !== 'new'} categories={config.categories} />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {groupedData.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div onClick={() => toggleCate(cat.id)} className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                {expandedCates[cat.id] ? <ChevronDown size={18} className="text-blue-500" /> : <ChevronRight size={18} className="text-gray-400" />}
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Folder size={20} /></div>
                <div>
                  <h4 className="font-bold text-gray-800">{cat.name}</h4>
                  <p className="text-[10px] text-gray-400">共有 {cat.websites.length} 个网站</p>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setSelectedIds(prev => { const catW = cat.websites.map(w=>w.id); return prev.filter(id=>catW.includes(id)).length === catW.length ? prev.filter(id=>!catW.includes(id)) : [...new Set([...prev, ...catW])]; }) }} className="text-xs text-blue-500 font-medium hover:underline text-right">
                全选
              </button>
            </div>
            
            {expandedCates[cat.id] && (
              <div className="p-4 bg-gray-50/50 border-t border-gray-50">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={() => {}}>
                  <SortableContext items={cat.websites.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {cat.websites.map(website => (
                        <SortableWebsiteItem key={website.id} website={website} isSelected={selectedIds.includes(website.id)} onToggleSelect={toggleSelect} onEdit={(w) => { setEditingWebsite(w.id); setWebsiteForm({ ...w, tags: w.tags.join(', ') }) }} onDelete={(id) => onUpdateWebsiteData(config.websiteData.filter(s => s.id !== id))} editingWebsite={editingWebsite} websiteForm={websiteForm} setWebsiteForm={setWebsiteForm} onSaveWebsite={handleSaveWebsite} onCancelEdit={() => setEditingWebsite(null)} getCategoryName={getCategoryName} config={config} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WebsiteManager 
