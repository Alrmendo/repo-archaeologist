import { useEffect, useState } from 'react';
import { Minus, Square, Copy, X } from 'lucide-react';

export default function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    window.electronAPI.isWindowMaximized().then(setIsMaximized);
    return window.electronAPI.onWindowMaximizedChange(setIsMaximized);
  }, []);

  return (
    <div className="flex items-center gap-1 [-webkit-app-region:no-drag]">
      <button
        type="button"
        onClick={() => window.electronAPI.minimizeWindow()}
        className="h-9 w-9 flex items-center justify-center rounded-md text-[#a1a1aa] hover:bg-zinc-800 hover:text-[#fafafa] transition-colors cursor-pointer"
        id="window-minimize-btn"
        aria-label="Minimize"
      >
        <Minus className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => window.electronAPI.toggleMaximizeWindow()}
        className="h-9 w-9 flex items-center justify-center rounded-md text-[#a1a1aa] hover:bg-zinc-800 hover:text-[#fafafa] transition-colors cursor-pointer"
        id="window-maximize-btn"
        aria-label={isMaximized ? 'Restore' : 'Maximize'}
      >
        {isMaximized ? <Copy className="h-3.5 w-3.5 scale-x-[-1]" /> : <Square className="h-3.5 w-3.5" />}
      </button>
      <button
        type="button"
        onClick={() => window.electronAPI.closeWindow()}
        className="h-9 w-9 flex items-center justify-center rounded-md text-[#a1a1aa] hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
        id="window-close-btn"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
