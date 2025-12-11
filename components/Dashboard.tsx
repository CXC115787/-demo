import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BrainCircuit,
  MoreHorizontal
} from 'lucide-react';
import { DashboardStat, PendingTask } from '../types';

// --- Mock Data ---
const STATS: DashboardStat[] = [
  { title: "今日申报总数", value: "248", change: "+12.5%", trend: "up", icon: FileText },
  { title: "待办审核任务", value: "45", change: "-5.0%", trend: "down", icon: AlertCircle },
  { title: "累计发放金额(万元)", value: "8,920", change: "+2.1%", trend: "up", icon: TrendingUp },
  { title: "AI 智能拦截异常", value: "12", change: "+8.3%", trend: "up", icon: BrainCircuit },
];

const TREND_DATA = [
  { name: '周一', 申请: 120, 审核: 110 },
  { name: '周二', 申请: 132, 审核: 125 },
  { name: '周三', 申请: 101, 审核: 98 },
  { name: '周四', 申请: 134, 审核: 130 },
  { name: '周五', 申请: 190, 审核: 170 },
  { name: '周六', 申请: 230, 审核: 210 },
  { name: '周日', 申请: 210, 审核: 200 },
];

const PIE_DATA = [
  { name: '助学类', value: 400 },
  { name: '大病救助', value: 300 },
  { name: '物资发放', value: 300 },
  { name: '综合帮扶', value: 200 },
];

const COLORS = ['#b91c1c', '#ea580c', '#f59e0b', '#64748b'];

const PENDING_TASKS: PendingTask[] = [
  { id: 'T-2024001', project: '秋季助学金申请', applicant: '张三', amount: '5,000', date: '2023-10-24 10:30', status: 'pending', aiRiskScore: 12 },
  { id: 'T-2024002', project: '临时医疗救助', applicant: '李四', amount: '2,000', date: '2023-10-24 11:15', status: 'pending', aiRiskScore: 88 },
  { id: 'T-2024003', project: '困难家庭物资包', applicant: '王五', amount: '800', date: '2023-10-24 14:20', status: 'reviewing', aiRiskScore: 5 },
  { id: 'T-2024004', project: '创业补贴申请', applicant: '赵六', amount: '10,000', date: '2023-10-24 15:45', status: 'pending', aiRiskScore: 45 },
  { id: 'T-2024005', project: '高龄津贴', applicant: '孙七', amount: '300', date: '2023-10-24 16:00', status: 'reviewing', aiRiskScore: 2 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 rounded-xl p-6 text-white shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">欢迎回来，管理员</h1>
          <p className="text-primary-100 opacity-90">今日系统运行平稳，共有 45 条待审核任务需要处理。</p>
        </div>
        <button className="bg-white text-primary-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm text-sm">
          前往审核中心
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${
                stat.icon === BrainCircuit ? 'bg-purple-50 text-purple-600' : 'bg-primary-50 text-primary-600'
              }`}>
                <stat.icon size={22} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 text-lg">近7日申领趋势</h3>
            <select className="bg-gray-50 border-none text-sm text-gray-600 rounded-md px-3 py-1 outline-none cursor-pointer">
              <option>本周</option>
              <option>上周</option>
              <option>本月</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="申请" stroke="#b91c1c" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="审核" stroke="#fca5a5" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg mb-6">申领项目类型分布</h3>
          <div className="h-60 w-full flex justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
             {PIE_DATA.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">待办审核任务</h3>
          <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">查看全部</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 bg-gray-50 font-medium">
              <tr>
                <th className="px-6 py-4">单号</th>
                <th className="px-6 py-4">项目名称</th>
                <th className="px-6 py-4">申请人</th>
                <th className="px-6 py-4">金额(元)</th>
                <th className="px-6 py-4">提交时间</th>
                <th className="px-6 py-4">AI 风险评估</th>
                <th className="px-6 py-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PENDING_TASKS.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-600">{task.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{task.project}</td>
                  <td className="px-6 py-4 text-gray-600">{task.applicant}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{task.amount}</td>
                  <td className="px-6 py-4 text-gray-500">{task.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${task.aiRiskScore > 80 ? 'bg-red-500' : task.aiRiskScore > 40 ? 'bg-yellow-400' : 'bg-green-500'}`} 
                          style={{ width: `${task.aiRiskScore}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${task.aiRiskScore > 80 ? 'text-red-600' : 'text-gray-500'}`}>
                        {task.aiRiskScore > 80 ? '高风险' : '正常'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-primary-600 hover:text-primary-800 font-medium px-3 py-1 rounded hover:bg-primary-50 transition-colors">审核</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;