import { Binary, Home, Flame, Cpu } from 'lucide-react';
import { RepoStats } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: RepoStats | null;
}

export default function Sidebar({ activeTab, setActiveTab, stats }: SidebarProps) {
  const navItems = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'hotspots', name: 'Hotspots', icon: Flame },
    { id: 'knowledge', name: 'Knowledge & Coupling', icon: Cpu },
  ];

  return (
    <div className="w-64 bg-[#09090b] border-r border-[#27272a] flex flex-col h-full text-[#a1a1aa] font-sans">
      {/* App Branding */}
      <div className="p-6 border-b border-[#27272a] bg-[#09090b] [-webkit-app-region:drag]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm shadow-blue-500/20">
            RA
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-[#fafafa] font-sans italic">
              Repo Archaeologist
            </h1>
            <p className="text-[10px] font-mono text-[#71717a] tracking-wider">
              SW ARCHAEOLOGY V1.0
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="text-[10px] font-bold text-[#52525b] px-3 py-1.5 uppercase tracking-wider">
          Analysis
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left cursor-pointer ${
                isActive
                  ? 'bg-[#18181b] border border-[#27272a] text-[#fafafa]'
                  : 'text-[#a1a1aa] hover:bg-[#18181b]/65 hover:text-[#fafafa] border border-transparent'
              }`}
              id={`nav-${item.id}`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-blue-500' : 'text-[#71717a]'}`} />
              <span className="font-sans">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Repository Status Indicator */}
      <div className="p-4 border-t border-[#27272a] bg-[#09090b]/50 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#52525b]">
          <span className={`h-1.5 w-1.5 rounded-full ${stats ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
          Repository Connection
        </div>
        {stats ? (
          <div className="p-2.5 bg-[#18181b] rounded-md border border-[#27272a] text-[11px] space-y-1">
            <div className="font-semibold text-[#fafafa] font-mono truncate">{stats.name}</div>
            <div className="text-[9px] text-[#71717a] truncate font-mono">{stats.path}</div>
          </div>
        ) : (
          <div className="p-2.5 bg-[#18181b]/40 rounded-md border border-dashed border-[#27272a] text-center text-[10px] text-[#52525b] font-sans">
            No repo connected
          </div>
        )}
      </div>
    </div>
  );
}
