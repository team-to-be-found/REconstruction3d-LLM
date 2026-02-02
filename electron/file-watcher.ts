import chokidar, { FSWatcher } from 'chokidar';

export type FileChangeEvent = 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir';
export type FileChangeCallback = (event: FileChangeEvent, filePath: string) => void;

export class FileWatcher {
  private watchers: Map<string, FSWatcher> = new Map();

  watch(dirPath: string, callback: FileChangeCallback): void {
    if (this.watchers.has(dirPath)) {
      console.warn(`Already watching ${dirPath}`);
      return;
    }

    const watcher = chokidar.watch(dirPath, {
      ignored: /(^|[\/\\])\../, // 忽略隐藏文件
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100
      }
    });

    watcher
      .on('add', (path) => callback('add', path))
      .on('change', (path) => callback('change', path))
      .on('unlink', (path) => callback('unlink', path))
      .on('addDir', (path) => callback('addDir', path))
      .on('unlinkDir', (path) => callback('unlinkDir', path))
      .on('error', (error) => console.error(`Watcher error: ${error}`));

    this.watchers.set(dirPath, watcher);
    console.log(`Started watching ${dirPath}`);
  }

  unwatch(dirPath: string): void {
    const watcher = this.watchers.get(dirPath);
    if (watcher) {
      watcher.close();
      this.watchers.delete(dirPath);
      console.log(`Stopped watching ${dirPath}`);
    }
  }

  close(): void {
    this.watchers.forEach((watcher) => watcher.close());
    this.watchers.clear();
    console.log('All watchers closed');
  }
}
