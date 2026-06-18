import { FolderOpen, Settings, AlertCircle, Terminal } from 'lucide-react';
import { RepoStats } from '../types';

interface TopBarProps {
  stats: RepoStats | null;
  onOpenRepoClick: () => void;
}

export default function TopBar({ stats, onOpenRepoClick }: TopBarProps) {
  return (
    <header className="h-16 border-b border-[#27272a] bg-[#09090b]/50 backdrop-blur-md flex items-center justify-between px-8 text-zinc-300 font-sans">
      {/* Path Display in a Terminal style input box */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <span className="text-xs font-semibold text-[#a1a1aa] font-mono tracking-wider flex items-center gap-1.5 shrink-0 bg-[#18181b] border border-[#27272a] px-2.5 py-1 rounded-md">
          <Terminal className="h-3 w-3 text-blue-400" />
          PATH
        </span>
        <div className="relative flex-1">
          <input
            type="text"
            readOnly
            value={stats ? stats.path : ''}
            placeholder="Select local directory to analyze..."
            className="w-full h-9 bg-[#18181b] border border-[#27272a] rounded-md px-3 text-xs text-[#fafafa] font-mono select-all focus:outline-hidden placeholder-[#71717a] placeholder:italic cursor-default"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 ml-4">
        {stats && (
          <div className="hidden md:flex items-center gap-2 bg-blue-950/20 text-blue-400 border border-blue-900/40 px-2.5 py-1 rounded text-[11px] font-sans">
            <AlertCircle className="h-3.5 w-3.5" />
            Active session
          </div>
        )}

        <button
          type="button"
          onClick={onOpenRepoClick}
          className="h-9 px-4 bg-[#fafafa] hover:bg-[#e4e4e7] text-[#09090b] font-medium text-xs rounded-md transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          id="open-repo-topbar-btn"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          Open Repository
        </button>

        <button
          type="button"
          className="h-9 px-3 bg-[#18181b] hover:bg-zinc-800 rounded-md border border-[#27272a] transition-colors text-[#a1a1aa] flex items-center justify-center cursor-pointer"
          onClick={() => alert("Settings configuration triggers standard Electron native preference sheet.")}
          id="settings-btn"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
