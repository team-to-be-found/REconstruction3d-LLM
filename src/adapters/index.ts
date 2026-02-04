/**
 * Adapter Registry
 *
 * 统一注册和导出所有数据源适配器
 * 新增适配器时只需在此注册即可
 */

import { adapterRegistry, type DataSourceAdapter } from './base';
import { ClaudeConfigAdapter } from './claude-config-adapter';
import { ProjectStructureAdapter } from './project-structure-adapter';

// 注册所有适配器
adapterRegistry.register('claude-config', (config) => new ClaudeConfigAdapter(config));
adapterRegistry.register('project-structure', (config) => new ProjectStructureAdapter(config));

/**
 * 获取适配器实例的便捷函数
 */
export function getAdapter(name: string): DataSourceAdapter {
  return adapterRegistry.get(name);
}

/**
 * 获取所有可用适配器列表
 */
export function listAdapters(): Array<{
  name: string;
  displayName: string;
  description: string;
  sourceType: string;
}> {
  const adapters = adapterRegistry.list();
  return adapters.map(name => {
    const adapter = adapterRegistry.get(name);
    return {
      name: adapter.name,
      displayName: adapter.displayName,
      description: adapter.description,
      sourceType: adapter.sourceType
    };
  });
}

/**
 * 检查适配器是否存在
 */
export function hasAdapter(name: string): boolean {
  return adapterRegistry.has(name);
}

// 导出基础类和接口
export {
  type DataSourceAdapter,
  type AdapterConfig,
  BaseAdapter,
  adapterRegistry
} from './base';

// 导出具体适配器类（供高级用法）
export {
  ClaudeConfigAdapter,
  ProjectStructureAdapter
};
