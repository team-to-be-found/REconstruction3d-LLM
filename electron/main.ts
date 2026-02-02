import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import { FileWatcher } from './file-watcher';
import { FileSystemAPI } from './file-system';

let mainWindow: BrowserWindow | null = null;
let fileWatcher: FileWatcher | null = null;
let fileSystemAPI: FileSystemAPI | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 800,
    backgroundColor: '#0a0a0a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset',
    frame: false,
    show: false,
  });

  // 开发模式加载 localhost，生产模式加载打包后的文件
  const isDev = process.env.NODE_ENV === 'development';
  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../out/index.html')}`;

  mainWindow.loadURL(startURL);

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // 开发模式下打开 DevTools
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 初始化服务
async function initializeServices() {
  try {
    // 初始化文件监听器
    fileWatcher = new FileWatcher();

    // 初始化文件系统 API
    fileSystemAPI = new FileSystemAPI();

    console.log('Services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize services:', error);
  }
}

// IPC 处理器
function setupIPCHandlers() {
  // 读取文件
  ipcMain.handle('fs:readFile', async (_, filePath: string) => {
    if (!fileSystemAPI) throw new Error('FileSystemAPI not initialized');
    return fileSystemAPI.readFile(filePath);
  });

  // 读取目录
  ipcMain.handle('fs:readDirectory', async (_, dirPath: string) => {
    if (!fileSystemAPI) throw new Error('FileSystemAPI not initialized');
    return fileSystemAPI.readDirectory(dirPath);
  });

  // 写入文件
  ipcMain.handle('fs:writeFile', async (_, filePath: string, content: string) => {
    if (!fileSystemAPI) throw new Error('FileSystemAPI not initialized');
    return fileSystemAPI.writeFile(filePath, content);
  });

  // 监听目录变化
  ipcMain.handle('fs:watchDirectory', async (_, dirPath: string) => {
    if (!fileWatcher) throw new Error('FileWatcher not initialized');
    fileWatcher.watch(dirPath, (event, filePath) => {
      mainWindow?.webContents.send('fs:fileChanged', { event, filePath });
    });
  });

  // 取消监听
  ipcMain.handle('fs:unwatchDirectory', async (_, dirPath: string) => {
    if (!fileWatcher) throw new Error('FileWatcher not initialized');
    fileWatcher.unwatch(dirPath);
  });

  // 获取应用路径
  ipcMain.handle('app:getPath', async (_, name: string) => {
    return app.getPath(name as any);
  });

  // 选择目录
  ipcMain.handle('dialog:selectDirectory', async () => {
    const { dialog } = require('electron');
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ['openDirectory']
    });
    return result.filePaths[0];
  });
}

// App 生命周期
app.whenReady().then(async () => {
  await initializeServices();
  setupIPCHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // 清理资源
  if (fileWatcher) {
    fileWatcher.close();
  }
});
