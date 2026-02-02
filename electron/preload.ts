import { contextBridge, ipcRenderer } from 'electron';
import * as path from 'path';

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electron', {
  // 文件系统 API
  fs: {
    readFile: (filePath: string) => ipcRenderer.invoke('fs:readFile', filePath),
    writeFile: (filePath: string, content: string) =>
      ipcRenderer.invoke('fs:writeFile', filePath, content),
    readDirectory: (dirPath: string) => ipcRenderer.invoke('fs:readDirectory', dirPath),
    watchDirectory: (dirPath: string) => ipcRenderer.invoke('fs:watchDirectory', dirPath),
    unwatchDirectory: (dirPath: string) => ipcRenderer.invoke('fs:unwatchDirectory', dirPath),
    onFileChanged: (callback: (data: any) => void) => {
      ipcRenderer.on('fs:fileChanged', (_, data) => callback(data));
    },
  },

  // Path 工具 API (安全地暴露path模块的常用方法)
  path: {
    join: (...paths: string[]) => path.join(...paths),
    dirname: (p: string) => path.dirname(p),
    basename: (p: string) => path.basename(p),
    extname: (p: string) => path.extname(p),
    resolve: (...paths: string[]) => path.resolve(...paths),
    normalize: (p: string) => path.normalize(p),
    sep: path.sep,
  },

  // 应用 API
  app: {
    getPath: (name: string) => ipcRenderer.invoke('app:getPath', name),
  },

  // 对话框 API
  dialog: {
    selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory'),
  },
});

// TypeScript 类型声明
export interface ElectronAPI {
  fs: {
    readFile: (filePath: string) => Promise<string>;
    writeFile: (filePath: string, content: string) => Promise<void>;
    readDirectory: (dirPath: string) => Promise<any[]>;
    watchDirectory: (dirPath: string) => Promise<void>;
    unwatchDirectory: (dirPath: string) => Promise<void>;
    onFileChanged: (callback: (data: any) => void) => void;
  };
  path: {
    join: (...paths: string[]) => string;
    dirname: (p: string) => string;
    basename: (p: string) => string;
    extname: (p: string) => string;
    resolve: (...paths: string[]) => string;
    normalize: (p: string) => string;
    sep: string;
  };
  app: {
    getPath: (name: string) => Promise<string>;
  };
  dialog: {
    selectDirectory: () => Promise<string>;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
