import { app, BrowserWindow, dialog, ipcMain, Menu, nativeImage, Tray } from 'electron';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { analyzeRepository, getFileOwnership } from './gitAnalysis';
import { ExportReport, ExportResult } from '../../src/types';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const iconPath = join(__dirname, '../../resources/icon.png');

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    resizable: true,
    show: false,
    frame: false,
    icon: iconPath,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('maximize', () => mainWindow?.webContents.send('window:maximized-changed', true));
  mainWindow.on('unmaximize', () => mainWindow?.webContents.send('window:maximized-changed', false));

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

function createTray(): void {
  tray = new Tray(nativeImage.createFromPath(iconPath));
  tray.setToolTip('Repo Archaeologist');

  const focusWindow = () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  };

  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Open', click: focusWindow },
      { label: 'Quit', click: () => app.quit() },
    ]),
  );

  tray.on('click', focusWindow);
}

ipcMain.handle('ping', () => 'pong');

ipcMain.handle('dialog:openDirectory', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle('repo:analyze', async (_event, repoPath: string) => {
  return analyzeRepository(repoPath);
});

ipcMain.handle('repo:fileOwnership', async (_event, repoPath: string, filePath: string) => {
  return getFileOwnership(repoPath, filePath);
});

ipcMain.handle(
  'report:export',
  async (_event, defaultFileName: string, report: ExportReport): Promise<ExportResult> => {
    const result = await dialog.showSaveDialog({
      defaultPath: defaultFileName,
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });
    if (result.canceled || !result.filePath) {
      return { canceled: true };
    }
    await writeFile(result.filePath, JSON.stringify(report, null, 2), 'utf-8');
    return { canceled: false, filePath: result.filePath };
  },
);

ipcMain.handle('window:isMaximized', () => mainWindow?.isMaximized() ?? false);

ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window:toggleMaximize', () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle('window:close', () => {
  mainWindow?.close();
});

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
