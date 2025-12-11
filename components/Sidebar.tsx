
import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck,
  BrainCircuit,
  LayoutDashboard
} from 'lucide-react';
import { MenuItem } from '../types';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (id: string) => void;
  collapsed: boolean;
}

const MENU_STRUCTURE: MenuItem[] = [
  {
    id: 'dashboard',
    label: '工作台',
    icon: LayoutDashboard,
  },
  {
    id: 'custom-forms',
    label: '自定义表单',
    icon: FileText,
    children: [
      { id: 'form-mgmt', label: '表单管理' },
      { id: 'components-module', label: '组件模版' },
    ]
  },
  {
    id: 'claim-process',
    label: '申领项目管理',
    icon: Layers,
    children: [
      { id: 'project-templates', label: '项目模板中心' },
      { id: 'distribute-strategy', label: '发放策略配置' },
      { id: 'project-mgmt', label: '申报项目管理' },
      { id: 'ai-audit', label: 'AI 审核', isAiFeature: true },
      { id: 'user-feedback', label: '帮助与反馈' },
      { id: 'stats-analysis', label: '项目统计分析' },
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu, collapsed }) => {
  const [openMenus, setOpenMenus] = useState<string[]>(['custom-forms', 'claim-process']);

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <aside 
      className={`bg-white border-r border-gray-200 h-full flex flex-col flex-shrink-0 z-20 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2 text-primary-700 font-bold text-xl">
          <ShieldCheck size={28} />
          {!collapsed && <span>申领管理系统</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {MENU_STRUCTURE.map((menu) => (
            <li key={menu.id}>
              {menu.children ? (
                /* Group with Children */
                <>
                  <button
                    onClick={() => toggleMenu(menu.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-md transition-colors hover:bg-gray-50 text-gray-700 font-medium ${collapsed ? 'justify-center' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <menu.icon size={20} className="text-gray-500" />
                      {!collapsed && <span>{menu.label}</span>}
                    </div>
                    {!collapsed && (
                      openMenus.includes(menu.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    )}
                  </button>

                  {/* Level 2 Menu */}
                  {!collapsed && openMenus.includes(menu.id) && (
                    <ul className="mt-1 mb-2 ml-4 pl-3 border-l border-gray-200 space-y-1">
                      {menu.children.map((sub) => (
                        <li key={sub.id}>
                          <button
                            onClick={() => setActiveMenu(sub.id)}
                            className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-md text-sm transition-all ${
                              activeMenu === sub.id
                                ? 'bg-primary-50 text-primary-700 font-medium'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                               {sub.isAiFeature && <BrainCircuit size={14} className="text-purple-600" />}
                               {sub.label}
                            </span>
                            {activeMenu === sub.id && <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                /* Leaf Node (Level 1) */
                <button
                  onClick={() => setActiveMenu(menu.id)}
                  className={`w-full flex items-center p-3 rounded-md transition-colors font-medium ${
                    activeMenu === menu.id 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <menu.icon size={20} className={activeMenu === menu.id ? 'text-primary-600' : 'text-gray-500'} />
                    {!collapsed && <span>{menu.label}</span>}
                  </div>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
