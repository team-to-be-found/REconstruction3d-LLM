/**
 * Electron IPC Bridge Type Definitions
 *
 * This file provides TypeScript types for the window.electron API
 * exposed by the Electron preload script.
 */

interface FileSystemEntry {
  name: string;
  path: string;
  isDirectory: boolean;
}

interface ElectronAPI {
  // Path utilities (Node.js path module exposed to renderer)
  path: {
    join: (...paths: string[]) => string;
    dirname: (path: string) => string;
    basename: (path: string, ext?: string) => string;
    extname: (path: string) => string;
    resolve: (...paths: string[]) => string;
    relative: (from: string, to: string) => string;
    normalize: (path: string) => string;
    sep: string;
  };

  // File system operations
  fs: {
    readDirectory: (dirPath: string) => Promise<FileSystemEntry[]>;
    readFile: (filePath: string) => Promise<string>;
    onFileChanged: (callback: (data: any) => void) => void;
    watchDirectory: (dirPath: string) => Promise<void>;
    unwatchDirectory: () => void;
  };

  // Dialog operations
  dialog: {
    selectDirectory: () => Promise<string | null>;
  };

  // Configuration loading
  loadMCPConfig?: () => Promise<any>;
  loadSkills?: () => Promise<any[]>;

  // Environment detection
  isElectron?: () => boolean;
}

interface Window {
  electron?: ElectronAPI;
}

// For direct imports if needed
declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export {};
