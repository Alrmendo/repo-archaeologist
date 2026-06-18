import { useState } from 'react';
import { FolderOpen, AlertCircle, Loader2 } from 'lucide-react';

interface OpenRepoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRepo: (repoPath: string) => void;
  isAnalyzing: boolean;
  error: string | null;
}

export default function OpenRepoDialog({ isOpen, onClose, onOpenRepo, isAnalyzing, error }: OpenRepoDialogProps) {
  const [typedPath, setTypedPath] = useState('');

  if (!isOpen) return null;

  const handleBrowse = async () => {
    const picked = await window.electronAPI.openDirectoryDialog();
    if (picked) setTypedPath(picked);
  };

  const handleOpen = () => {
    if (typedPath.trim() && !isAnalyzing) onOpenRepo(typedPath.trim());
  };

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
                disabled={isAnalyzing}
                className="flex-1 h-9 bg-[#18181b] border border-[#27272a] rounded-md px-3 text-xs text-[#fafafa] focus:outline-hidden focus:border-[#3f3f46] font-mono disabled:opacity-50"
              />
              <button
                type="button"
                className="h-9 px-3 bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:bg-zinc-800 rounded-md text-xs transition-colors font-sans flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleBrowse}
                disabled={isAnalyzing}
                id="browse-btn"
              >
                Browse...
              </button>
            </div>
            {error && (
              <p className="text-[10px] text-red-400 flex items-center gap-1 font-sans">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#09090b] border-t border-[#27272a]/60 flex justify-end gap-2 text-xs font-sans">
          <button
            type="button"
            onClick={onClose}
            disabled={isAnalyzing}
            className="px-4 py-1.5 text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleOpen}
            disabled={!typedPath.trim() || isAnalyzing}
            className="px-4 py-1.5 bg-[#fafafa] hover:bg-[#e4e4e7] text-[#09090b] font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            id="open-btn"
          >
            {isAnalyzing && <Loader2 className="h-3 w-3 animate-spin" />}
            Open
          </button>
        </div>
      </div>
    </div>
  );
}
