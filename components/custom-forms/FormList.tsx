import React, { useState } from 'react';
import { 
  Search, Plus, Filter, Calendar, Edit, Database, Eye, 
  Share2, Smartphone, QrCode, X, Copy, ChevronDown, ArrowLeft
} from 'lucide-react';
import { FormItem, Channel, ComponentTemplate } from '../../types';
import FormDesigner from './FormDesigner';
import PublishSettings from './PublishSettings';
import DataAnalysis from './DataAnalysis';
import Pagination from '../Pagination';

const MOCK_FORMS: FormItem[] = [
  { id: 'F001', title: '秋季助学金申请表', status: 'active', submitCountToday: 12, submitCountTotal: 5300, lastUpdated: '2023-10-24 10:00', channels: ['app', 'qr'] },
  { id: 'F002', title: '临时困难救助登记', status: 'draft', submitCountToday: 0, submitCountTotal: 0, lastUpdated: '2023-10-23 16:30', channels: [] },
  { id: 'F003', title: '志愿者招募报名', status: 'ended', submitCountToday: 0, submitCountTotal: 128, lastUpdated: '2023-09-15 09:00', channels: ['qr'] },
  { id: 'F004', title: '物资发放签收单', status: 'active', submitCountToday: 45, submitCountTotal: 1250, lastUpdated: '2023-10-24 08:15', channels: ['app'] },
];

interface FormListProps {
  templates?: ComponentTemplate[];
}

const FormList: React.FC<FormListProps> = ({ templates }) => {
  const [view, setView] = useState<'list' | 'designer' | 'data' | 'publish'>('list');
  const [selectedForm, setSelectedForm] = useState<FormItem | null>(null);
  const [startInPreview, setStartInPreview] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // --- Actions ---
  const handleCreate = () => {
    setSelectedForm(null); // New form
    setStartInPreview(false);
    setView('designer');
  };

  const handleEdit = (form: FormItem) => {
    setSelectedForm(form);
    setStartInPreview(false);
    setView('designer');
  };

  const handlePreview = (form: FormItem) => {
    setSelectedForm(form);
    setStartInPreview(true);
    setView('designer');
  };

  const handleViewData = (form: FormItem) => {
    setSelectedForm(form);
    setView('data');
  };

  const handleDistribute = (form: FormItem) => {
    setSelectedForm(form);
    setView('publish');
  };

  // --- Data & Pagination Logic ---
  // In a real app, filtering would be applied here before pagination
  const paginatedForms = MOCK_FORMS.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // --- Render Views ---
  if (view === 'designer') {
    return (
      <FormDesigner 
        onBack={() => setView('list')} 
        initialFormId={selectedForm?.id} 
        startInPreview={startInPreview} 
        templates={templates}
      />
    );
  }

  if (view === 'publish') {
    return (
      <PublishSettings 
        formId={selectedForm?.id} 
        formTitle={selectedForm?.title || '未命名表单'} 
        onBack={() => setView('list')} 
      />
    );
  }

  if (view === 'data') {
    return (
      <div>
        <button 
          onClick={() => setView('list')} 
          className="mb-4 flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> 返回表单列表
        </button>
        <DataAnalysis formId={selectedForm?.id} formTitle={selectedForm?.title} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 items-center">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索表单名称..." 
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 w-64"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
             <select className="appearance-none pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none cursor-pointer">
               <option>所有状态</option>
               <option>进行中</option>
               <option>草稿</option>
               <option>已截止</option>
             </select>
             <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
             <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          {/* Date Range Picker (Ant Design Style) */}
          <div className="group flex items-center bg-white border border-gray-200 hover:border-blue-400 rounded-lg px-3 h-[38px] w-64 transition-all focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 shadow-sm">
             <div className="relative flex-1 min-w-0">
               <input 
                 type="text" 
                 placeholder="开始日期" 
                 className="w-full text-sm outline-none text-gray-600 placeholder-gray-400 bg-transparent text-center cursor-pointer font-sans"
                 onFocus={(e) => e.target.type = 'date'}
                 onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
               />
             </div>
             <span className="text-gray-300 mx-2">~</span>
             <div className="relative flex-1 min-w-0">
               <input 
                 type="text" 
                 placeholder="结束日期" 
                 className="w-full text-sm outline-none text-gray-600 placeholder-gray-400 bg-transparent text-center cursor-pointer font-sans"
                 onFocus={(e) => e.target.type = 'date'}
                 onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
               />
             </div>
             <Calendar size={14} className="text-gray-400 ml-1 flex-shrink-0 group-hover:text-gray-500" />
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus size={16} />
            新建表单
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
            <tr>
              <th className="px-6 py-4">表单名称</th>
              <th className="px-6 py-4">收集状态</th>
              <th className="px-6 py-4">数据概览 (今日/累计)</th>
              <th className="px-6 py-4">更新时间</th>
              <th className="px-6 py-4 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {paginatedForms.map((form) => (
              <tr key={form.id} className="hover:bg-gray-50 group transition-colors">
                <td className="px-6 py-4">
                  <div 
                    className="flex items-center gap-3 cursor-pointer group/title"
                    onClick={() => handleViewData(form)}
                  >
                    <div className="w-8 h-8 rounded bg-primary-50 flex items-center justify-center text-primary-600">
                      <Database size={16} />
                    </div>
                    <div>
                       <span className="font-medium text-gray-800 group-hover/title:text-primary-600 transition-colors">{form.title}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                    ${form.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 
                      form.status === 'draft' ? 'bg-gray-100 text-gray-600 border-gray-200' : 
                      'bg-red-50 text-red-700 border-red-100'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      form.status === 'active' ? 'bg-green-500' : 
                      form.status === 'draft' ? 'bg-gray-400' : 'bg-red-500'
                    }`}></span>
                    {form.status === 'active' ? '进行中' : form.status === 'draft' ? '草稿' : '已截止'}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-gray-600">
                  <span className="text-primary-600 font-bold">{form.submitCountToday}</span>
                  <span className="mx-1 text-gray-300">/</span>
                  <span>{form.submitCountTotal.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">{form.lastUpdated}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleEdit(form)} className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors" title="设计表单">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleViewData(form)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="查看数据">
                      <Database size={16} />
                    </button>
                    <button onClick={() => handlePreview(form)} className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors" title="预览">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleDistribute(form)} className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors" title="发布/分发">
                      <Share2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <Pagination 
           totalItems={MOCK_FORMS.length}
           pageSize={pageSize}
           currentPage={currentPage}
           onPageChange={setCurrentPage}
           onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
};

export default FormList;