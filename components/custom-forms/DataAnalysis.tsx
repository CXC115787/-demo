
import React, { useState, useEffect } from 'react';
import { 
  Download, Search, Trash2, Edit, Calendar, 
  ChevronDown, ArrowLeft, Filter, RefreshCw,
  PieChart as PieChartIcon, Activity, Clock, Users,
  Printer, Share2, X, Eye, FileText
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { SubmissionData } from '../../types';
import Pagination from '../Pagination';

// --- Mock Data: Submission List ---
const MOCK_DATA: SubmissionData[] = [
  { 
    id: 'S20231024001', 
    formName: '秋季助学金申请表', 
    channelName: '申领项目表单 (App)', 
    submitTime: '2023-10-24 14:30', 
    formData: { 
      '姓名': '王晓明', '性别': '男', '学院': '计算机学院', '申请类型': '一等助学金', '申请金额': '5,000', '备注': '家庭经济困难，需申请补助' 
    } 
  },
  { 
    id: 'S20231024002', 
    formName: '秋季助学金申请表', 
    channelName: 'A栋大厅海报', 
    submitTime: '2023-10-24 14:45', 
    formData: { 
      '姓名': '李芸', '性别': '女', '学院': '经管学院', '申请类型': '二等助学金', '申请金额': '3,000', '备注': '单亲家庭' 
    } 
  },
  { 
    id: 'S20231024003', 
    formName: '秋季助学金申请表', 
    channelName: '食堂宣传单', 
    submitTime: '2023-10-24 15:10', 
    formData: { 
      '姓名': '张伟', '性别': '男', '学院': '机械学院', '申请类型': '三等助学金', '申请金额': '2,000', '备注': '' 
    } 
  },
  { 
    id: 'S20231024004', 
    formName: '秋季助学金申请表', 
    channelName: '申领项目表单 (App)', 
    submitTime: '2023-10-24 16:00', 
    formData: { 
      '姓名': '赵丽', '性别': '女', '学院': '外语学院', '申请类型': '一等助学金', '申请金额': '5,000', '备注': '建档立卡户' 
    } 
  },
  { 
    id: 'S20231024005', 
    formName: '秋季助学金申请表', 
    channelName: '线下录入', 
    submitTime: '2023-10-24 16:20', 
    formData: { 
      '姓名': '孙强', '性别': '男', '学院': '体育学院', '申请类型': '临时困难补助', '申请金额': '1,000', '备注': '突发疾病' 
    } 
  },
  { 
    id: 'S20231025001', 
    formName: '秋季助学金申请表', 
    channelName: '调查问卷 (公共链接)', 
    submitTime: '2023-10-25 09:10', 
    formData: { 
      '姓名': '陈静', '性别': '女', '学院': '艺术学院', '申请类型': '二等助学金', '申请金额': '3,000', '备注': '' 
    } 
  },
];

// --- Mock Data: New Analysis Stats ---
const ANALYSIS_METRICS = {
  recovery: 1205,      // 回收量
  views: 3580,         // 浏览量
  avgTime: '3分24秒',  // 平均填写时长
  completionRate: '33.6%' // 完成率
};

// Trend Data (Line/Area Chart)
const TREND_DATA = [
  { date: '11-01', value: 12 },
  { date: '11-03', value: 18 },
  { date: '11-05', value: 8 },
  { date: '11-07', value: 25 },
  { date: '11-09', value: 14 },
  { date: '11-11', value: 32 },
  { date: '11-13', value: 20 },
  { date: '11-15', value: 45 },
  { date: '11-17', value: 28 },
  { date: '11-19', value: 50 },
  { date: '11-21', value: 35 },
  { date: '11-23', value: 15 },
  { date: '11-25', value: 42 },
  { date: '11-27', value: 24 },
  { date: '11-29', value: 38 },
];

// 1. Geography Data (Simulated for Bar Chart)
const GEO_DATA = [
  { name: '北京', value: 420 },
  { name: '上海', value: 310 },
  { name: '广东', value: 280 },
  { name: '江苏', value: 150 },
  { name: '浙江', value: 45 },
];

// 2. Device Data
const DEVICE_DATA = [
  { name: '桌面设备', value: 93 },
  { name: '移动设备', value: 7 },
];

// 3. OS Data
const OS_DATA = [
  { name: 'Windows', value: 84 },
  { name: 'Mac OS', value: 3 },
  { name: 'Android', value: 6 },
  { name: 'iOS', value: 1 },
  { name: '其他', value: 6 },
];

// 4. Channel Data
const CHANNEL_DATA = [
  { name: '其他', value: 59 },
  { name: '微信', value: 41 },
];

const COLORS = ['#3b82f6', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899', '#f43f5e'];
const COLORS_DEVICE = ['#2563eb', '#60a5fa']; // Dark blue, Light blue
const COLORS_OS = ['#38bdf8', '#c084fc', '#f472b6', '#34d399', '#fbbf24']; // Various

interface DataAnalysisProps {
  formId?: string;
  formTitle?: string;
}

const DataAnalysis: React.FC<DataAnalysisProps> = ({ formId, formTitle }) => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'list' | 'analysis'>('list');
  const [data, setData] = useState<SubmissionData[]>(MOCK_DATA);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [filterChannel, setFilterChannel] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Extract dynamic headers from the first data item
  const dynamicHeaders = data.length > 0 ? Object.keys(data[0].formData) : [];

  // --- Filter Logic ---
  const filteredData = data.filter(item => {
    if (filterChannel && item.channelName !== filterChannel) return false;
    return true;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filterChannel]);

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const uniqueChannels = Array.from(new Set(MOCK_DATA.map(d => d.channelName)));

  // --- Handlers ---
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageIds = paginatedData.map(d => d.id);
      setSelectedRowKeys(prev => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedData.map(d => d.id);
      setSelectedRowKeys(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };
  
  const isAllVisibleSelected = paginatedData.length > 0 && paginatedData.every(d => selectedRowKeys.includes(d.id));

  const handleSelectRow = (id: string) => {
    setSelectedRowKeys(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]);
  };

  const handleBatchDelete = () => {
    if (confirm(`确定要删除选中的 ${selectedRowKeys.length} 条数据吗？`)) {
      setData(prev => prev.filter(d => !selectedRowKeys.includes(d.id)));
      setSelectedRowKeys([]);
    }
  };

  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  // --- Sub-components for Analysis ---
  const MetricCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in-up font-sans">
      
      {/* 1. View Switcher Header (Card Style) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
         <div className="flex gap-6">
            <button 
              onClick={() => setActiveTab('list')}
              className={`text-sm font-medium transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg ${activeTab === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <FileText size={16} /> 数据明细
            </button>
            <button 
              onClick={() => setActiveTab('analysis')}
              className={`text-sm font-medium transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg ${activeTab === 'analysis' ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <Activity size={16} /> 统计分析
            </button>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 font-medium">
               表单：{formTitle || '未命名表单'}
            </div>
            {activeTab === 'analysis' && (
               <button 
                 onClick={handleGenerateReport}
                 className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50 hover:text-primary-600 hover:border-primary-200 transition-colors shadow-sm"
               >
                  <Printer size={14} /> 生成报告
               </button>
            )}
         </div>
      </div>

      {/* 2. Main Content Area - No internal scrolling, let App shell scroll */}
      <div>
        
        {/* --- View: Data List --- */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
               <div className="flex flex-wrap gap-3 w-full md:w-auto">
                 <div className="relative">
                    <select 
                      className="appearance-none pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-primary-300 cursor-pointer min-w-[160px]"
                      value={filterChannel}
                      onChange={(e) => setFilterChannel(e.target.value)}
                    >
                      <option value="">所有来源渠道</option>
                      {uniqueChannels.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                 </div>

                 {/* Date Range Picker (Ant Design Style) */}
                 <div className="group flex items-center bg-white border border-gray-200 hover:border-blue-400 rounded-lg px-3 h-[38px] w-64 transition-all focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 shadow-sm">
                   <div className="relative flex-1 min-w-0">
                     <input type="text" placeholder="开始日期" className="w-full text-sm outline-none text-gray-600 placeholder-gray-400 bg-transparent text-center cursor-pointer font-sans" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }} />
                   </div>
                   <span className="text-gray-300 mx-2">~</span>
                   <div className="relative flex-1 min-w-0">
                     <input type="text" placeholder="结束日期" className="w-full text-sm outline-none text-gray-600 placeholder-gray-400 bg-transparent text-center cursor-pointer font-sans" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }} />
                   </div>
                   <Calendar size={14} className="text-gray-400 ml-1 flex-shrink-0 group-hover:text-gray-500" />
                 </div>
                 
                 <div className="relative flex-1 min-w-[200px]">
                    <input type="text" placeholder="搜索提交内容..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-300 bg-gray-50 focus:bg-white" />
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 </div>
               </div>

               <div className="flex gap-2">
                 {selectedRowKeys.length > 0 ? (
                   <div className="flex items-center gap-2 animate-fade-in bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                      <span className="text-sm text-blue-700 font-medium mr-2">已选 {selectedRowKeys.length} 项</span>
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-white text-blue-600 border border-blue-200 rounded text-sm hover:bg-blue-50">
                        <Download size={14} /> 导出
                      </button>
                      <button onClick={handleBatchDelete} className="flex items-center gap-1 px-3 py-1.5 bg-white text-red-600 border border-red-200 rounded text-sm hover:bg-red-50">
                        <Trash2 size={14} /> 删除
                      </button>
                   </div>
                 ) : (
                   <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm flex items-center gap-2 shadow-sm">
                     <Download size={16} /> 导出全部
                   </button>
                 )}
               </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-4 w-12 text-center sticky left-0 z-20 bg-gray-50"><input type="checkbox" className="rounded text-primary-600 cursor-pointer" checked={isAllVisibleSelected} onChange={handleSelectAll} /></th>
                      <th className="px-4 py-4">提交单号</th>
                      {dynamicHeaders.map(header => <th key={header} className="px-4 py-4 text-gray-800">{header}</th>)}
                      <th className="px-4 py-4">来源渠道</th>
                      <th className="px-4 py-4">提交时间</th>
                      <th className="px-4 py-4 text-right sticky right-0 z-20 bg-gray-50">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedData.length > 0 ? paginatedData.map((row) => (
                      <tr key={row.id} className={`group hover:bg-gray-50 transition-colors ${selectedRowKeys.includes(row.id) ? 'bg-blue-50' : ''}`}>
                         <td className={`px-4 py-4 text-center sticky left-0 z-10 ${selectedRowKeys.includes(row.id) ? 'bg-blue-50' : 'bg-white'} group-hover:bg-gray-50`}><input type="checkbox" className="rounded text-primary-600 cursor-pointer" checked={selectedRowKeys.includes(row.id)} onChange={() => handleSelectRow(row.id)} /></td>
                         <td className="px-4 py-4 font-mono text-gray-500 text-xs">{row.id}</td>
                         {dynamicHeaders.map(header => <td key={header} className="px-4 py-4 text-gray-700">{row.formData[header] || '-'}</td>)}
                         <td className="px-4 py-4"><span className="bg-gray-100 text-gray-600 border border-gray-200 px-2 py-1 rounded text-xs">{row.channelName}</span></td>
                         <td className="px-4 py-4 text-gray-500 text-xs">{row.submitTime}</td>
                         <td className={`px-4 py-4 text-right sticky right-0 z-10 ${selectedRowKeys.includes(row.id) ? 'bg-blue-50' : 'bg-white'} group-hover:bg-gray-50`}>
                           <div className="flex justify-end gap-2">
                              <button className="text-gray-500 hover:text-blue-600 p-1.5 hover:bg-blue-100 rounded" title="查看"><Edit size={16} /></button>
                              <button onClick={() => setData(prev => prev.filter(d => d.id !== row.id))} className="text-gray-500 hover:text-red-600 p-1.5 hover:bg-red-100 rounded" title="删除"><Trash2 size={16} /></button>
                           </div>
                         </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={10} className="px-6 py-12 text-center text-gray-400">暂无数据</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination totalItems={filteredData.length} pageSize={pageSize} currentPage={currentPage} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
            </div>
          </div>
        )}

        {/* --- View: Analysis Dashboard --- */}
        {activeTab === 'analysis' && (
          <div className="space-y-6 animate-fade-in pb-10">
             {/* 1. Metrics Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="回收量" value={ANALYSIS_METRICS.recovery} icon={FileText} color="bg-blue-50 text-blue-600" />
                <MetricCard title="浏览量" value={ANALYSIS_METRICS.views} icon={Eye} color="bg-green-50 text-green-600" />
                <MetricCard title="平均填写时长" value={ANALYSIS_METRICS.avgTime} icon={Clock} color="bg-purple-50 text-purple-600" />
                <MetricCard title="表单完成率" value={ANALYSIS_METRICS.completionRate} icon={Activity} color="bg-orange-50 text-orange-600" />
             </div>

             {/* 2. Trend Chart (Recovery Trend) */}
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-gray-800 text-lg">回收趋势</h3>
                </div>
                <div className="h-72 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={TREND_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                         <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                               <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                         <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                         <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                         <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                         />
                         <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* 3. Distribution Charts Grid (4 Columns) */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Geo Location - Bar Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                   <h3 className="font-bold text-gray-800 mb-6">地域位置</h3>
                   <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={GEO_DATA} layout="vertical" margin={{top: 0, right: 30, left: 10, bottom: 0}}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={40} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                            <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={16}>
                               {GEO_DATA.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                               ))}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="flex justify-between text-xs text-gray-500 px-2 mt-2">
                       <span>{GEO_DATA[0].name}</span>
                       <span>Top 1</span>
                   </div>
                </div>

                {/* Common Devices - Donut Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                   <h3 className="font-bold text-gray-800 mb-6">常用设备</h3>
                   <div className="h-64 relative">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                              data={DEVICE_DATA}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {DEVICE_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS_DEVICE[index % COLORS_DEVICE.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                         </PieChart>
                      </ResponsiveContainer>
                      {/* Center Label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-bold text-primary-600">93%</span>
                          <span className="text-xs text-gray-400">桌面端</span>
                      </div>
                   </div>
                   <div className="flex justify-center gap-4 text-xs mt-2">
                      <div className="flex items-center gap-1 text-gray-600"><div className="w-2 h-2 rounded-full bg-blue-600"></div>桌面设备</div>
                      <div className="flex items-center gap-1 text-gray-600"><div className="w-2 h-2 rounded-full bg-blue-300"></div>移动设备</div>
                   </div>
                </div>

                {/* Common OS - Donut Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                   <h3 className="font-bold text-gray-800 mb-6">常用系统</h3>
                   <div className="h-64 relative">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                              data={OS_DATA}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {OS_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS_OS[index % COLORS_OS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-[10px] mt-2 text-gray-500">
                      {OS_DATA.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                           <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: COLORS_OS[idx % COLORS_OS.length]}}></div>
                           {item.name}
                        </div>
                      ))}
                   </div>
                </div>

                {/* Channel Source - Donut Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                   <h3 className="font-bold text-gray-800 mb-6">渠道来源</h3>
                   <div className="h-64 relative">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                              data={CHANNEL_DATA}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {CHANNEL_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#38bdf8' : '#2563eb'} />
                              ))}
                            </Pie>
                            <Tooltip />
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="flex justify-center gap-6 text-xs mt-2">
                      <div className="flex items-center gap-1 text-gray-600">
                         <div className="w-2 h-2 rounded-full bg-blue-400"></div>其他 {CHANNEL_DATA[0].value}%
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                         <div className="w-2 h-2 rounded-full bg-blue-700"></div>微信 {CHANNEL_DATA[1].value}%
                      </div>
                   </div>
                </div>

             </div>
          </div>
        )}

      </div>

      {/* --- 3. Report Modal --- */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                 <h3 className="font-bold text-gray-800 flex items-center gap-2"><PieChartIcon size={18} /> 分析报告预览</h3>
                 <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                 <div className="bg-white shadow-sm p-8 min-h-[600px] rounded-sm" id="report-content">
                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">{formTitle} - 数据结项报告</h1>
                    <p className="text-center text-gray-500 text-sm mb-8">生成时间：{new Date().toLocaleDateString()}</p>
                    
                    <div className="mb-8">
                       <h2 className="text-lg font-bold text-gray-800 border-l-4 border-primary-600 pl-3 mb-4">一、数据概览</h2>
                       <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="p-3 bg-gray-50 rounded">总回收量：<span className="font-bold">{ANALYSIS_METRICS.recovery}</span></div>
                          <div className="p-3 bg-gray-50 rounded">完成率：<span className="font-bold">{ANALYSIS_METRICS.completionRate}</span></div>
                       </div>
                    </div>

                    <div className="mb-8">
                       <h2 className="text-lg font-bold text-gray-800 border-l-4 border-primary-600 pl-3 mb-4">二、主要结论</h2>
                       <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
                          <li>访问量达到 <span className="font-bold">{ANALYSIS_METRICS.views}</span>，实际回收 <span className="font-bold">{ANALYSIS_METRICS.recovery}</span>。</li>
                          <li>绝大多数用户（93%）使用<span className="font-bold text-primary-700">桌面端</span>访问，建议优化PC端展示体验。</li>
                          <li>地域分布上，<span className="font-bold">北京</span>地区参与度最高。</li>
                       </ul>
                    </div>
                 </div>
              </div>
              <div className="px-6 py-4 bg-white border-t border-gray-100 rounded-b-xl flex justify-end gap-3">
                 <button onClick={() => setShowReportModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">取消</button>
                 <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 shadow-sm"><Printer size={16} /> 打印</button>
                 <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-primary-700 shadow-sm"><Download size={16} /> 导出 PDF</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DataAnalysis;
