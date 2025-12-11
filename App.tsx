import React, { useState } from 'react';
import { Hammer } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FormList from './components/custom-forms/FormList';
import TemplateLibrary from './components/custom-forms/TemplateLibrary';
import DataAnalysis from './components/custom-forms/DataAnalysis';
import { ComponentTemplate } from './types';

// Initial Mock Data moved from TemplateLibrary
const INITIAL_TEMPLATES: ComponentTemplate[] = [
  { 
    id: 'tpl_identity', 
    title: '身份信息', 
    category: '基础信息', 
    type: 'system',
    description: '包含姓名、身份证号、手机号的标准组合，适用于大多数实名认证场景。',
    fields: [
      { type: 'input', label: '姓名', defaultProps: { required: true, placeholder: '请输入真实姓名' } },
      { type: 'input', label: '身份证号', defaultProps: { required: true, maxLength: 18, placeholder: '请输入18位身份证号' } },
      { type: 'input', label: '手机号码', defaultProps: { required: true, maxLength: 11, placeholder: '请输入联系电话' } }
    ]
  },
  { 
    id: 'tpl_edu', 
    title: '学历信息', 
    category: '背景调查', 
    type: 'system',
    description: '包含毕业院校、学历层次、毕业时间，适用于教育背景核实。',
    fields: [
      { type: 'input', label: '毕业院校', defaultProps: { required: true } },
      { type: 'select', label: '学历层次', defaultProps: { options: ['大专','本科','硕士','博士'], placeholder: '请选择' } },
      { type: 'date', label: '毕业时间', defaultProps: { required: true } }
    ]
  },
  { 
    id: 'tpl_bank', 
    title: '银行卡信息', 
    category: '资金发放', 
    type: 'system',
    description: '收集开户行、卡号及持卡人姓名，确保资金准确发放。',
    fields: [
      { type: 'input', label: '开户银行', defaultProps: { required: true } },
      { type: 'input', label: '银行卡号', defaultProps: { required: true } },
      { type: 'input', label: '持卡人姓名', defaultProps: { required: true } }
    ]
  },
  { 
    id: 'tpl_custom_1', 
    title: '助学专项模版', 
    category: '我的模版', 
    type: 'custom',
    description: '包含学籍号、学校、年级等助学专用字段，针对秋季助学项目定制。',
    fields: [
      { type: 'input', label: '学籍号', defaultProps: {} },
      { type: 'input', label: '学校', defaultProps: {} },
      { type: 'input', label: '年级', defaultProps: {} }
    ]
  },
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard'); // Default to Dashboard
  
  // Shared State for Templates
  const [templates, setTemplates] = useState<ComponentTemplate[]>(INITIAL_TEMPLATES);

  // Mapping menu IDs to Titles for the header
  const getMenuTitle = (id: string) => {
    const titles: Record<string, string> = {
      'dashboard': '工作台',
      'form-mgmt': '表单管理',
      'components-module': '组件模版',
      'data-analysis': '数据分析',
      'project-templates': '项目模板中心',
      'distribute-strategy': '发放策略配置',
      'project-mgmt': '申报项目管理',
      'ai-audit': 'AI 智能审核',
      'user-feedback': '帮助与反馈',
      'stats-analysis': '项目统计分析'
    };
    return titles[id] || '工作台';
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'form-mgmt':
        return <FormList templates={templates} />;
      case 'components-module':
        return (
          <TemplateLibrary 
            templates={templates} 
            onUpdateTemplates={setTemplates} 
          />
        );
      case 'data-analysis':
        return <DataAnalysis />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in-up">
            <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg w-full">
              <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-500">
                 <Hammer size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">功能正在建设中</h2>
              <p className="text-gray-500 mb-8">您访问的 "{getMenuTitle(activeMenu)}" 模块尚在开发阶段，请稍后再试。</p>
              <button 
                onClick={() => setActiveMenu('dashboard')}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                返回工作台
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar is now a flex item, static relative to the flex container */}
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        collapsed={collapsed} 
      />
      
      {/* Main Content Wrapper: Takes remaining space, manages vertical layout of Header + Page */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          currentTitle={getMenuTitle(activeMenu)}
        />
        
        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;