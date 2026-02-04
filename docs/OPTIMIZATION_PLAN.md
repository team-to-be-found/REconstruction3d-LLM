# Reconstruction 3D - 工程化优化方案

> 借鉴 [Ophel](https://github.com/urzeye/ophel) 项目的优秀设计思路，提升项目工程化水平

**创建时间**: 2026-02-04
**参考项目**: [Ophel v1.0](https://github.com/urzeye/ophel) - AI 对话增强工具
**优化目标**: 代码复用性 ↑ / 维护成本 ↓ / 扩展性 ↑

---

## 📊 优化概览

| 优化领域 | 当前状态 | Ophel 启发 | 优化方案 |
|---------|---------|-----------|---------|
| **数据源适配** | 硬编码解析逻辑 | 适配器模式 | 统一数据源接口 |
| **组件复用** | 重复代码较多 | 模板库系统 | 抽象可配置组件 |
| **文档结构** | 文档分散 | 结构化文档 | 统一文档规范 |
| **状态管理** | 单一 Store | 分层状态管理 | 拆分业务 Store |
| **构建流程** | 基础构建 | 多平台构建 | 增强构建脚本 |
| **类型系统** | 类型定义松散 | 严格类型约束 | 完善类型定义 |

---

## 🎯 核心优化方向

### 1️⃣ 适配器模式：统一数据源接口

**问题**: 当前直接解析不同数据源（Claude Config、Project Structure），代码耦合度高。

**Ophel 启发**:
- 通过 Site Adapters 抹平不同 AI 平台差异（ChatGPT/Claude/Gemini）
- 统一接口 → 核心模块无需关心数据来源

**优化方案**:

```typescript
// src/adapters/base.ts
export interface DataSourceAdapter {
  name: string;
  fetchData(): Promise<KnowledgeGraphData>;
  parseNode(raw: any): KnowledgeNode;
  parseConnection(raw: any): KnowledgeConnection;
  validateData(data: any): boolean;
}

// src/adapters/claude-config-adapter.ts
export class ClaudeConfigAdapter implements DataSourceAdapter {
  name = "Claude Config";

  async fetchData() {
    // 从 API 获取 Claude 配置
    const response = await fetch('/api/claude-config');
    return this.transform(await response.json());
  }

  parseNode(skill: ClaudeSkill): KnowledgeNode {
    return {
      id: skill.name,
      type: 'skill',
      data: {
        title: skill.displayName,
        description: skill.description,
        category: skill.category
      }
    };
  }

  // ...
}

// src/adapters/project-structure-adapter.ts
export class ProjectStructureAdapter implements DataSourceAdapter {
  // 实现项目结构解析逻辑
}

// src/adapters/markdown-files-adapter.ts
export class MarkdownFilesAdapter implements DataSourceAdapter {
  // 新增：支持从 Markdown 文件构建知识图谱
}

// src/adapters/registry.ts
export const adapterRegistry = {
  'claude-config': new ClaudeConfigAdapter(),
  'project-structure': new ProjectStructureAdapter(),
  'markdown-files': new MarkdownFilesAdapter(),
};

export function getAdapter(type: string): DataSourceAdapter {
  return adapterRegistry[type];
}
```

**收益**:
- ✅ 新增数据源只需实现适配器接口
- ✅ 核心代码与数据源解耦
- ✅ 易于单元测试（Mock 适配器）

---

### 2️⃣ 模板库系统：可复用的可视化配置

**问题**: 节点样式、布局算法、配色方案等代码分散，难以复用。

**Ophel 启发**:
- Prompt Library - 变量支持、分类管理、一键复用
- Theme Presets - 20+ 预设主题，统一配色系统

**优化方案**:

```typescript
// src/templates/node-styles.ts
export const nodeStyleTemplates = {
  'tech-sphere': {
    geometry: 'sphere',
    color: '#6366f1',
    emissive: '#4f46e5',
    roughness: 0.3,
    metalness: 0.8,
    scale: 1.0
  },
  'data-cube': {
    geometry: 'box',
    color: '#10b981',
    emissive: '#059669',
    roughness: 0.5,
    metalness: 0.6,
    scale: 1.2
  },
  // 更多预设...
};

// src/templates/layout-algorithms.ts
export const layoutTemplates = {
  'orbital-3-rings': {
    type: 'orbital',
    rings: [
      { radius: 5, nodes: 'core' },
      { radius: 15, nodes: 'category' },
      { radius: 25, nodes: 'item' }
    ]
  },
  'force-directed': {
    type: 'force',
    strength: -30,
    distance: 10
  },
  'hierarchical-tree': {
    type: 'tree',
    direction: 'radial',
    separation: 2
  }
};

// src/templates/color-schemes.ts
export const colorSchemeTemplates = {
  'cyberpunk-neon': {
    primary: '#00ffff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    background: '#0a0e27',
    nodes: {
      skill: '#7e57c2',
      plugin: '#ffa726',
      mcp: '#29b6f6'
    }
  },
  'minimal-grayscale': {
    primary: '#ffffff',
    secondary: '#9ca3af',
    accent: '#3b82f6',
    background: '#111827',
    nodes: {
      skill: '#6b7280',
      plugin: '#9ca3af',
      mcp: '#d1d5db'
    }
  }
};

// src/templates/index.ts
export interface VisualizationTemplate {
  name: string;
  nodeStyle: keyof typeof nodeStyleTemplates;
  layout: keyof typeof layoutTemplates;
  colorScheme: keyof typeof colorSchemeTemplates;
  camera: {
    position: [number, number, number];
    fov: number;
  };
}

export const visualizationPresets: Record<string, VisualizationTemplate> = {
  'tech-orbital': {
    name: 'Tech Orbital (Current)',
    nodeStyle: 'tech-sphere',
    layout: 'orbital-3-rings',
    colorScheme: 'cyberpunk-neon',
    camera: { position: [0, 0, 50], fov: 75 }
  },
  'minimal-force': {
    name: 'Minimal Force Graph',
    nodeStyle: 'data-cube',
    layout: 'force-directed',
    colorScheme: 'minimal-grayscale',
    camera: { position: [0, 0, 40], fov: 60 }
  }
};
```

**收益**:
- ✅ 快速切换可视化风格
- ✅ 用户可自定义预设
- ✅ 易于 A/B 测试不同布局

---

### 3️⃣ 文档结构优化：统一文档规范

**问题**: 文档分散在根目录，缺乏统一组织。

**Ophel 启发**:
- 清晰的文档分类（功能演示、核心功能、架构图）
- 多语言支持（10 种语言）
- 完整的 Changelog 和 Roadmap

**优化方案**:

```
reconstruction-3d/
├── docs/
│   ├── README.md                    # 文档索引（新增）
│   ├── architecture/                # 架构文档
│   │   ├── SYSTEM_DESIGN.md        # 系统设计
│   │   ├── DATA_FLOW.md            # 数据流图
│   │   └── ADAPTER_PATTERN.md      # 适配器模式说明
│   │
│   ├── guides/                      # 使用指南
│   │   ├── QUICK_START.md          # 快速开始
│   │   ├── CUSTOMIZATION.md        # 自定义指南
│   │   └── TROUBLESHOOTING.md      # 故障排查
│   │
│   ├── api/                         # API 文档
│   │   ├── ADAPTERS.md             # 适配器 API
│   │   ├── STORES.md               # Store API
│   │   └── COMPONENTS.md           # 组件 API
│   │
│   ├── reports/                     # 技术报告
│   │   ├── OPTIMIZATION_REPORT.md  # 优化报告
│   │   ├── VERIFICATION_REPORT.md  # 验证报告
│   │   └── PHASE_X_REPORT.md       # 阶段报告
│   │
│   ├── images/                      # 文档图片
│   │   ├── architecture/           # 架构图
│   │   ├── screenshots/            # 功能截图
│   │   └── demos/                  # 演示动画
│   │
│   └── i18n/                        # 多语言（未来）
│       ├── README_en.md
│       └── README_zh-CN.md
│
└── README.md                        # 主文档（简化版）
```

**Changelog 规范**:

```markdown
## [0.3.0] - 2026-02-05

### Added - 新增
- 🎨 适配器模式：统一数据源接口
- 📚 模板库系统：10+ 可视化预设
- 🔧 配置中心：统一管理所有配置

### Changed - 变更
- 🏗️ 重构：Store 拆分为多个业务 Store
- 📖 文档：迁移至 docs/ 目录，增加架构文档

### Fixed - 修复
- 🐛 修复内存泄漏问题
- ⚡ 优化渲染性能（60fps → 120fps）

### Deprecated - 废弃
- ⚠️ 旧版 V2 UI（将在 v1.0 移除）
```

**收益**:
- ✅ 文档易于查找和维护
- ✅ 新贡献者快速上手
- ✅ 清晰的版本演进历史

---

### 4️⃣ 状态管理优化：分层 Store 设计

**问题**: 所有状态集中在 `useKnowledgeStore`，职责不清晰。

**Ophel 启发**:
- 按功能拆分 Store（settings / prompts / conversations）
- 本地持久化 + 可选云同步

**优化方案**:

```typescript
// src/stores/useDataSourceStore.ts
interface DataSourceState {
  currentAdapter: string;
  adapters: Record<string, DataSourceAdapter>;
  data: KnowledgeGraphData | null;
  isLoading: boolean;
  error: Error | null;

  // Actions
  switchAdapter: (name: string) => void;
  refreshData: () => Promise<void>;
  addCustomAdapter: (adapter: DataSourceAdapter) => void;
}

// src/stores/useVisualizationStore.ts
interface VisualizationState {
  currentPreset: string;
  nodeStyles: typeof nodeStyleTemplates;
  layout: typeof layoutTemplates;
  colorScheme: typeof colorSchemeTemplates;

  // Actions
  applyPreset: (name: string) => void;
  updateNodeStyle: (type: string, style: Partial<NodeStyle>) => void;
}

// src/stores/useUIStore.ts
interface UIState {
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  searchQuery: string;
  filters: NodeFilter[];
  panelVisibility: {
    left: boolean;
    right: boolean;
    bottom: boolean;
  };

  // Actions
  selectNode: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  togglePanel: (panel: keyof UIState['panelVisibility']) => void;
}

// src/stores/useSettingsStore.ts
interface SettingsState {
  theme: 'dark' | 'light';
  performance: {
    enableInstancedRendering: boolean;
    maxNodes: number;
    targetFPS: number;
  };
  persistence: {
    autoSave: boolean;
    syncToCloud: boolean;
  };

  // Actions
  updateSettings: (settings: Partial<SettingsState>) => void;
  resetToDefaults: () => void;
}

// src/stores/index.ts
export const useStores = () => ({
  dataSource: useDataSourceStore(),
  visualization: useVisualizationStore(),
  ui: useUIStore(),
  settings: useSettingsStore(),
});
```

**持久化策略**:

```typescript
// src/stores/middleware/persistence.ts
import { persist } from 'zustand/middleware';

export const createPersistedStore = <T>(
  name: string,
  initialState: T,
  options?: {
    storage?: 'local' | 'session' | 'memory';
    whitelist?: (keyof T)[];
  }
) => {
  return persist(
    () => initialState,
    {
      name: `reconstruction-3d-${name}`,
      storage: options?.storage === 'session'
        ? sessionStorage
        : localStorage,
      partialize: (state) => {
        if (!options?.whitelist) return state;
        return Object.fromEntries(
          options.whitelist.map(key => [key, state[key]])
        );
      }
    }
  );
};
```

**收益**:
- ✅ 职责分离，代码更清晰
- ✅ 独立测试各个 Store
- ✅ 灵活的持久化策略

---

### 5️⃣ 构建流程优化：增强构建脚本

**问题**: 构建命令简单，缺少环境检测和错误处理。

**Ophel 启发**:
- 支持多平台构建（Extension / Userscript）
- 统一的开发和生产构建流程
- 完善的环境检测

**优化方案**:

```json
// package.json
{
  "scripts": {
    // 开发模式
    "dev": "next dev",
    "dev:electron": "concurrently \"npm run dev:next\" \"npm run dev:electron-start\"",
    "dev:turbo": "next dev --turbo",

    // 构建
    "build": "npm run build:check && npm run build:web && npm run build:electron",
    "build:check": "npm run type-check && npm run lint",
    "build:web": "next build",
    "build:electron": "tsc -p tsconfig.electron.json && electron-builder",
    "build:docker": "docker build -t reconstruction-3d .",

    // 测试
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage",

    // 代码质量
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",

    // 工具
    "clean": "rimraf .next dist-electron node_modules/.cache",
    "clean:full": "npm run clean && rimraf node_modules",
    "analyze": "ANALYZE=true npm run build:web",
    "validate": "npm run type-check && npm run lint && npm run test"
  }
}
```

**环境检测脚本**:

```typescript
// scripts/check-env.ts
import { execSync } from 'child_process';

function checkNodeVersion() {
  const required = '18.0.0';
  const current = process.version.slice(1);
  if (current < required) {
    console.error(`❌ Node.js >= ${required} required (current: ${current})`);
    process.exit(1);
  }
  console.log(`✅ Node.js ${current}`);
}

function checkDependencies() {
  const required = [
    { name: 'git', command: 'git --version' },
    { name: 'npm', command: 'npm --version' }
  ];

  for (const dep of required) {
    try {
      const version = execSync(dep.command, { encoding: 'utf-8' }).trim();
      console.log(`✅ ${dep.name}: ${version}`);
    } catch {
      console.error(`❌ ${dep.name} not found`);
      process.exit(1);
    }
  }
}

checkNodeVersion();
checkDependencies();
console.log('✅ Environment check passed');
```

**收益**:
- ✅ 统一的构建入口
- ✅ 自动化环境检测
- ✅ 完善的错误提示

---

### 6️⃣ 类型系统完善：严格类型约束

**问题**: 部分类型定义使用 `any`，缺少运行时验证。

**Ophel 启发**:
- 完整的 TypeScript 类型定义
- 运行时数据验证（适配器的 `validateData` 方法）

**优化方案**:

```typescript
// src/types/adapters.ts
import { z } from 'zod';

// Zod Schema for runtime validation
export const KnowledgeNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['skill', 'plugin', 'mcp', 'category', 'file', 'folder']),
  data: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    metadata: z.record(z.unknown()).optional()
  }),
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number()
  }).optional(),
  style: z.object({
    color: z.string(),
    geometry: z.enum(['sphere', 'box', 'torus', 'cylinder']),
    scale: z.number()
  }).optional()
});

export type KnowledgeNode = z.infer<typeof KnowledgeNodeSchema>;

// Adapter response validation
export function validateAdapterResponse(data: unknown): KnowledgeGraphData {
  const schema = z.object({
    nodes: z.array(KnowledgeNodeSchema),
    connections: z.array(KnowledgeConnectionSchema)
  });

  return schema.parse(data);
}
```

**类型守卫**:

```typescript
// src/utils/type-guards.ts
export function isKnowledgeNode(obj: any): obj is KnowledgeNode {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.type === 'string' &&
    typeof obj.data === 'object'
  );
}

export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`);
}

// Usage in switch statements
function handleNodeType(node: KnowledgeNode) {
  switch (node.type) {
    case 'skill':
      return renderSkillNode(node);
    case 'plugin':
      return renderPluginNode(node);
    case 'mcp':
      return renderMCPNode(node);
    default:
      return assertNever(node.type); // TypeScript error if missing case
  }
}
```

**收益**:
- ✅ 编译时类型检查
- ✅ 运行时数据验证
- ✅ 更好的 IDE 支持

---

## 📋 实施计划

### Phase 1: 基础设施（预计 2 天）
- [ ] 创建 `src/adapters/` 目录结构
- [ ] 实现 `DataSourceAdapter` 接口
- [ ] 迁移现有解析逻辑到适配器
- [ ] 添加适配器注册机制

### Phase 2: 模板系统（预计 2 天）
- [ ] 创建 `src/templates/` 目录
- [ ] 实现节点样式模板
- [ ] 实现布局算法模板
- [ ] 实现配色方案模板
- [ ] 创建可视化预设系统

### Phase 3: Store 重构（预计 1 天）
- [ ] 拆分 `useKnowledgeStore`
- [ ] 创建 `useDataSourceStore`
- [ ] 创建 `useVisualizationStore`
- [ ] 创建 `useUIStore`
- [ ] 创建 `useSettingsStore`
- [ ] 添加持久化中间件

### Phase 4: 文档整理（预计 1 天）
- [ ] 创建 `docs/` 目录结构
- [ ] 迁移现有文档到新结构
- [ ] 编写架构文档
- [ ] 编写 API 文档
- [ ] 编写自定义指南

### Phase 5: 构建优化（预计 1 天）
- [ ] 增强 `package.json` 脚本
- [ ] 创建环境检测脚本
- [ ] 添加代码质量工具（ESLint/Prettier）
- [ ] 配置 CI/CD 流程

### Phase 6: 类型系统（预计 1 天）
- [ ] 安装 Zod 依赖
- [ ] 定义 Zod Schema
- [ ] 实现运行时验证
- [ ] 添加类型守卫
- [ ] 消除 `any` 类型

---

## 🎯 预期收益

| 指标 | 当前 | 优化后 | 提升 |
|------|------|--------|------|
| **代码复用率** | ~40% | ~80% | +100% |
| **新数据源接入时间** | 4 小时 | 1 小时 | -75% |
| **文档查找时间** | 5 分钟 | 30 秒 | -90% |
| **构建失败率** | ~10% | ~2% | -80% |
| **类型安全性** | 中等 | 高 | +50% |
| **新人上手时间** | 2 天 | 半天 | -75% |

---

## 🔗 参考资源

- [Ophel 项目](https://github.com/urzeye/ophel) - 适配器模式、模板库系统
- [Plasmo Framework](https://docs.plasmo.com/) - 多平台构建
- [Zustand Best Practices](https://github.com/pmndrs/zustand) - 状态管理
- [Zod Documentation](https://zod.dev/) - 运行时类型验证

---

**优化负责人**: Arxchibobo
**创建时间**: 2026-02-04
**预计完成**: 2026-02-12（8 天）
**状态**: ⏳ 待启动
