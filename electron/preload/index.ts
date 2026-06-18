import { contextBridge, ipcRenderer } from 'electron';
import { AnalysisResult, ContributorOwnership, ExportReport, ExportResult } from '../../src/types';

const electronAPI = {
  ping: () => ipcRenderer.invoke('ping') as Promise<string>,
  openDirectoryDialog: () => ipcRenderer.invoke('dialog:openDirectory') as Promise<string | null>,
  analyzeRepository: (repoPath: string) =>
    ipcRenderer.invoke('repo:analyze', repoPath) as Promise<AnalysisResult>,
  getFileOwnership: (repoPath: string, filePath: string) =>
    ipcRenderer.invoke('repo:fileOwnership', repoPath, filePath) as Promise<ContributorOwnership[]>,
  exportReport: (defaultFileName: string, report: ExportReport) =>
    ipcRenderer.invoke('report:export', defaultFileName, report) as Promise<ExportResult>,
  minimizeWindow: () => ipcRenderer.invoke('window:minimize') as Promise<void>,
  toggleMaximizeWindow: () => ipcRenderer.invoke('window:toggleMaximize') as Promise<void>,
  closeWindow: () => ipcRenderer.invoke('window:close') as Promise<void>,
  isWindowMaximized: () => ipcRenderer.invoke('window:isMaximized') as Promise<boolean>,
  onWindowMaximizedChange: (callback: (isMaximized: boolean) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, isMaximized: boolean) => callback(isMaximized);
    ipcRenderer.on('window:maximized-changed', listener);
    return () => ipcRenderer.removeListener('window:maximized-changed', listener);
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electronAPI = electronAPI;
}

export type ElectronAPI = typeof electronAPI;
