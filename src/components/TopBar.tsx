import { useState } from 'react';
import { FolderOpen, Settings, AlertCircle, Terminal, Download, Loader2 } from 'lucide-react';
import { RepoStats } from '../types';
import WindowControls from './WindowControls';

interface TopBarProps {
  stats: RepoStats | null;
  onOpenRepoClick: () => void;
  onExportClick: () => void;
  isExporting: boolean;
  onPathInputClick: () => void;
}

export default function TopBar({ stats, onOpenRepoClick, onExportClick, isExporting, onPathInputClick }: TopBarProps) {
  const [showSettingsHint, setShowSettingsHint] = useState(false);

  return (
    <header className="relative z-20 h-16 border-b border-[#27272a] bg-[#09090b]/50 backdrop-blur-md flex items-center justify-between px-8 text-zinc-300 font-sans [-webkit-app-region:drag]">
      {/* Path Display in a Terminal style input box */}
      <div className="flex items-center gap-3 flex-1 max-w-xl [-webkit-app-region:no-drag]">
        <span className="text-xs font-semibold text-[#a1a1aa] font-mono tracking-wider flex items-center gap-1.5 shrink-0 bg-[#18181b] border border-[#27272a] px-2.5 py-1 rounded-md">
          <Terminal className="h-3 w-3 text-blue-400" />
          PATH
        </span>
        <div className="relative flex-1">
          <button
            type="button"
            onClick={onPathInputClick}
            title="Click to open a repository"
            className="w-full h-9 bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] rounded-md px-3 text-xs text-[#fafafa] font-mono text-left focus:outline-hidden cursor-pointer transition-colors truncate"
          >
            {stats ? (
              stats.path
            ) : (
              <span className="text-[#71717a] italic">Select local directory to analyze...</span>
            )}
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 ml-4 [-webkit-app-region:no-drag]">
        {stats && (
          <div className="hidden md:flex items-center gap-2 bg-blue-950/20 text-blue-400 border border-blue-900/40 px-2.5 py-1 rounded text-[11px] font-sans">
            <AlertCircle className="h-3.5 w-3.5" />
            Active session
          </div>
        )}

        {stats && (
          <button
            type="button"
            onClick={onExportClick}
            disabled={isExporting}
            className="h-9 px-4 bg-[#18181b] hover:bg-zinc-800 border border-[#27272a] text-[#fafafa] font-medium text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            id="export-report-btn"
          >
            {isExporting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            Export Report
          </button>
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

        <div className="relative">
          <button
            type="button"
            className="h-9 px-3 bg-[#18181b] hover:bg-zinc-800 rounded-md border border-[#27272a] transition-colors text-[#a1a1aa] flex items-center justify-center cursor-pointer"
            onClick={() => setShowSettingsHint((v) => !v)}
            id="settings-btn"
          >
            <Settings className="h-4 w-4" />
          </button>
          {showSettingsHint && (
            <div className="absolute right-0 top-11 z-10 w-56 bg-[#18181b] border border-[#27272a] rounded-md p-2.5 text-[10px] text-[#a1a1aa] shadow-xl font-sans">
              Settings not yet implemented — will open the native Electron preference sheet.
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-[#27272a] mx-1" />

        <WindowControls />
      </div>
    </header>
  );
}
