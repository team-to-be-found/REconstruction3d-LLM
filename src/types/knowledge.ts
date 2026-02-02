export type NodeType =
  | 'document'
  | 'category'
  | 'error'
  | 'mcp'
  | 'skill'
  | 'plugin'
  | 'config';

export type ShapeType =
  | 'sphere'
  | 'cube'
  | 'cylinder'
  | 'octahedron'
  | 'torus'
  | 'dodecahedron';

export type ConnectionType =
  | 'reference'
  | 'dependency'
  | 'related'
  | 'cross-reference'
  | 'parent-child'
  | 'cause-effect';

// 节点层级定义
export type NodeTier = 'CoreSkill' | 'Skill' | 'Item';

// 轨道编号
export type OrbitNumber = 1 | 2 | 3;

export interface KnowledgeNode {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  filePath: string;
  content: string;
  tags: string[];
  links: string[];
  position: [number, number, number];

  // 🌌 新增：层级和轨道信息
  tier?: NodeTier;        // 节点层级（决定大小和形状）
  orbit?: OrbitNumber;    // 所在轨道（1-3）

  metadata: {
    size: number;
    created: Date;
    modified: Date;
    accessed: Date;
    accessCount: number;
    importance: number;
  };
  visual: {
    color: string;
    size: number;
    shape: ShapeType;
    glow: boolean;
    icon: string;
  };
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  type: ConnectionType;
  strength: number;
  label?: string;
  metadata: {
    created: Date;
    manual: boolean;
  };
  visual: {
    color: string;
    width: number;
    dashed: boolean;
    animated: boolean;
  };
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  connections: Connection[];
  metadata: {
    version: string;
    lastUpdated: Date;
    totalSize: number;
    fileCount: number;
  };
}
