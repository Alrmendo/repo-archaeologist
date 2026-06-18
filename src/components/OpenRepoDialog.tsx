import { useState } from 'react';
import { FolderOpen, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { MOCK_REPOS } from '../mockData';

interface OpenRepoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRepo: (repoKey: string | null) => void;
  currentRepoKey: string | null;
}

export default function OpenRepoDialog({ isOpen, onClose, onSelectRepo, currentRepoKey }: OpenRepoDialogProps) {
  const [typedPath, setTypedPath] = useState(
    currentRepoKey ? MOCK_REPOS[currentRepoKey]?.stats.path : '/Users/developer/projects/'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div 
        className="w-full max-w-md bg-[#09090b] border border-[#27272a] rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        id="open-repo-dialog"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#27272a]/60 flex justify-between items-center bg-[#09090b]">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4.5 w-4.5 text-blue-500" />
            <h2 className="text-sm font-semibold text-[#fafafa] font-sans">Open Git Repository</h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-[#71717a] hover:text-[#fafafa] text-xs transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#a1a1aa]">Local Repository Path</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="/path/to/git-repository"
                value={typedPath}
                onChange={(e) => setTypedPath(e.target.value)}
                className="flex-1 h-9 bg-[#18181b] border border-[#27272a] rounded-md px-3 text-xs text-[#fafafa] focus:outline-hidden focus:border-[#3f3f46] font-mono"
              />
              <button
                type="button"
                className="h-9 px-3 bg-[#18181b] border border-[#27272a] text-[#fafafa] hover:bg-zinc-800 rounded-md text-xs transition-colors font-sans flex items-center gap-1.5 cursor-pointer"
                onClick={() => alert("As a browser preview, local filesystem selectors are placeholder-only. Please use the simulated repositories below to load interactive data!")}
                id="browse-btn"
              >
                Browse...
              </button>
            </div>
            <p className="text-[10px] text-[#71717a] flex items-center gap-1 font-sans">
              <AlertCircle className="h-3 w-3 text-amber-500" />
              Desktop native folder selection dialog (Electron) will bridge here.
            </p>
          </div>

          <div className="pt-4 border-t border-[#27272a]/60">
            <p className="text-xs font-semibold text-[#a1a1aa] mb-2.5 font-sans flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              Simulate Repository Analysis
            </p>
            <div className="grid grid-cols-1 gap-2">
              {Object.keys(MOCK_REPOS).map((key) => {
                const repo = MOCK_REPOS[key];
                const isSelected = currentRepoKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onSelectRepo(key);
                      setTypedPath(repo.stats.path);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-3 rounded-lg text-left transition-all text-xs border cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-950/20 border-blue-800 text-blue-400 font-semibold' 
                        : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:bg-zinc-800/50 hover:text-[#fafafa]'
                    }`}
                  >
                    <div>
                      <div className={`font-mono ${isSelected ? 'text-[#fafafa]' : 'text-[#a1a1aa]'}`}>{repo.stats.name}</div>
                      <div className="text-[10px] text-[#71717a] mt-0.5">{repo.stats.path}</div>
                    </div>
                    <span className="text-[10px] bg-[#09090b] border border-[#27272a] text-[#a1a1aa] px-2.5 py-0.5 rounded-full font-mono">
                      {repo.stats.totalCommits} commits
                    </span>
                  </button>
                );
              })}

              {currentRepoKey && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectRepo(null);
                    setTypedPath('/Users/developer/projects/');
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs bg-transparent hover:bg-red-950/10 hover:border-red-900 border border-[#27272a] hover:text-red-400 text-[#71717a] transition-all font-sans font-medium cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5 animate-spin-reverse" />
                  Reset to empty/unloaded state
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#09090b] border-t border-[#27272a]/60 flex justify-end gap-2 text-xs font-sans">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
