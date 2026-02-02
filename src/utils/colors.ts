/**
 * Claude Engineering Galaxy · 语义颜色系统
 *
 * 禁止随机颜色，所有颜色必须有语义
 */

export interface SemanticColor {
  primary: string;      // 主色
  secondary: string;    // 辅助色
  glow: string;         // 发光色
  opacity?: number;     // 透明度（可选）
}

/**
 * 语义颜色常量
 * 每种类型都有明确的颜色含义
 */
export const SEMANTIC_COLORS: Record<string, SemanticColor> = {
  // Prompt / LLM / AI
  llm: {
    primary: '#5B8EFF',      // Blue - 智能、思考
    secondary: '#4A5FC1',    // Indigo - 深度
    glow: '#7AA2FF',
  },

  // Infra / Tooling / DevOps
  infra: {
    primary: '#00FFFF',      // Cyan - 技术、工具
    secondary: '#00BFA5',    // Teal - 系统
    glow: '#4DD0E1',
  },

  // Review / QA / Testing
  review: {
    primary: '#FFB74D',      // Amber - 检查、警告
    secondary: '#FFA726',    // Orange - 审查
    glow: '#FFCC80',
  },

  // Automation / Workflow
  automation: {
    primary: '#AB47BC',      // Purple - 自动化、流程
    secondary: '#8E24AA',    // Deep Purple
    glow: '#CE93D8',
  },

  // Security / Protection
  security: {
    primary: '#EF5350',      // Red - 安全、防护
    secondary: '#E53935',    // Deep Red
    glow: '#FF8A80',
  },

  // Documentation / Knowledge
  documentation: {
    primary: '#66BB6A',      // Green - 知识、文档
    secondary: '#4CAF50',    // Medium Green
    glow: '#A5D6A7',
  },

  // Frontend / UI
  frontend: {
    primary: '#EC407A',      // Pink - 界面、视觉
    secondary: '#D81B60',    // Deep Pink
    glow: '#F8BBD0',
  },

  // Backend / API
  backend: {
    primary: '#42A5F5',      // Light Blue - 后端、服务
    secondary: '#1E88E5',    // Medium Blue
    glow: '#90CAF9',
  },

  // Data / Analytics
  data: {
    primary: '#26A69A',      // Teal - 数据、分析
    secondary: '#00897B',    // Dark Teal
    glow: '#80CBC4',
  },

  // Experimental / Beta
  experimental: {
    primary: '#78909C',      // Gray - 实验、未成熟
    secondary: '#546E7A',    // Blue Gray
    glow: '#90A4AE',
    opacity: 0.6,            // 低透明度表示不稳定
  },

  // Plugin / Extension
  plugin: {
    primary: '#FFA726',      // Orange - 插件、扩展
    secondary: '#FF9800',    // Dark Orange
    glow: '#FFCC80',
  },

  // Skill / Capability
  skill: {
    primary: '#7E57C2',      // Deep Purple - 技能、能力
    secondary: '#5E35B1',    // Deeper Purple
    glow: '#B39DDB',
  },

  // MCP / Server
  mcp: {
    primary: '#29B6F6',      // Light Blue - 服务、连接
    secondary: '#039BE5',    // Sky Blue
    glow: '#81D4FA',
  },

  // Category / Group
  category: {
    primary: '#00FFFF',      // Cyan - 分类、组织
    secondary: '#00BCD4',    // Cyan Dark
    glow: '#80DEEA',
  },

  // Default / Unknown
  default: {
    primary: '#9E9E9E',      // Gray - 未分类
    secondary: '#757575',    // Dark Gray
    glow: '#BDBDBD',
  },
};

/**
 * 根据节点类型获取语义颜色
 */
export function getColorByType(type?: string): SemanticColor {
  if (!type) return SEMANTIC_COLORS.default;

  const lowerType = type.toLowerCase();

  // 精确匹配
  if (SEMANTIC_COLORS[lowerType]) {
    return SEMANTIC_COLORS[lowerType];
  }

  // 模糊匹配
  if (lowerType.includes('llm') || lowerType.includes('prompt') || lowerType.includes('ai')) {
    return SEMANTIC_COLORS.llm;
  }
  if (lowerType.includes('infra') || lowerType.includes('tool') || lowerType.includes('devops')) {
    return SEMANTIC_COLORS.infra;
  }
  if (lowerType.includes('review') || lowerType.includes('qa') || lowerType.includes('test')) {
    return SEMANTIC_COLORS.review;
  }
  if (lowerType.includes('automat') || lowerType.includes('workflow') || lowerType.includes('cicd')) {
    return SEMANTIC_COLORS.automation;
  }
  if (lowerType.includes('security') || lowerType.includes('audit') || lowerType.includes('scan')) {
    return SEMANTIC_COLORS.security;
  }
  if (lowerType.includes('doc') || lowerType.includes('knowledge') || lowerType.includes('guide')) {
    return SEMANTIC_COLORS.documentation;
  }
  if (lowerType.includes('frontend') || lowerType.includes('ui') || lowerType.includes('react')) {
    return SEMANTIC_COLORS.frontend;
  }
  if (lowerType.includes('backend') || lowerType.includes('api') || lowerType.includes('server')) {
    return SEMANTIC_COLORS.backend;
  }
  if (lowerType.includes('data') || lowerType.includes('analytics') || lowerType.includes('database')) {
    return SEMANTIC_COLORS.data;
  }
  if (lowerType.includes('experiment') || lowerType.includes('beta') || lowerType.includes('draft')) {
    return SEMANTIC_COLORS.experimental;
  }
  if (lowerType.includes('plugin')) {
    return SEMANTIC_COLORS.plugin;
  }
  if (lowerType.includes('skill')) {
    return SEMANTIC_COLORS.skill;
  }
  if (lowerType.includes('mcp')) {
    return SEMANTIC_COLORS.mcp;
  }
  if (lowerType.includes('category')) {
    return SEMANTIC_COLORS.category;
  }

  return SEMANTIC_COLORS.default;
}

/**
 * 根据节点名称获取语义颜色（备用方案）
 */
export function getColorByName(name?: string): SemanticColor {
  if (!name) return SEMANTIC_COLORS.default;

  const lowerName = name.toLowerCase();

  // 分析名称中的关键词
  if (lowerName.includes('prompt') || lowerName.includes('llm')) {
    return SEMANTIC_COLORS.llm;
  }
  if (lowerName.includes('deploy') || lowerName.includes('infra')) {
    return SEMANTIC_COLORS.infra;
  }
  if (lowerName.includes('review') || lowerName.includes('test')) {
    return SEMANTIC_COLORS.review;
  }
  if (lowerName.includes('auto') || lowerName.includes('ci')) {
    return SEMANTIC_COLORS.automation;
  }
  if (lowerName.includes('security') || lowerName.includes('auth')) {
    return SEMANTIC_COLORS.security;
  }
  if (lowerName.includes('doc') || lowerName.includes('guide')) {
    return SEMANTIC_COLORS.documentation;
  }
  if (lowerName.includes('frontend') || lowerName.includes('ui')) {
    return SEMANTIC_COLORS.frontend;
  }
  if (lowerName.includes('backend') || lowerName.includes('api')) {
    return SEMANTIC_COLORS.backend;
  }
  if (lowerName.includes('data') || lowerName.includes('sql')) {
    return SEMANTIC_COLORS.data;
  }

  return SEMANTIC_COLORS.default;
}

/**
 * 根据节点类别获取语义颜色
 */
export function getColorByCategory(category?: string): SemanticColor {
  if (!category) return SEMANTIC_COLORS.default;

  // Category 节点统一使用 cyan
  if (category === 'category') {
    return SEMANTIC_COLORS.category;
  }

  // 其他按类型匹配
  return getColorByType(category);
}

/**
 * 混合两个颜色（用于渐变）
 */
export function blendColors(color1: string, color2: string, ratio: number): string {
  // 简单的颜色混合（可以用更复杂的算法）
  // 这里返回其中一个颜色（可以后续优化）
  return ratio < 0.5 ? color1 : color2;
}

/**
 * 调整颜色亮度
 */
export function adjustBrightness(color: string, amount: number): string {
  // 将十六进制转为 RGB，调整亮度后再转回
  // 简化版本，返回原色（可以后续优化）
  return color;
}

/**
 * 获取节点的完整颜色方案（包括 hover 和 selected 状态）
 */
export interface ColorScheme extends SemanticColor {
  hover: string;     // hover 时的颜色
  selected: string;  // 选中时的颜色
  dim: string;       // dim 时的颜色
}

export function getFullColorScheme(type?: string): ColorScheme {
  const base = getColorByType(type);

  return {
    ...base,
    hover: base.glow,              // hover 时使用 glow 颜色
    selected: base.secondary,      // 选中时使用 secondary
    dim: base.primary,             // dim 时保持 primary 但降低透明度
  };
}
