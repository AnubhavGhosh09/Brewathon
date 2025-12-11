import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, Calendar, Users, Calculator, Sparkles, LogOut, ShoppingCart, Terminal } from 'lucide-react';

interface NavBarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentView, setView, onLogout }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Mainframe', icon: LayoutDashboard },
    { id: AppView.TIMETABLE, label: 'Temporal Grid', icon: Calendar },
    { id: AppView.CLUBS, label: 'Factions', icon: Users },
    { id: AppView.ATTENDANCE, label: 'Survival Metrics', icon: Calculator },
    { id: AppView.MARKETPLACE, label: 'Black Market', icon: ShoppingCart },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-green-500/20 px-4 py-3 mb-6 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
            <Terminal className="text-green-500" size={20} />
          </div>
          <div className="hidden md:block">
            <h1 className="font-bold text-lg leading-none tracking-tight text-white font-mono">
              SYSTEM<span className="text-green-500">_ROOT</span>
            </h1>
            <span className="text-[10px] text-green-500/70 font-mono tracking-widest uppercase">v2.5.0 // Online</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-black/60 p-1 rounded-full border border-white/5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 font-mono ${
                  isActive 
                    ? 'bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] border border-green-500/30' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                {item.label}
              </button>
            );
          })}
           <button
                onClick={() => setView(AppView.AI_TOOLS)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 font-mono ${
                  currentView === AppView.AI_TOOLS
                    ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] border border-purple-500/30' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles size={14} />
                AI_Core
              </button>
        </div>

        <button 
          onClick={onLogout}
          className="p-2 text-slate-500 hover:text-red-500 transition-colors border border-transparent hover:border-red-900/30 rounded-lg hover:bg-red-900/10"
          title="Disconnect System"
        >
          <LogOut size={20} />
        </button>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden flex justify-around mt-4 pt-3 border-t border-white/5 overflow-x-auto scrollbar-hide">
         {navItems.map((item) => {
             const Icon = item.icon;
             return (
                 <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`p-3 rounded-lg transition-all ${currentView === item.id ? 'text-green-400 bg-green-900/20 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'text-slate-600'}`}
                 >
                     <Icon size={20} />
                 </button>
             )
         })}
         <button
            onClick={() => setView(AppView.AI_TOOLS)}
            className={`p-3 rounded-lg ${currentView === AppView.AI_TOOLS ? 'text-purple-400 bg-purple-900/20' : 'text-slate-600'}`}
         >
            <Sparkles size={20} />
         </button>
      </div>
    </nav>
  );
};

export default NavBar;