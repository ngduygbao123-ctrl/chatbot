import React from 'react';
import { ShoppingBag, MessageSquare, LayoutDashboard, Sparkles, Headphones } from 'lucide-react';
import { BotConfig } from '../types';

interface NavbarProps {
  currentView: 'store' | 'chat' | 'admin';
  onSelectView: (view: 'store' | 'chat' | 'admin') => void;
  botConfig: BotConfig;
  pendingTicketsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  botConfig,
  pendingTicketsCount,
}) => {
  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* App Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-black shadow-md">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-white">
                {botConfig.botName}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                AI CSKH 24/7
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Trợ lý chăm sóc khách hàng thông minh đa năng
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-700/60">
          <button
            onClick={() => onSelectView('store')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
              currentView === 'store'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Trang Demo Khách Hàng</span>
          </button>

          <button
            onClick={() => onSelectView('chat')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
              currentView === 'chat'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Đầy Đủ</span>
          </button>

          <button
            onClick={() => onSelectView('admin')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
              currentView === 'admin'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Bảng Quản Trị CSKH</span>
            {pendingTicketsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingTicketsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
