import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Monitor, Smartphone, GripVertical, Type, Hash, 
  CheckSquare, Calendar, UploadCloud, PenTool, Table, DollarSign, List,
  Plus, Trash2, FileText, Eye, Share2, 
  CheckCircle, X, ChevronDown, Clock, Save, Layers, Check, ArrowRight,
  User, CreditCard, GraduationCap, Layout, Box
} from 'lucide-react';
import { ComponentTemplate, TemplateField } from '../../types';
import PublishSettings from './PublishSettings';

interface FormDesignerProps {
  onBack: () => void;
  initialFormId?: string;
  startInPreview?: boolean; // New prop to start in preview mode
  
  // New props for Template Mode
  mode?: 'form' | 'template';
  initialTemplateData?: ComponentTemplate;
  onSaveTemplate?: (data: { title: string, description: string, fields: TemplateField[] }) => void;
  templates?: ComponentTemplate[]; // Shared templates data
}

// --- Component Definitions ---
type ComponentType = 'input' | 'textarea' | 'number' | 'money' | 'radio' | 'checkbox' | 'select' | 'date' | 'upload' | 'signature' | 'subform';

interface SubFieldColumn {
  id: string;
  type: 'input' | 'number' | 'date' | 'select';
  label: string;
  props?: any;
}

interface FormField {
  id: string;
  type: ComponentType;
  label: string;
  pageId: number;
  props: {
    placeholder?: string;
    required?: boolean;
    options?: string[]; // For radio, checkbox, select
    unit?: string;       // For number
    currency?: string;   // For money
    accept?: string;     // For upload
    rows?: number;       // For textarea
    showThousands?: boolean; // For money
    description?: string; // Generic helper text
    
    // New Props
    maxLength?: number;   // For input/textarea
    dateFormat?: 'date' | 'datetime'; // For date
    fileTypes?: string[]; // For upload: ['image', 'doc', 'zip']
    maxSize?: number;     // For upload (MB)
    maxCount?: number;    // For upload (count)
    
    // Sub-form Props
    columns?: SubFieldColumn[]; 
    maxRows?: number;
  };
}

// --- Updated Component Library ---
const COMPONENT_LIBRARY = [
  {
    category: "基础组件",
    items: [
      { type: 'input', label: '单行文本', icon: Type, defaultProps: { placeholder: '请输入', required: false, maxLength: 100 } },
      { type: 'textarea', label: '多行文本', icon: FileText, defaultProps: { placeholder: '请输入详细内容', rows: 3, required: false, maxLength: 255 } },
      { type: 'number', label: '数字输入', icon: Hash, defaultProps: { placeholder: '0', unit: '', required: false } },
      { type: 'money', label: '金额输入', icon: DollarSign, defaultProps: { placeholder: '0.00', currency: '¥', showThousands: true, required: false } },
      { type: 'radio', label: '单选框', icon: CheckCircle, defaultProps: { options: ['选项1', '选项2'], required: false } },
      { type: 'checkbox', label: '多选框', icon: CheckSquare, defaultProps: { options: ['选项1', '选项2', '选项3'], required: false } },
      { type: 'select', label: '下拉选择', icon: List, defaultProps: { options: ['选项1', '选项2'], placeholder: '请选择', required: false } },
      { type: 'date', label: '日期时间', icon: Calendar, defaultProps: { placeholder: '请选择日期', required: false, dateFormat: 'date' } },
    ]
  },
  {
    category: "高级组件", 
    items: [
      { 
        type: 'upload', 
        label: '文件上传', 
        icon: UploadCloud, 
        defaultProps: { 
          placeholder: '点击或拖拽上传', 
          required: false,
          fileTypes: ['image', 'doc'],
          maxSize: 10,
          maxCount: 3
        } 
      },
      { type: 'signature', label: '手写签名', icon: PenTool, defaultProps: { required: true } },
      { 
        type: 'subform', 
        label: '动态子表单', 
        icon: Table, 
        defaultProps: { 
          required: false,
          maxRows: 10,
          columns: [
            { id: 'c1', type: 'input', label: '项目名称' },
            { id: 'c2', type: 'number', label: '数量' }
          ]
        } 
      },
    ]
  }
];

// --- Interactive SubForm Component (Shared for Preview & Canvas) ---
const SubFormInteract: React.FC<{ field: FormField, isDesigner?: boolean }> = ({ field, isDesigner = false }) => {
  const [rows, setRows] = useState<number[]>([1]); // Start with 1 row

  // When field config changes (e.g. columns added), re-render
  useEffect(() => {
    // Keep rows state
  }, [field.props.columns]);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent selection in designer
    const limit = field.props.maxRows || 10;
    if (rows.length < limit) {
      setRows([...rows, Date.now()]);
    }
  };

  const handleRemove = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent parent selection in designer
    setRows(rows.filter(r => r !== id));
  };
  
  const limit = field.props.maxRows || 10;

  const inputClass = `w-full h-8 border border-gray-200 rounded px-2 text-xs focus:border-primary-500 outline-none ${isDesigner ? 'pointer-events-none bg-gray-50' : 'bg-white'}`;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
           <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                 <th className="px-3 py-2 w-10 text-center">#</th>
                 {field.props.columns?.map(col => (
                   <th key={col.id} className="px-3 py-2 min-w-[100px] whitespace-nowrap">{col.label}</th>
                 ))}
                 <th className="px-3 py-2 w-12 text-center">操作</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
              {rows.map((rowId, index) => (
                <tr key={rowId}>
                   <td className="px-3 py-2 text-center text-gray-400">{index + 1}</td>
                   {field.props.columns?.map(col => (
                     <td key={col.id} className="px-3 py-2">
                       {col.type === 'input' && <input type="text" className={inputClass} placeholder="请输入" readOnly={isDesigner} />}
                       {col.type === 'number' && <input type="number" className={inputClass} placeholder="0" readOnly={isDesigner} />}
                       {col.type === 'date' && <input type="date" className={inputClass} readOnly={isDesigner} />}
                       {col.type === 'select' && (
                         <select className={inputClass} disabled={isDesigner}>
                            <option>请选择</option>
                            <option>选项A</option>
                            <option>选项B</option>
                         </select>
                       )}
                     </td>
                   ))}
                   <td className="px-3 py-2 text-center">
                      <button onClick={(e) => handleRemove(e, rowId)} className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer">
                        <Trash2 size={14} className="mx-auto" />
                      </button>
                   </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={10} className="text-center py-4 text-gray-400 text-xs">暂无明细，请添加</td></tr>
              )}
           </tbody>
        </table>
      </div>
      <button 
        onClick={handleAdd}
        disabled={rows.length >= limit}
        className={`w-full py-2 text-xs font-medium border-t border-gray-100 transition-colors flex items-center justify-center gap-1 cursor-pointer
          ${rows.length >= limit 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-50 text-primary-600 hover:bg-gray-100'}
        `}
      >
         <Plus size={14} /> 添加一条记录 {rows.length >= limit ? `(上限${limit}条)` : ''}
      </button>
    </div>
  );
};


const FormDesigner: React.FC<FormDesignerProps> = ({ 
  onBack, 
  initialFormId, 
  startInPreview = false,
  mode = 'form',
  initialTemplateData,
  onSaveTemplate,
  templates = [] // Default empty if not provided
}) => {
  // --- View State ---
  const [viewMode, setViewMode] = useState<'design' | 'publish'>('design');
  const [showPreview, setShowPreview] = useState(startInPreview);
  const [leftTab, setLeftTab] = useState<'components' | 'templates'>('components');

  // --- Design State ---
  const [device, setDevice] = useState<'pc' | 'mobile'>('pc'); // Default PC
  const [rightPanelTab, setRightPanelTab] = useState<'props' | 'settings'>('props');
  
  // Form Configuration
  const [formConfig, setFormConfig] = useState({
    title: initialTemplateData ? initialTemplateData.title : (initialFormId ? '秋季助学金申请表' : (mode === 'template' ? '新建模版' : '未命名表单')),
    desc: initialTemplateData ? (initialTemplateData.description || '') : '请如实填写以下信息，以便我们进行审核。',
    coverImage: mode === 'form', // Templates typically don't need covers, but can have
    coverImageUrl: null as string | null,
    successTitle: '提交成功',
    successDesc: '您的申请已收到，我们将尽快进行审核。',
    pagination: mode === 'form', // Pagination usually for forms
  });

  // Pages
  const [pages, setPages] = useState<number[]>([1]);
  const [activePage, setActivePage] = useState(1);

  // Preview State
  const [previewPage, setPreviewPage] = useState(1);
  const [previewSubmitted, setPreviewSubmitted] = useState(false);

  // Fields (Dynamic State)
  const [fields, setFields] = useState<FormField[]>(() => {
    if (initialTemplateData) {
      // Map TemplateField to FormField
      return initialTemplateData.fields.map((f, i) => ({
        id: `field_init_${i}`,
        type: f.type as ComponentType,
        label: f.label,
        pageId: 1,
        props: JSON.parse(JSON.stringify(f.defaultProps || {}))
      }));
    }
    return [
      { id: 'f1', type: 'input', label: '申请人姓名', pageId: 1, props: { placeholder: '请输入真实姓名', required: true, maxLength: 20 } },
    ];
  });

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // --- Render Publish View ---
  if (viewMode === 'publish') {
    return (
      <PublishSettings 
        formId={initialFormId} 
        formTitle={formConfig.title} 
        onBack={() => setViewMode('design')} 
      />
    );
  }

  // --- Actions ---

  const handleSaveDraft = () => {
    alert('已成功保存至草稿箱！');
  };

  const handleSaveTemplateAction = () => {
    if (onSaveTemplate) {
      // Convert FormField[] back to TemplateField[]
      const templateFields: TemplateField[] = fields.map(f => ({
        type: f.type,
        label: f.label,
        defaultProps: f.props
      }));
      onSaveTemplate({
        title: formConfig.title,
        description: formConfig.desc,
        fields: templateFields
      });
    }
  };

  const handleOpenPreview = () => {
    setPreviewPage(1);
    setPreviewSubmitted(false);
    setShowPreview(true);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setFormConfig(prev => ({ ...prev, coverImageUrl: url }));
    }
  };

  const handleAddField = (item: any) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: item.type as ComponentType,
      label: item.label,
      pageId: activePage,
      props: JSON.parse(JSON.stringify(item.defaultProps)) // Deep copy props
    };
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
    setRightPanelTab('props');
  };

  const handleAddTemplate = (template: any) => {
    const newFields = template.fields.map((item: any, index: number) => ({
      id: `field_${Date.now()}_${index}`,
      type: item.type as ComponentType,
      label: item.label,
      pageId: activePage,
      props: JSON.parse(JSON.stringify(item.defaultProps || {}))
    }));
    setFields(prev => [...prev, ...newFields]);
    if (newFields.length > 0) {
      setSelectedFieldId(newFields[newFields.length - 1].id);
      setRightPanelTab('props');
    }
  };

  const handleDeleteField = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFields(fields.filter(f => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const handleFieldClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedFieldId(id);
    setRightPanelTab('props');
  };

  const updateSelectedField = (key: string, value: any) => {
    setFields(fields.map(f => 
      f.id === selectedFieldId 
        ? { ...f, props: { ...f.props, [key]: value } }
        : f
    ));
  };

  const updateSelectedFieldLabel = (value: string) => {
    setFields(fields.map(f => f.id === selectedFieldId ? { ...f, label: value } : f));
  };

  // Pagination Management
  const handleAddPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newPageId = Math.max(...pages, 0) + 1;
    setPages([...pages, newPageId]);
    setActivePage(newPageId);
  };

  const handleDeletePage = (e: React.MouseEvent, pageId: number) => {
    e.stopPropagation();
    if (pages.length <= 1) {
      alert("至少保留一页");
      return;
    }
    
    if (confirm('删除页面将清空该页所有组件，确认删除吗？')) {
      setFields(fields.filter(f => f.pageId !== pageId));
      const newPages = pages.filter(p => p !== pageId);
      setPages(newPages);
      if (activePage === pageId) {
         setActivePage(newPages[newPages.length - 1]);
      }
    }
  };

  // Sub-form Column Management
  const addSubFormColumn = (type: 'input' | 'number' | 'date' | 'select') => {
    const field = fields.find(f => f.id === selectedFieldId);
    if (!field || !field.props.columns) return;
    
    const newCol: SubFieldColumn = {
      id: `col_${Date.now()}`,
      type,
      label: type === 'input' ? '新文本列' : type === 'number' ? '新数字列' : type === 'date' ? '新日期列' : '新下拉列',
      props: {}
    };
    updateSelectedField('columns', [...field.props.columns, newCol]);
  };

  const removeSubFormColumn = (colId: string) => {
    const field = fields.find(f => f.id === selectedFieldId);
    if (!field || !field.props.columns) return;
    updateSelectedField('columns', field.props.columns.filter(c => c.id !== colId));
  };

  const updateSubFormColumnLabel = (colId: string, label: string) => {
    const field = fields.find(f => f.id === selectedFieldId);
    if (!field || !field.props.columns) return;
    updateSelectedField('columns', field.props.columns.map(c => c.id === colId ? { ...c, label } : c));
  };

  // Option Management
  const addOption = () => {
    const field = fields.find(f => f.id === selectedFieldId);
    if (field && field.props.options) {
      updateSelectedField('options', [...field.props.options, `选项${field.props.options.length + 1}`]);
    }
  };

  const removeOption = (index: number) => {
    const field = fields.find(f => f.id === selectedFieldId);
    if (field && field.props.options) {
      const newOptions = [...field.props.options];
      newOptions.splice(index, 1);
      updateSelectedField('options', newOptions);
    }
  };

  const updateOption = (index: number, value: string) => {
    const field = fields.find(f => f.id === selectedFieldId);
    if (field && field.props.options) {
      const newOptions = [...field.props.options];
      newOptions[index] = value;
      updateSelectedField('options', newOptions);
    }
  };

  // Helper for Upload Props
  const toggleFileType = (type: string) => {
    const field = fields.find(f => f.id === selectedFieldId);
    if (field && field.props.fileTypes) {
      const current = field.props.fileTypes;
      const updated = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
      updateSelectedField('fileTypes', updated);
    }
  };

  // Helper for Template Icons
  const getTemplateIcon = (title: string) => {
    if (title.includes('银行')) return CreditCard;
    if (title.includes('学历')) return GraduationCap;
    if (title.includes('身份')) return User;
    if (title.includes('自定义')) return Layout;
    return Box;
  };

  // --- Render Helpers ---

  const selectedField = fields.find(f => f.id === selectedFieldId);
  const inputBaseClass = "w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none transition-all bg-white";

  const renderField = (field: FormField, isPreview = false) => {
    const isSelected = selectedFieldId === field.id && !isPreview;
    const containerEvents = (isPreview || field.type === 'subform') ? '' : 'pointer-events-none';

    return (
      <div 
        key={field.id}
        onClick={(e) => !isPreview && handleFieldClick(e, field.id)}
        className={`group relative p-4 border rounded-lg transition-all bg-white mb-4
          ${isSelected 
            ? 'border-primary-500 ring-2 ring-primary-50 shadow-sm cursor-pointer' 
            : isPreview ? 'border-transparent' : 'border-transparent hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
          }`}
      >
        <div className="flex justify-between items-start mb-2 pointer-events-none">
           <label className="block text-sm font-bold text-gray-700">
             {field.label} {field.props.required && <span className="text-red-500">*</span>}
           </label>
           {field.type === 'subform' && (
             <span className="text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 rounded border border-primary-100">
                明细表 (Dynamic)
             </span>
           )}
        </div>
        
        <div className={containerEvents}>
          {field.type === 'input' && (
            <div className="relative">
              <input type="text" className={inputBaseClass} placeholder={field.props.placeholder} disabled={!isPreview} />
              {field.props.maxLength && (
                <span className="absolute right-2 bottom-2 text-[10px] text-gray-300">0/{field.props.maxLength}</span>
              )}
            </div>
          )}
          
          {field.type === 'textarea' && (
            <div className="relative">
              <textarea className={inputBaseClass} rows={field.props.rows || 3} placeholder={field.props.placeholder} disabled={!isPreview} />
              {field.props.maxLength && (
                <span className="absolute right-2 bottom-2 text-[10px] text-gray-300">0/{field.props.maxLength}</span>
              )}
            </div>
          )}
          
          {field.type === 'number' && (
            <div className="relative">
               <input type="number" className={inputBaseClass} placeholder={field.props.placeholder} disabled={!isPreview} />
               {field.props.unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{field.props.unit}</span>}
            </div>
          )}
          
          {field.type === 'money' && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{field.props.currency}</span>
              <input type="text" className={`${inputBaseClass} pl-8`} placeholder={field.props.placeholder} disabled={!isPreview} />
            </div>
          )}

          {(field.type === 'radio' || field.type === 'checkbox') && (
            <div className="space-y-2">
              {field.props.options?.map((opt, i) => (
                <label key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className={`w-4 h-4 border border-gray-300 ${field.type === 'radio' ? 'rounded-full' : 'rounded'} bg-gray-50`}></div>
                  {opt}
                </label>
              ))}
            </div>
          )}

          {field.type === 'select' && (
            <div className={`${inputBaseClass} bg-gray-50 flex items-center justify-between text-gray-500`}>
              <span>{field.props.placeholder}</span>
              <ChevronDown size={16} />
            </div>
          )}

          {field.type === 'date' && (
            <div className={`${inputBaseClass} bg-gray-50 flex items-center justify-between text-gray-500`}>
              <span>{field.props.dateFormat === 'datetime' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'}</span>
              <div className="flex items-center gap-1">
                 <Calendar size={16} />
                 {field.props.dateFormat === 'datetime' && <Clock size={16} />}
              </div>
            </div>
          )}

          {field.type === 'upload' && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
               <div className="flex flex-col items-center justify-center text-gray-400 text-xs mb-3">
                  <UploadCloud size={32} className="mb-2 text-gray-300" />
                  <p className="font-medium text-gray-500">{field.props.placeholder}</p>
                  <div className="flex gap-2 mt-1 opacity-70">
                    {field.props.fileTypes?.includes('image') && <span>图片</span>}
                    {field.props.fileTypes?.includes('doc') && <span>文档</span>}
                    {field.props.fileTypes?.includes('zip') && <span>压缩包</span>}
                  </div>
                  <p className="mt-1 opacity-60">最大 {field.props.maxSize}MB / 最多 {field.props.maxCount} 个</p>
               </div>
            </div>
          )}

          {field.type === 'signature' && (
            <div className="border border-gray-300 rounded h-20 bg-gray-50 flex items-end justify-center pb-2 text-gray-300 text-xs italic">
              此处手写签名
            </div>
          )}

          {/* Dynamic Sub-form Rendering */}
          {field.type === 'subform' && (
            <SubFormInteract field={field} isDesigner={!isPreview} />
          )}
        </div>

        {/* Selected Controls */}
        {isSelected && !isPreview && (
          <div className="absolute right-2 top-2 flex gap-1 z-10">
            <button 
              onClick={(e) => handleDeleteField(e, field.id)}
              className="p-1 text-white bg-red-500 hover:bg-red-600 rounded shadow-sm transition-colors"
              title="删除"
            >
              <Trash2 size={14} />
            </button>
            <div className="p-1 text-gray-500 bg-white rounded shadow-sm border border-gray-200 cursor-move">
              <GripVertical size={14} />
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Design View ---
  return (
    <div className="fixed inset-0 bg-gray-100 z-30 flex flex-col animate-fade-in font-sans">
      {/* 1. Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="flex flex-col">
            <h1 className="font-bold text-gray-800 text-sm leading-tight">{formConfig.title}</h1>
            {mode === 'template' && <span className="text-[10px] text-blue-600 font-medium">模版编辑模式</span>}
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setDevice('pc')}
            className={`p-1.5 rounded-md transition-all ${device === 'pc' ? 'bg-white shadow text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Monitor size={18} />
          </button>
          <button 
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-md transition-all ${device === 'mobile' ? 'bg-white shadow text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Smartphone size={18} />
          </button>
        </div>

        {/* Header Actions - Conditional based on mode */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleOpenPreview}
            className="text-gray-600 hover:text-primary-600 text-sm font-medium px-3 py-1.5 rounded hover:bg-gray-50 flex items-center gap-1"
          >
            <Eye size={16} /> 预览
          </button>
          
          {mode === 'form' ? (
            <>
              <button 
                onClick={handleSaveDraft}
                className="bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 text-sm font-medium px-4 py-1.5 rounded shadow-sm flex items-center gap-2 transition-colors"
              >
                <Save size={16} />
                保存草稿
              </button>
              <button 
                onClick={() => setViewMode('publish')}
                className="bg-primary-600 text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-primary-700 shadow-sm flex items-center gap-2"
              >
                <Share2 size={16} />
                发布表单
              </button>
            </>
          ) : (
             <button 
                onClick={handleSaveTemplateAction}
                className="bg-primary-600 text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-primary-700 shadow-sm flex items-center gap-2"
             >
                <Save size={16} />
                保存模版
             </button>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. Left Component Panel */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-10">
           {mode === 'form' ? (
             <div className="flex border-b border-gray-200">
               <button 
                  onClick={() => setLeftTab('components')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${leftTab === 'components' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
               >
                  基础组件
               </button>
               <button 
                  onClick={() => setLeftTab('templates')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${leftTab === 'templates' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
               >
                  组件模版
               </button>
             </div>
           ) : (
             <div className="py-3 px-4 border-b border-gray-200 bg-gray-50">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">可选组件</span>
             </div>
           )}
           
           <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {(leftTab === 'components' || mode === 'template') ? (
                  COMPONENT_LIBRARY.map((group, idx) => (
                    <div key={idx}>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{group.category}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {group.items.map((item) => (
                          <button
                            key={item.type}
                            onClick={() => handleAddField(item)}
                            className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded hover:border-primary-300 hover:bg-primary-50 transition-all group bg-white"
                          >
                            <item.icon size={20} className="mb-2 text-gray-500 group-hover:text-primary-600" />
                            <span className="text-xs text-gray-600 group-hover:text-gray-900">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {/* System Templates */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">系统模版</h3>
                        <div className="space-y-2">
                           {templates.filter(t => t.type === 'system').map(tpl => {
                             const Icon = getTemplateIcon(tpl.title);
                             return (
                               <button 
                                 key={tpl.id}
                                 onClick={() => handleAddTemplate(tpl)}
                                 className="w-full flex items-center p-3 border border-gray-200 rounded hover:border-primary-300 hover:bg-primary-50 transition-all group bg-white text-left gap-3"
                               >
                                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                     <Icon size={18} />
                                  </div>
                                  <div className="flex-1">
                                     <span className="text-xs font-bold text-gray-700 block group-hover:text-primary-700">{tpl.title}</span>
                                     <span className="text-[10px] text-gray-400 block mt-0.5">{tpl.fields.length} 个字段</span>
                                  </div>
                                  <Plus size={14} className="text-gray-300 group-hover:text-primary-600" />
                               </button>
                             );
                           })}
                        </div>
                    </div>

                    {/* Custom Templates */}
                    {templates.filter(t => t.type === 'custom').length > 0 && (
                      <div>
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">我的自定义模版</h3>
                          <div className="space-y-2">
                            {templates.filter(t => t.type === 'custom').map(tpl => {
                              const Icon = getTemplateIcon(tpl.title);
                              return (
                                <button 
                                  key={tpl.id}
                                  onClick={() => handleAddTemplate(tpl)}
                                  className="w-full flex items-center p-3 border border-gray-200 rounded hover:border-primary-300 hover:bg-primary-50 transition-all group bg-white text-left gap-3"
                                >
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                                      <Icon size={18} />
                                    </div>
                                    <div className="flex-1">
                                      <span className="text-xs font-bold text-gray-700 block group-hover:text-primary-700">{tpl.title}</span>
                                      <span className="text-[10px] text-gray-400 block mt-0.5">{tpl.fields.length} 个字段</span>
                                    </div>
                                    <Plus size={14} className="text-gray-300 group-hover:text-primary-600" />
                                </button>
                              );
                            })}
                          </div>
                      </div>
                    )}
                  </>
                )}
           </div>
        </aside>

        {/* 3. Center Canvas */}
        <main 
          className="flex-1 bg-gray-100 overflow-hidden flex flex-col items-center relative" 
          onClick={() => { setSelectedFieldId(null); setRightPanelTab('settings'); }}
        >
          {/* Canvas Scroll Area */}
          <div className="flex-1 w-full overflow-y-auto flex justify-center p-8">
            <div 
              onClick={(e) => e.stopPropagation()} 
              className={`bg-white shadow-xl transition-all duration-300 flex flex-col relative ${
                device === 'mobile' ? 'w-[375px] min-h-[667px] rounded-[30px] border-[8px] border-gray-800' : 'w-[800px] min-h-[800px] rounded-sm'
              }`}
            >
              {/* Simulate Mobile Status Bar */}
              {device === 'mobile' && (
                <div className="h-6 bg-gray-800 rounded-t-[20px] w-full flex justify-center items-center shrink-0 z-20">
                  <div className="w-16 h-4 bg-black rounded-b-lg"></div>
                </div>
              )}

              {/* Form Content */}
              <div className={`flex-1 flex flex-col min-h-0 overflow-y-auto ${device === 'mobile' ? 'rounded-b-[20px]' : ''}`}>
                
                {/* Pagination Tab Bar */}
                {formConfig.pagination && (
                  <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 overflow-x-auto shrink-0 sticky top-0 z-10">
                    {pages.map((p, idx) => (
                      <div 
                        key={p} 
                        onClick={() => setActivePage(p)}
                        className={`px-3 py-1.5 rounded-t-lg text-xs font-medium cursor-pointer flex items-center gap-2 border-b-2 transition-colors ${
                          activePage === p ? 'bg-white border-primary-600 text-primary-700 shadow-sm' : 'hover:bg-gray-100 border-transparent text-gray-500'
                        }`}
                      >
                         <span>第{p}页</span>
                         {activePage === p && pages.length > 1 && (
                            <button 
                              onClick={(e) => handleDeletePage(e, p)}
                              className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400"
                              title="删除此页"
                            >
                              <X size={10} />
                            </button>
                         )}
                      </div>
                    ))}
                    <button 
                      onClick={handleAddPage}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500 ml-1"
                      title="添加一页"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                )}

                {/* Form Header */}
                <div 
                  className={`p-6 border-b border-gray-100 group cursor-pointer hover:bg-gray-50 transition-colors relative shrink-0 ${rightPanelTab === 'settings' ? 'bg-primary-50/30' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setRightPanelTab('settings'); setSelectedFieldId(null); }}
                >
                  {formConfig.coverImage && (
                    <div className="h-32 w-full rounded-lg mb-4 overflow-hidden relative group/cover">
                      {formConfig.coverImageUrl ? (
                         <img src={formConfig.coverImageUrl} className="w-full h-full object-cover" alt="Cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-red-50 to-orange-50 flex items-center justify-center text-primary-200 border border-gray-100 border-dashed">
                          <div className="flex flex-col items-center">
                             <UploadCloud size={24} className="mb-1" />
                             <span className="text-xs font-medium">默认封面区</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <h2 className="text-xl font-bold text-gray-800 text-center">{formConfig.title}</h2>
                  <p className="text-sm text-gray-500 text-center mt-2 whitespace-pre-wrap">{formConfig.desc}</p>
                </div>

                {/* Form Fields */}
                <div className="p-4 pb-20">
                    {fields.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <List size={40} className="mb-2 opacity-50" />
                        <p className="text-sm">暂无组件</p>
                        <p className="text-xs">点击左侧组件库添加</p>
                      </div>
                    ) : (
                      fields
                        .filter(f => formConfig.pagination ? f.pageId === activePage : true)
                        .map(field => renderField(field))
                    )}
                    
                    {fields.filter(f => formConfig.pagination ? f.pageId === activePage : true).length === 0 && fields.length > 0 && (
                       <div className="text-center py-10 text-gray-400 text-xs">此页暂无组件</div>
                    )}
                </div>

                {/* Footer - Interactive Pagination */}
                 <div className="p-4 mt-auto border-t border-gray-100 bg-gray-50/50">
                      {formConfig.pagination && pages.length > 1 ? (
                        <div className="flex gap-3">
                           {activePage > 1 && (
                             <button 
                               onClick={() => setActivePage(p => Math.max(1, p - 1))}
                               className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
                             >
                               上一页
                             </button>
                           )}
                           {activePage < pages.length ? (
                             <button 
                               onClick={() => setActivePage(p => Math.min(pages.length, p + 1))}
                               className="flex-1 bg-primary-600 text-white py-2.5 rounded-lg font-medium shadow-sm hover:bg-primary-700 active:bg-primary-800 transition-colors"
                             >
                               下一页
                             </button>
                           ) : (
                             <button className="flex-1 bg-primary-600 text-white py-2.5 rounded-lg font-medium shadow-sm">提交</button>
                           )}
                        </div>
                      ) : (
                        <button className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium shadow-sm">提交</button>
                      )}
                 </div>
              </div>
            </div>
          </div>
        </main>

        {/* 4. Right Property Panel */}
        <aside className="w-80 bg-white border-l border-gray-200 flex flex-col z-10 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => { setRightPanelTab('props'); }}
              className={`flex-1 py-3 text-sm font-medium ${rightPanelTab === 'props' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              组件属性
            </button>
            <button 
              onClick={() => { setRightPanelTab('settings'); }}
              className={`flex-1 py-3 text-sm font-medium ${rightPanelTab === 'settings' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {mode === 'form' ? '表单设置' : '模版设置'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-0">
            {rightPanelTab === 'props' ? (
              selectedField ? (
                <div className="p-5 space-y-6 animate-in fade-in duration-200">
                  {/* Basic Info */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-3 border-l-4 border-primary-600 pl-2">基础信息</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">标题 (Label)</label>
                        <input type="text" value={selectedField.label} onChange={(e) => updateSelectedFieldLabel(e.target.value)} className={inputBaseClass} />
                      </div>
                      
                      {selectedField.props.placeholder !== undefined && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">提示文字 (Placeholder)</label>
                          <input type="text" value={selectedField.props.placeholder} onChange={(e) => updateSelectedField('placeholder', e.target.value)} className={inputBaseClass} />
                        </div>
                      )}

                      {/* Input Limits */}
                      {(selectedField.type === 'input' || selectedField.type === 'textarea') && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">字数限制 (Max Length)</label>
                          <input 
                            type="number" 
                            value={selectedField.props.maxLength || (selectedField.type === 'input' ? 100 : 255)} 
                            onChange={(e) => updateSelectedField('maxLength', parseInt(e.target.value))} 
                            className={inputBaseClass} 
                          />
                        </div>
                      )}

                      {/* Date Format */}
                      {selectedField.type === 'date' && (
                        <div>
                           <label className="block text-xs text-gray-500 mb-1">日期格式</label>
                           <div className="flex gap-4">
                              <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input type="radio" checked={selectedField.props.dateFormat === 'date'} onChange={() => updateSelectedField('dateFormat', 'date')} /> 年月日
                              </label>
                              <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input type="radio" checked={selectedField.props.dateFormat === 'datetime'} onChange={() => updateSelectedField('dateFormat', 'datetime')} /> 日期+时间
                              </label>
                           </div>
                        </div>
                      )}

                      {/* Upload Config */}
                      {selectedField.type === 'upload' && (
                        <div className="space-y-3 p-3 bg-gray-50 rounded border border-gray-200">
                           <div>
                              <label className="block text-xs text-gray-500 mb-1">允许文件类型</label>
                              <div className="flex flex-wrap gap-3">
                                <label className="flex items-center gap-1 text-xs text-gray-600"><input type="checkbox" checked={selectedField.props.fileTypes?.includes('image')} onChange={() => toggleFileType('image')} /> 图片</label>
                                <label className="flex items-center gap-1 text-xs text-gray-600"><input type="checkbox" checked={selectedField.props.fileTypes?.includes('doc')} onChange={() => toggleFileType('doc')} /> 文档</label>
                                <label className="flex items-center gap-1 text-xs text-gray-600"><input type="checkbox" checked={selectedField.props.fileTypes?.includes('zip')} onChange={() => toggleFileType('zip')} /> 压缩包</label>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">最大大小 (MB)</label>
                                <input type="number" max={200} value={selectedField.props.maxSize} onChange={(e) => updateSelectedField('maxSize', parseInt(e.target.value))} className={inputBaseClass} />
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">最大数量</label>
                                <input type="number" max={9} value={selectedField.props.maxCount} onChange={(e) => updateSelectedField('maxCount', parseInt(e.target.value))} className={inputBaseClass} />
                              </div>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Sub-form Config */}
                  {selectedField.type === 'subform' && (
                     <div>
                        <h4 className="text-sm font-bold text-gray-800 mb-3 border-l-4 border-primary-600 pl-2">明细列配置</h4>
                        <div className="space-y-2 mb-3">
                           {selectedField.props.columns?.map(col => (
                             <div key={col.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-200">
                                <GripVertical size={14} className="text-gray-300 cursor-move" />
                                <div className="flex-1">
                                   <input 
                                     type="text" 
                                     value={col.label} 
                                     onChange={(e) => updateSubFormColumnLabel(col.id, e.target.value)}
                                     className="w-full text-xs bg-transparent border-b border-transparent focus:border-primary-300 outline-none"
                                   />
                                   <span className="text-[10px] text-gray-400 block">{col.type === 'input' ? '文本' : col.type === 'number' ? '数字' : '日期'}</span>
                                </div>
                                <button onClick={() => removeSubFormColumn(col.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                             </div>
                           ))}
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                           <button onClick={() => addSubFormColumn('input')} className="flex flex-col items-center justify-center p-2 border border-gray-200 rounded hover:bg-primary-50 hover:border-primary-200 transition-colors">
                              <Type size={16} className="text-gray-500 mb-1" />
                              <span className="text-[10px] text-gray-600">加文本</span>
                           </button>
                           <button onClick={() => addSubFormColumn('number')} className="flex flex-col items-center justify-center p-2 border border-gray-200 rounded hover:bg-primary-50 hover:border-primary-200 transition-colors">
                              <Hash size={16} className="text-gray-500 mb-1" />
                              <span className="text-[10px] text-gray-600">加数字</span>
                           </button>
                           <button onClick={() => addSubFormColumn('date')} className="flex flex-col items-center justify-center p-2 border border-gray-200 rounded hover:bg-primary-50 hover:border-primary-200 transition-colors">
                              <Calendar size={16} className="text-gray-500 mb-1" />
                              <span className="text-[10px] text-gray-600">加日期</span>
                           </button>
                        </div>

                        <div className="mb-3">
                           <label className="block text-xs text-gray-500 mb-1">最大行数限制</label>
                           <input 
                             type="number" 
                             min={1} 
                             max={20} 
                             value={selectedField.props.maxRows || 10} 
                             onChange={(e) => updateSelectedField('maxRows', parseInt(e.target.value))}
                             className={inputBaseClass} 
                           />
                           <p className="text-[10px] text-gray-400 mt-1">默认限制10条</p>
                        </div>
                     </div>
                  )}

                  {/* Options Editor */}
                  {['radio', 'checkbox', 'select'].includes(selectedField.type) && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 mb-3 border-l-4 border-primary-600 pl-2">选项配置</h4>
                      <div className="space-y-2">
                        {selectedField.props.options?.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={opt} 
                              onChange={(e) => updateOption(idx, e.target.value)}
                              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:border-primary-500 outline-none"
                            />
                            <button onClick={() => removeOption(idx)} className="text-gray-400 hover:text-red-500">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        <button onClick={addOption} className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1 mt-1 pl-1"><Plus size={12} /> 添加选项</button>
                      </div>
                    </div>
                  )}

                  {/* Validation Rules */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-3 border-l-4 border-primary-600 pl-2">校验规则</h4>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <span className="text-sm text-gray-700">设为必填项</span>
                         <button 
                           onClick={() => updateSelectedField('required', !selectedField.props.required)}
                           className={`w-10 h-5 rounded-full relative transition-colors ${selectedField.props.required ? 'bg-primary-600' : 'bg-gray-300'}`}
                         >
                           <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${selectedField.props.required ? 'left-6' : 'left-1'}`}></div>
                         </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <p>请在左侧画布选中一个组件</p>
                  <p className="text-xs mt-1">来配置它的属性</p>
                </div>
              )
            ) : (
              // --- Global Form/Template Settings ---
              <div className="p-5 space-y-6">
                 <div>
                   <h4 className="text-sm font-bold text-gray-800 mb-3 border-l-4 border-primary-600 pl-2">
                      {mode === 'form' ? '表单基础设置' : '模版基础设置'}
                   </h4>
                   <div className="space-y-3">
                     <div>
                       <label className="block text-xs text-gray-500 mb-1">
                          {mode === 'form' ? '表单名称' : '模版名称'}
                       </label>
                       <input 
                         type="text" 
                         value={formConfig.title} 
                         onChange={(e) => setFormConfig({...formConfig, title: e.target.value})}
                         className={inputBaseClass} 
                       />
                     </div>
                     <div>
                       <label className="block text-xs text-gray-500 mb-1">说明/描述</label>
                       <textarea rows={3} value={formConfig.desc} onChange={(e) => setFormConfig({...formConfig, desc: e.target.value})} className={inputBaseClass} />
                     </div>
                   </div>
                 </div>

                 {/* Pagination Toggle - Only for Forms */}
                 {mode === 'form' && (
                    <div>
                        <h4 className="text-sm font-bold text-gray-800 mb-3 border-l-4 border-primary-600 pl-2">页面设置</h4>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Layers size={18} className="text-primary-600" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700">启用分页功能</span>
                                <span className="text-xs text-gray-400">长表单分步填写体验更好</span>
                            </div>
                        </div>
                        <button 
                                onClick={() => setFormConfig({...formConfig, pagination: !formConfig.pagination})}
                                className={`w-10 h-5 rounded-full relative transition-colors ${formConfig.pagination ? 'bg-primary-600' : 'bg-gray-300'}`}
                        >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formConfig.pagination ? 'left-6' : 'left-1'}`}></div>
                        </button>
                        </div>
                    </div>
                 )}

                 {/* Cover Settings - Only for Forms */}
                 {mode === 'form' && (
                    <div>
                        <h4 className="text-sm font-bold text-gray-800 mb-3 border-l-4 border-primary-600 pl-2">封面设置</h4>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">显示封面图片</span>
                            <button 
                                onClick={() => setFormConfig({...formConfig, coverImage: !formConfig.coverImage})}
                                className={`w-10 h-5 rounded-full relative transition-colors ${formConfig.coverImage ? 'bg-primary-600' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formConfig.coverImage ? 'left-6' : 'left-1'}`}></div>
                            </button>
                        </div>
                        
                        {formConfig.coverImage && (
                            <div className="relative group cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 w-full flex flex-col items-center justify-center bg-white hover:border-primary-400 transition-colors overflow-hidden">
                                {formConfig.coverImageUrl ? (
                                    <img src={formConfig.coverImageUrl} className="w-full h-full object-cover" alt="cover" />
                                ) : (
                                    <>
                                        <UploadCloud size={24} className="text-gray-400 mb-2" />
                                        <span className="text-xs text-gray-500">点击上传封面图</span>
                                        <span className="text-[10px] text-gray-400 mt-1">支持 JPG/PNG, max 2MB</span>
                                    </>
                                )}
                                {formConfig.coverImageUrl && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
                                        点击更换图片
                                    </div>
                                )}
                                </div>
                                <input type="file" accept="image/*" onChange={handleCoverUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        )}
                        </div>
                    </div>
                 )}

                 {/* Success Message Settings - Only for Forms */}
                 {mode === 'form' && (
                    <div>
                        <h4 className="text-sm font-bold text-gray-800 mb-3 border-l-4 border-primary-600 pl-2">提交后提示</h4>
                        <div className="space-y-3 bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Check size={16} className="text-green-600" />
                            <span className="text-sm font-medium text-gray-700">成功页面配置</span>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">提示标题</label>
                            <input 
                                type="text" 
                                value={formConfig.successTitle} 
                                onChange={(e) => setFormConfig({...formConfig, successTitle: e.target.value})}
                                className={inputBaseClass} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">提示正文</label>
                            <textarea 
                                rows={2} 
                                value={formConfig.successDesc} 
                                onChange={(e) => setFormConfig({...formConfig, successDesc: e.target.value})} 
                                className={inputBaseClass} 
                            />
                        </div>
                        </div>
                    </div>
                 )}
              </div>
            )}
          </div>
        </aside>

      </div>

      {/* --- Preview Modal --- */}
      {showPreview && (
         <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in">
               <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-gray-50">
                  <h3 className="font-bold text-gray-800">{mode === 'form' ? '表单预览' : '模版预览'}</h3>
                  <div className="flex bg-white border border-gray-200 p-1 rounded-lg">
                    <button onClick={() => setDevice('pc')} className={`p-1.5 rounded ${device === 'pc' ? 'bg-primary-50 text-primary-600' : 'text-gray-400'}`}><Monitor size={16} /></button>
                    <button onClick={() => setDevice('mobile')} className={`p-1.5 rounded ${device === 'mobile' ? 'bg-primary-50 text-primary-600' : 'text-gray-400'}`}><Smartphone size={16} /></button>
                  </div>
                  <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-800"><X size={20} /></button>
               </div>
               <div className="flex-1 bg-gray-100 overflow-y-auto flex justify-center p-8">
                  <div className={`bg-white shadow-lg transition-all ${device === 'mobile' ? 'w-[375px] min-h-[667px] rounded-[30px] border-[8px] border-gray-800' : 'w-[800px] min-h-[600px] rounded-lg'}`}>
                     <div className={`h-full flex flex-col ${device === 'mobile' ? 'rounded-[20px] overflow-hidden' : ''}`}>
                        {device === 'mobile' && <div className="h-6 bg-gray-800 w-full flex justify-center items-center shrink-0"><div className="w-16 h-4 bg-black rounded-b-lg"></div></div>}
                        
                        {/* Preview Content */}
                        <div className="flex-1 overflow-y-auto flex flex-col">
                           {previewSubmitted ? (
                             // Success State
                             <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-fade-in">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                  <Check size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{formConfig.successTitle}</h2>
                                <p className="text-gray-500">{formConfig.successDesc}</p>
                                <button 
                                  onClick={() => setShowPreview(false)}
                                  className="mt-8 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                  关闭预览
                                </button>
                             </div>
                           ) : (
                             // Form State
                             <>
                               {/* Form Header */}
                               <div className="p-6 border-b border-gray-100 bg-primary-50/30">
                                  <h2 className="text-xl font-bold text-center text-gray-800">{formConfig.title}</h2>
                                  {/* Progress bar if pagination */}
                                  {formConfig.pagination && pages.length > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-2 text-xs text-primary-700">
                                       <span className="font-medium">第 {previewPage} / {pages.length} 页</span>
                                       <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                          <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: `${(previewPage / pages.length) * 100}%` }}></div>
                                       </div>
                                    </div>
                                  )}
                               </div>

                               <div className="p-4 space-y-4 flex-1">
                                  {/* Filter Fields by Preview Page */}
                                  {fields
                                    .filter(f => formConfig.pagination ? f.pageId === previewPage : true)
                                    .map(f => renderField(f, true))
                                  }
                                  
                                  {fields.filter(f => formConfig.pagination ? f.pageId === previewPage : true).length === 0 && (
                                     <div className="text-center py-10 text-gray-400 text-xs">此页暂无组件</div>
                                  )}
                               </div>

                               {/* Preview Footer */}
                               <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                                  {formConfig.pagination && pages.length > 1 ? (
                                    <div className="flex gap-3">
                                       {previewPage > 1 && (
                                         <button 
                                           onClick={() => setPreviewPage(p => Math.max(1, p - 1))}
                                           className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-50"
                                         >
                                           上一页
                                         </button>
                                       )}
                                       {previewPage < pages.length ? (
                                         <button 
                                           onClick={() => setPreviewPage(p => Math.min(pages.length, p + 1))}
                                           className="flex-1 bg-primary-600 text-white py-2.5 rounded-lg font-medium shadow-sm hover:bg-primary-700"
                                         >
                                           下一页
                                         </button>
                                       ) : (
                                         <button 
                                            onClick={() => setPreviewSubmitted(true)}
                                            className="flex-1 bg-primary-600 text-white py-2.5 rounded-lg font-medium shadow-sm hover:bg-primary-700"
                                         >
                                            提交
                                         </button>
                                       )}
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => setPreviewSubmitted(true)}
                                      className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium shadow-sm hover:bg-primary-700"
                                    >
                                      提交
                                    </button>
                                  )}
                               </div>
                             </>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default FormDesigner;