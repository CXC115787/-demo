
import React, { useState } from 'react';
import { 
  ArrowLeft, Smartphone, Globe, QrCode, Copy, Download, 
  Plus, Share2, AlertTriangle, CheckCircle2, Lock, Edit3, Trash2,
  FileText, ExternalLink, Eye, Save, Link
} from 'lucide-react';
import { Channel } from '../../types';
import Pagination from '../Pagination';

interface PublishSettingsProps {
  formId?: string;
  formTitle: string;
  onBack: () => void;
}

// Initial Channels Data
const INITIAL_CHANNELS: Channel[] = [
  { 
    id: 'sys_app', 
    name: '申领项目表单 (App端)', 
    tag: 'sys_app_entry', 
    views: 1250, 
    submissions: 560, 
    createTime: '2023-01-01', 
    status: 'active', 
    isSystem: true 
  },
  { 
    id: 'sys_public', 
    name: '调查问卷 (公共链接)', 
    tag: 'sys_public_link', 
    views: 3400, 
    submissions: 1205, 
    createTime: '2023-01-01', 
    status: 'disabled', // Default off
    isSystem: true 
  },
  { 
    id: 'C01', 
    name: 'A栋大厅海报', 
    tag: 'ch_auto_x8d', 
    views: 1250, 
    submissions: 342, 
    createTime: '2023-10-01', 
    status: 'active',
    isSystem: false
  },
];

const PublishSettings: React.FC<PublishSettingsProps> = ({ formId, formTitle, onBack }) => {
  // --- State ---
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [generatedTag, setGeneratedTag] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Helpers to get system channels
  const appChannel = channels.find(c => c.id === 'sys_app');
  const publicChannel = channels.find(c => c.id === 'sys_public');

  // --- Actions ---

  const toggleChannelStatus = (id: string) => {
    setChannels(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'active' ? 'disabled' : 'active' };
      }
      return c;
    }));
  };

  const openCreateModal = () => {
    setNewChannelName('');
    setGeneratedTag(`ch_${Math.random().toString(36).substring(2, 8)}`);
    setShowAddModal(true);
  };

  const handleAddChannel = () => {
    if (!newChannelName) return;
    const channel: Channel = {
      id: `C${Date.now()}`,
      name: newChannelName,
      tag: generatedTag,
      views: 0,
      submissions: 0,
      createTime: new Date().toISOString().split('T')[0],
      status: 'active',
      isSystem: false
    };
    setChannels([...channels, channel]);
    setShowAddModal(false);
  };

  const handleDeleteChannel = (id: string) => {
    if (confirm('确认删除该渠道吗？删除后该二维码将失效。')) {
      setChannels(channels.filter(c => c.id !== id));
    }
  };

  const copyLink = (tag: string) => {
    const url = `https://app.example.com/s/${formId || 'F001'}?ch=${tag}`;
    alert(`链接已复制: ${url}`);
  };

  const handleDataClick = (tagName: string, channelName: string) => {
    alert(`跳转至数据列表，筛选渠道来源：${channelName} (${tagName})`);
  };

  // --- Paginated Data ---
  const paginatedChannels = channels.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // --- Render Helpers ---

  const RenderSwitch = ({ active, onClick, disabled }: { active: boolean; onClick: () => void, disabled?: boolean }) => (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`w-11 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${
        disabled ? 'bg-gray-200 cursor-not-allowed' : (active ? 'bg-green-500' : 'bg-gray-300')
      }`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${active ? 'left-6' : 'left-1'}`}></div>
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-fade-in-up font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">发布设置</h1>
            <p className="text-xs text-gray-500 mt-0.5">表单：{formTitle}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* --- Section 1: System Channels Control --- */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Share2 size={20} className="text-primary-600" /> 
              分发渠道配置
            </h3>
            <p className="text-sm text-gray-500 mb-4 ml-7">
              支持“申领项目表单”与“调查问卷”两个核心渠道，可同时开启。关闭后对应链接将不可访问。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: App Channel */}
              <div className={`bg-white rounded-xl border p-5 transition-all ${appChannel?.status === 'active' ? 'border-primary-500 shadow-sm ring-1 ring-primary-50' : 'border-gray-200'}`}>
                 <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                          <Smartphone size={20} />
                       </div>
                       <div>
                          <h4 className="font-bold text-gray-800">申领项目表单</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${appChannel?.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                             {appChannel?.status === 'active' ? '已开启' : '已关闭'}
                          </span>
                       </div>
                    </div>
                    <RenderSwitch 
                      active={appChannel?.status === 'active'} 
                      onClick={() => toggleChannelStatus('sys_app')} 
                    />
                 </div>
                 <p className="text-sm text-gray-500 mb-4 h-10">
                    开启后，内部员工可在“职工之家APP”的申领项目中直接应用此表单。
                 </p>
                 {appChannel?.status === 'active' && (
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                       <button onClick={() => copyLink('sys_app_entry')} className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1">
                          <Copy size={12} /> 复制链接
                       </button>
                       <span className="text-gray-300">|</span>
                       <button className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1">
                          <QrCode size={12} /> 二维码
                       </button>
                    </div>
                 )}
              </div>

              {/* Card 2: Public Channel */}
              <div className={`bg-white rounded-xl border p-5 transition-all ${publicChannel?.status === 'active' ? 'border-blue-500 shadow-sm ring-1 ring-blue-50' : 'border-gray-200'}`}>
                 <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Globe size={20} />
                       </div>
                       <div>
                          <h4 className="font-bold text-gray-800">调查问卷 (公共链接)</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${publicChannel?.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                             {publicChannel?.status === 'active' ? '已开启' : '已关闭'}
                          </span>
                       </div>
                    </div>
                    <RenderSwitch 
                      active={publicChannel?.status === 'active'} 
                      onClick={() => toggleChannelStatus('sys_public')} 
                    />
                 </div>
                 <p className="text-sm text-gray-500 mb-4 h-10">
                    开启后，生成对外的公共链接/二维码，用于广泛收集数据（非申领流程）。
                 </p>
                 {publicChannel?.status === 'active' && (
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                       <button onClick={() => copyLink('sys_public_link')} className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                          <Copy size={12} /> 复制链接
                       </button>
                       <span className="text-gray-300">|</span>
                       <button className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                          <QrCode size={12} /> 二维码
                       </button>
                    </div>
                 )}
              </div>

            </div>
          </div>

          {/* --- Section 2: Channel Management Table --- */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
             {/* Toolbar */}
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                   渠道管理列表
                </h3>
                <button 
                  onClick={openCreateModal}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                   <Plus size={16} /> 新建自定义渠道
                </button>
             </div>

             {/* Table */}
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                   <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                      <tr>
                         <th className="px-6 py-4 w-1/4">渠道名称</th>
                         <th className="px-6 py-4 w-1/6">统计标签 (Tag)</th>
                         <th className="px-6 py-4 w-1/4">推广入口</th>
                         <th className="px-6 py-4 w-1/6">填报数据</th>
                         <th className="px-6 py-4 w-1/12 text-center">状态</th>
                         <th className="px-6 py-4 w-1/12 text-right">操作</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {paginatedChannels.map((channel) => (
                         <tr key={channel.id} className="hover:bg-gray-50 transition-colors">
                            {/* Name Column */}
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  {channel.id === 'sys_app' ? (
                                    <Smartphone size={16} className="text-primary-600" />
                                  ) : channel.id === 'sys_public' ? (
                                    <Globe size={16} className="text-blue-600" />
                                  ) : (
                                    <Link size={16} className="text-gray-400" />
                                  )}
                                  
                                  <span className={`font-medium ${channel.isSystem ? 'text-gray-800' : 'text-gray-700'}`}>
                                     {channel.name}
                                  </span>
                                  {channel.isSystem && (
                                    <Lock size={12} className="text-gray-300" title="系统默认" />
                                  )}
                               </div>
                            </td>

                            {/* Tag Column */}
                            <td className="px-6 py-4">
                               <span className="bg-gray-50 text-gray-500 border border-gray-200 px-2 py-1 rounded text-xs font-mono">
                                  {channel.tag}
                               </span>
                            </td>

                            {/* Actions/Link Column */}
                            <td className="px-6 py-4">
                               {channel.status === 'active' ? (
                                  <div className="flex items-center gap-3">
                                     <div className="group relative">
                                        <QrCode size={18} className="text-gray-400 hover:text-gray-700 cursor-pointer" />
                                     </div>
                                     <button onClick={() => copyLink(channel.tag)} className="text-gray-400 hover:text-blue-600 transition-colors" title="复制链接">
                                       <Copy size={16} />
                                     </button>
                                     <button className="text-gray-400 hover:text-blue-600 transition-colors" title="下载二维码">
                                       <Download size={16} />
                                     </button>
                                  </div>
                               ) : (
                                  <span className="text-gray-300 text-xs italic">已关闭，不可访问</span>
                               )}
                            </td>

                            {/* Stats Column */}
                            <td className="px-6 py-4">
                               <button 
                                 onClick={() => handleDataClick(channel.tag, channel.name)}
                                 className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                               >
                                  {channel.submissions.toLocaleString()}
                               </button>
                            </td>

                            {/* Status Column */}
                            <td className="px-6 py-4 text-center flex justify-center">
                               <RenderSwitch 
                                 active={channel.status === 'active'} 
                                 onClick={() => toggleChannelStatus(channel.id)} 
                               />
                            </td>

                            {/* Operation Column */}
                            <td className="px-6 py-4 text-right">
                               {channel.isSystem ? (
                                  <span className="text-gray-300 text-xs select-none">-</span>
                               ) : (
                                  <div className="flex justify-end gap-3 text-gray-500">
                                     <button className="hover:text-blue-600 transition-colors" title="编辑"><Edit3 size={16} /></button>
                                     <button onClick={() => handleDeleteChannel(channel.id)} className="hover:text-red-600 transition-colors" title="删除"><Trash2 size={16} /></button>
                                  </div>
                               )}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             
             {/* Pagination */}
             <Pagination 
                totalItems={channels.length}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
             />
          </div>

        </div>
      </div>

      {/* --- Create Channel Modal --- */}
      {showAddModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
               <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-800">新建自定义渠道</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700"><Plus size={20} className="rotate-45" /></button>
               </div>
               
               <div className="p-6 space-y-5">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">渠道名称 <span className="text-red-500">*</span></label>
                     <input 
                       type="text" 
                       placeholder="如：食堂海报、一楼大厅" 
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                       value={newChannelName}
                       onChange={(e) => setNewChannelName(e.target.value)}
                       autoFocus
                     />
                  </div>
                  
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">统计标签 (Tag)</label>
                     <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 font-mono flex items-center gap-2">
                        <Lock size={12} className="text-gray-400" />
                        {generatedTag}
                     </div>
                     <p className="text-xs text-gray-400 mt-1">后端将自动生成唯一链接，用于区分数据来源。</p>
                  </div>
               </div>

               <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                  <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium">取消</button>
                  <button 
                    onClick={handleAddChannel}
                    disabled={!newChannelName}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    确定创建
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default PublishSettings;
