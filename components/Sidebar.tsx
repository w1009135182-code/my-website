import React from 'react';
import { LayoutDashboard, Users, Star, Bot } from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const menuItems = [
    { id: 'SMART_MATCHING', label: '智能匹配', icon: <Bot size={20} /> },
    { id: 'HOT_CREATORS', label: '热门达人', icon: <Users size={20} /> },
    { id: 'FAVORITES', label: '收藏达人', icon: <Star size={20} /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          AI
        </div>
        <span className="font-bold text-gray-800 text-lg">AI推荐达人</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as Page)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activePage === item.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-2">
          <img 
            src="https://picsum.photos/40/40?random=user" 
            alt="User" 
            className="w-8 h-8 rounded-full bg-gray-200"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">张建联</span>
            <span className="text-xs text-gray-500">BD 经理</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
