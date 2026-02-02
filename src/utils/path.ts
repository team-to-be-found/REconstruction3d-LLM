/**
 * Path工具 - 浏览器兼容版本
 * 当Electron API不可用时提供fallback实现
 */

// 检测路径分隔符
const isWindows = typeof navigator !== 'undefined' && /win/i.test(navigator.platform);
const sep = isWindows ? '\\' : '/';

/**
 * 路径工具对象
 */
export const pathUtils = {
  /**
   * 连接路径
   */
  join(...paths: string[]): string {
    if (window.electron?.path) {
      return window.electron.path.join(...paths);
    }

    // Fallback实现
    const parts: string[] = [];
    for (const p of paths) {
      if (p) {
        parts.push(...p.split(/[/\\]/));
      }
    }
    return parts.join(sep);
  },

  /**
   * 获取目录名
   */
  dirname(p: string): string {
    if (window.electron?.path) {
      return window.electron.path.dirname(p);
    }

    // Fallback实现
    const parts = p.split(/[/\\]/);
    parts.pop();
    return parts.join(sep) || sep;
  },

  /**
   * 获取基础文件名
   */
  basename(p: string): string {
    if (window.electron?.path) {
      return window.electron.path.basename(p);
    }

    // Fallback实现
    const parts = p.split(/[/\\]/);
    return parts[parts.length - 1] || '';
  },

  /**
   * 获取扩展名
   */
  extname(p: string): string {
    if (window.electron?.path) {
      return window.electron.path.extname(p);
    }

    // Fallback实现
    const basename = this.basename(p);
    const dotIndex = basename.lastIndexOf('.');
    return dotIndex > 0 ? basename.substring(dotIndex) : '';
  },

  /**
   * 解析路径
   */
  resolve(...paths: string[]): string {
    if (window.electron?.path) {
      return window.electron.path.resolve(...paths);
    }

    // Fallback实现
    return this.join(...paths);
  },

  /**
   * 规范化路径
   */
  normalize(p: string): string {
    if (window.electron?.path) {
      return window.electron.path.normalize(p);
    }

    // Fallback实现
    return p.replace(/[/\\]+/g, sep);
  },

  /**
   * 路径分隔符
   */
  sep,
};
