
import React, { useState } from 'react';
import { 
  Layout, Edit2, Eye, User, FileText, CreditCard, 
  GraduationCap, Plus, Trash2, X, Box, Sparkles
} from 'lucide-react';
import { ComponentTemplate, TemplateField } from '../../types';
import FormDesigner from './FormDesigner';

interface TemplateLibraryProps {
  templates: ComponentTemplate[];
  onUpdateTemplates: (templates: ComponentTemplate[]) => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ templates, onUpdateTemplates }) => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'system' | 'custom'>('system');
  const [viewMode, setViewMode] = useState<'list' | 'designer'>('list');
  
  // Modal & Edit States
  const [previewTemplate, setPreviewTemplate] = useState<ComponentTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<ComponentTemplate | undefined>(undefined);

  // --- Actions ---

  // Delete Custom Template
  const handleDelete = (id: string) => {
    if (confirm('确定要删除该模版吗？此操作不可恢复。')) {
      onUpdateTemplates(templates.filter(t => t.id !== id));
    }
  };

  // Start Create - Switch to Designer
  const handleStartCreate = () => {
    setEditingTemplate(undefined);
    setViewMode('designer');
  };

  // Start Edit - Switch to Designer
  const handleStartEdit = (template: ComponentTemplate) => {
    setEditingTemplate(template);
    setViewMode('designer');
  };

  // Save from Designer
  const handleSaveTemplate = (data: { title: string, description: string, fields: TemplateField[] }) => {
    if (editingTemplate) {
      // Update existing
      onUpdateTemplates(templates.map(t => t.id === editingTemplate.id ? {
        ...t,
        title: data.title,
        description: data.description,
        fields: data.fields
      } : t));
    } else {
      // Create new
      const newTemplate: ComponentTemplate = {
        id: `tpl_custom_${Date.now()}`,
        title: data.title,
        description: data.description,
        fields: data.fields,
        type: 'custom',
        category: '我的模版', // Unified tag
        createTime: new Date().toISOString()
      };
      onUpdateTemplates([...templates, newTemplate]);
      setActiveTab('custom');
    }
    setViewMode('list');
    setEditingTemplate(undefined);
  };

  // --- Render Helpers ---

  const getIcon = (title: string) => {
    if (title.includes('银行')) return <CreditCard size={24} />;
    if (title.includes('学历')) return <GraduationCap size={24} />;
    if (title.includes('身份')) return <User size={24} />;
    return <Box size={24} />;
  };

  const renderFieldPreview = (field: TemplateField, idx: number) => {
    return (
      <div key={idx} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label} {field.defaultProps?.required && <span className="text-red-500">*</span>}
        </label>
        {field.type === 'select' ? (
          <div className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-500 text-sm flex justify-between items-center">
             <span>请选择</span>
             <span className="text-xs">▼</span>
          </div>
        ) : field.type === 'date' ? (
          <div className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-500 text-sm flex justify-between items-center">
             <span>选择日期</span>
             <span className="text-xs">📅</span>
          </div>
        ) : (
          <input 
            type="text" 
            disabled 
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm cursor-not-allowed"
            placeholder={field.defaultProps?.placeholder || '请输入...'}
          />
        )}
      </div>
    );
  };

  if (viewMode === 'designer') {
    return (
      <FormDesigner 
        mode="template"
        onBack={() => setViewMode('list')} 
        initialTemplateData={editingTemplate}
        onSaveTemplate={handleSaveTemplate}
        templates={templates}
      />
    );
  }

  const filteredTemplates = templates.filter(t => t.type === activeTab);

  return (
    <div className="space-y-6 animate-fade-in-up font-sans pb-10">
      {/* 1. Page Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-xl flex items-start gap-4 shadow-sm">
        <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
          <Layout size={24} />
        </div>
        <div>
           <h3 className="font-bold text-gray-800 text-lg">组件模版库</h3>
           <p className="text-gray-600 text-sm mt-1 max-w-2xl">
             预置常用业务字段组合，支持在表单设计器中直接拖拽使用，或创建自定义模版以提升搭建效率。
           </p>
        </div>
      </div>

      {/* 2. Tabs */}
      <div className="flex items-center border-b border-gray-200">
        <button
          onClick={() => setActiveTab('system')}
          className={`px-8 py-3 font-medium text-sm transition-all relative flex items-center gap-2 ${activeTab === 'system' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          <Sparkles size={16} />
          系统内置模版
          {activeTab === 'system' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-8 py-3 font-medium text-sm transition-all relative flex items-center gap-2 ${activeTab === 'custom' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          <User size={16} />
          我的自定义模版
          <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{templates.filter(t => t.type === 'custom').length}</span>
          {activeTab === 'custom' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
        </button>
      </div>

      {/* 3. Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Create New Card (Only visible in custom tab) */}
        {activeTab === 'custom' && (
          <div 
            onClick={handleStartCreate}
            className="group relative border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer h-[280px] hover:shadow-md"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 group-hover:bg-white group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300 flex items-center justify-center mb-4 shadow-inner">
              <Plus size={32} />
            </div>
            <h3 className="font-bold text-gray-600 group-hover:text-blue-600 transition-colors">创建新模版</h3>
            <p className="text-xs text-gray-400 mt-2 text-center px-4">
              从空白开始组合字段<br/>保存为常用业务组件
            </p>
          </div>
        )}

        {/* Template Cards */}
        {filteredTemplates.map(template => (
          <div key={template.id} className="group bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col h-[280px]">
            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors duration-300 ${
                  template.type === 'system' 
                    ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' 
                    : 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'
                }`}>
                   {getIcon(template.title)}
                </div>
                <span className={`text-[10px] px-2 py-1 rounded font-medium ${
                  template.type === 'system' ? 'bg-gray-100 text-gray-500' : 'bg-purple-50 text-purple-600'
                }`}>
                  {template.category}
                </span>
              </div>
              
              <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-1" title={template.title}>
                {template.title}
              </h3>
              
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                {template.description || '暂无描述信息'}
              </p>
              
              <div className="text-xs text-gray-400 flex items-center gap-2">
                 <FileText size={12} />
                 <span>包含 {template.fields.length} 个组件字段</span>
              </div>
            </div>
            
            {/* Card Footer Actions */}
            <div className="border-t border-gray-100 bg-gray-50/50 p-3 flex gap-2 group-hover:bg-white transition-colors">
               <button 
                 onClick={() => setPreviewTemplate(template)}
                 className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
               >
                 <Eye size={14} /> 预览详情
               </button>
               
               {template.type === 'custom' && (
                 <>
                    <button 
                       onClick={() => handleStartEdit(template)}
                       className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Edit2 size={14} /> 编辑
                    </button>
                    <button 
                       onClick={() => handleDelete(template.id)}
                       className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} /> 删除
                    </button>
                 </>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* --- 4. Preview Modal --- */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[85vh]">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <div className="flex items-center gap-2">
                    <Eye size={18} className="text-blue-600" />
                    <h3 className="font-bold text-gray-800">模版预览：{previewTemplate.title}</h3>
                 </div>
                 <button onClick={() => setPreviewTemplate(null)} className="text-gray-400 hover:text-gray-700 transition-colors p-1 hover:bg-gray-200 rounded-full">
                   <X size={20} />
                 </button>
              </div>
              
              <div className="p-6 overflow-y-auto bg-gray-50/50 flex-1">
                 <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-2">
                    {previewTemplate.fields.length > 0 ? (
                       previewTemplate.fields.map((field, idx) => renderFieldPreview(field, idx))
                    ) : (
                       <div className="text-center text-gray-400 py-10">该模版暂无字段</div>
                    )}
                 </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3">
                 <button onClick={() => setPreviewTemplate(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    关闭
                 </button>
                 
                 {previewTemplate.type === 'custom' && (
                    <button 
                       onClick={() => { setPreviewTemplate(null); handleStartEdit(previewTemplate); }}
                       className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                    >
                       <Edit2 size={14} /> 编辑模版
                    </button>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;
