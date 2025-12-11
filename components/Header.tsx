import React from 'react';
import { Bell, Search, Menu, ChevronRight } from 'lucide-react';

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  currentTitle: string;
}

const Header: React.FC<HeaderProps> = ({ collapsed, setCollapsed, currentTitle }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm flex-shrink-0 z-10 relative">
      
      {/* Left: Toggle & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:flex items-center text-sm text-gray-500">
          <span className="hover:text-gray-800 cursor-pointer">首页</span>
          <ChevronRight size={14} className="mx-2" />
          <span className="font-medium text-gray-800">{currentTitle}</span>
        </div>
      </div>

      {/* Right: Search, Actions, Profile */}
      <div className="flex items-center gap-6">
        {/* Global Search */}
        <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-1.5 border border-gray-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all w-64">
          <Search size={16} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="搜索项目、单号或申请人..." 
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Notifications */}
        <div className="relative cursor-pointer">
          <Bell size={20} className="text-gray-600 hover:text-primary-600 transition-colors" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
            AD
          </div>
          <div className="hidden lg:block text-sm">
            <p className="font-medium text-gray-800">系统管理员</p>
            <p className="text-xs text-gray-500">政务服务中心</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;