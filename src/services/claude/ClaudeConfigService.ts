import type { ClaudeConfig, ClaudeSkill, ClaudeMCP, ClaudePlugin } from '@/types/claude-config';
import type { KnowledgeNode, Connection } from '@/types/knowledge';
import { pathUtils as path } from '@/utils/path';

/**
 * Claude配置加载服务
 * 负责从本地文件系统加载Skills、MCP、Plugins等配置
 */
export class ClaudeConfigService {
  private config: ClaudeConfig | null = null;
  private rootPath: string = '';

  /**
   * 初始化服务，加载Claude配置
   * @param rootPath Claude配置根目录，默认为 C:\Users\Administrator\.claude
   */
  async initialize(rootPath?: string): Promise<void> {
    // 使用提供的路径或默认路径
    this.rootPath = rootPath || 'C:\\Users\\Administrator\\.claude';

    try {
      // 调用 API Route 加载真实配置
      console.log('🔄 调用 API Route 加载配置...');
      const response = await fetch('/api/claude-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_CLAUDE_CONFIG_API_KEY || 'dev-only-key',
        },
        body: JSON.stringify({ rootPath: this.rootPath }),
      });

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`);
      }

      this.config = await response.json();
      console.log('✅ Claude配置加载成功:', {
        skills: this.config?.skills.length,
        mcps: this.config?.mcps.length,
        plugins: this.config?.plugins.length,
      });
    } catch (error) {
      console.error('❌ 加载Claude配置失败，使用模拟数据:', error);
      this.config = this.getMockConfig();
    }
  }


  /**
   * 获取配置
   */
  getConfig(): ClaudeConfig | null {
    return this.config;
  }

  /**
   * 获取Skills列表
   */
  getSkills(): ClaudeSkill[] {
    return this.config?.skills || [];
  }

  /**
   * 获取MCPs列表
   */
  getMCPs(): ClaudeMCP[] {
    return this.config?.mcps || [];
  }

  /**
   * 获取Plugins列表
   */
  getPlugins(): ClaudePlugin[] {
    return this.config?.plugins || [];
  }

  /**
   * 获取配置统计信息
   */
  getStats() {
    const skills = this.getSkills();
    const mcps = this.getMCPs();
    const plugins = this.getPlugins();

    return {
      totalSkills: skills.length,
      enabledSkills: skills.filter(s => s.enabled).length,
      totalMCPs: mcps.length,
      enabledMCPs: mcps.filter(m => m.enabled).length,
      totalPlugins: plugins.length,
      enabledPlugins: plugins.filter(p => p.enabled).length,
    };
  }

  /**
   * 将Claude配置转换为KnowledgeNode数组
   * 生成层次化的节点结构：中心机器人 + Category节点 + 具体项目节点
   */
  convertToNodes(): { nodes: KnowledgeNode[]; connections: Connection[] } {
    if (!this.config) {
      return { nodes: [], connections: [] };
    }

    const nodes: KnowledgeNode[] = [];
    const connections: Connection[] = [];

    // 创建中心机器人节点（原点）
    nodes.push({
      id: 'center',
      type: 'config',
      title: 'Claude System',
      description: 'Central AI Agent - Claude Code',
      filePath: '',
      content: 'Claude工程化管理中心',
      tags: ['center', 'claude', 'system'],
      links: [],
      position: [0, 0, 0],
      metadata: {
        size: 0,
        created: new Date(),
        modified: new Date(),
        accessed: new Date(),
        accessCount: 0,
        importance: 1.0,
      },
      visual: {
        color: '#0066ff',
        size: 2.0,
        shape: 'sphere',
        glow: true,
        icon: 'settings',
      },
    });

    // Category节点配置（第一圈，半径15）
    const categories = [
      {
        id: 'category-skills',
        title: 'Skills',
        color: '#10B981', // 绿色
        angle: 0, // 0度
      },
      {
        id: 'category-mcp',
        title: 'MCP Servers',
        color: '#06B6D4', // 青色
        angle: (2 * Math.PI) / 3, // 120度
      },
      {
        id: 'category-plugins',
        title: 'Plugins',
        color: '#F59E0B', // 黄色
        angle: (4 * Math.PI) / 3, // 240度
      },
    ];

    const categoryRadius = 15;

    // 创建Category节点
    categories.forEach((cat) => {
      const position = this.calculateSphericalPosition(categoryRadius, cat.angle, Math.PI / 2);

      nodes.push({
        id: cat.id,
        type: 'category',
        title: cat.title,
        description: `Claude ${cat.title} Configuration`,
        filePath: '',
        content: '',
        tags: ['category', 'claude'],
        links: [],
        position,
        metadata: {
          size: 0,
          created: new Date(),
          modified: new Date(),
          accessed: new Date(),
          accessCount: 0,
          importance: 1.0,
        },
        visual: {
          color: cat.color,
          size: 1.5,
          shape: 'cube',
          glow: true,
          icon: 'folder',
        },
      });

      // 创建从中心到Category的连接
      connections.push({
        id: `center-${cat.id}`,
        source: 'center',
        target: cat.id,
        type: 'parent-child',
        strength: 1.0,
        metadata: {
          created: new Date(),
          manual: false,
        },
        visual: {
          color: cat.color,
          width: 3,
          dashed: false,
          animated: true,
        },
      });
    });

    // 创建Skills节点（第二圈）
    const skills = this.getSkills();
    const skillsAngleStart = 0;
    const skillsAngleRange = (2 * Math.PI) / 3; // 120度扇区
    this.createChildNodes(
      nodes,
      connections,
      skills,
      'category-skills',
      'skill',
      skillsAngleStart,
      skillsAngleRange,
      25,
      '#10B981'
    );

    // 创建MCP节点（第二圈）
    const mcps = this.getMCPs();
    const mcpsAngleStart = (2 * Math.PI) / 3;
    const mcpsAngleRange = (2 * Math.PI) / 3;
    this.createChildNodes(
      nodes,
      connections,
      mcps,
      'category-mcp',
      'mcp',
      mcpsAngleStart,
      mcpsAngleRange,
      25,
      '#06B6D4'
    );

    // 创建Plugin节点（第二圈）
    const plugins = this.getPlugins();
    const pluginsAngleStart = (4 * Math.PI) / 3;
    const pluginsAngleRange = (2 * Math.PI) / 3;
    this.createChildNodes(
      nodes,
      connections,
      plugins,
      'category-plugins',
      'plugin',
      pluginsAngleStart,
      pluginsAngleRange,
      25,
      '#F59E0B'
    );

    console.log(`Generated ${nodes.length} Claude config nodes, ${connections.length} connections`);

    return { nodes, connections };
  }

  /**
   * 创建子节点（Skills/MCP/Plugins的具体项）
   */
  private createChildNodes(
    nodes: KnowledgeNode[],
    connections: Connection[],
    items: Array<ClaudeSkill | ClaudeMCP | ClaudePlugin>,
    parentId: string,
    nodeType: 'skill' | 'mcp' | 'plugin',
    angleStart: number,
    angleRange: number,
    radius: number,
    color: string
  ): void {
    if (items.length === 0) return;

    items.forEach((item, index) => {
      // 计算角度（在扇区内均匀分布）
      const angle = angleStart + (angleRange / (items.length + 1)) * (index + 1);
      const position = this.calculateSphericalPosition(radius, angle, Math.PI / 2);

      const nodeId = `${nodeType}-${item.name}`;

      // 创建节点
      nodes.push({
        id: nodeId,
        type: nodeType,
        title: item.name,
        description: item.description || `${nodeType}: ${item.name}`,
        filePath: 'path' in item ? item.path : '',
        content: JSON.stringify(item, null, 2),
        tags: [nodeType, 'claude'],
        links: [],
        position,
        metadata: {
          size: 1000,
          created: new Date(),
          modified: new Date(),
          accessed: new Date(),
          accessCount: 0,
          importance: item.enabled ? 0.8 : 0.3,
        },
        visual: {
          color: item.enabled ? color : '#666666',
          size: item.enabled ? 1.0 : 0.6,
          shape: nodeType === 'skill' ? 'torus' : nodeType === 'mcp' ? 'cylinder' : 'dodecahedron',
          glow: item.enabled,
          icon: nodeType,
        },
      });

      // 创建从Category到子节点的连接
      connections.push({
        id: `${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: 'parent-child',
        strength: 0.6,
        metadata: {
          created: new Date(),
          manual: false,
        },
        visual: {
          color: color,
          width: 2,
          dashed: !item.enabled,
          animated: item.enabled,
        },
      });
    });
  }

  /**
   * 计算球面坐标位置
   * @param radius 半径
   * @param theta 方位角（0-2π）
   * @param phi 极角（0-π）
   */
  private calculateSphericalPosition(
    radius: number,
    theta: number,
    phi: number
  ): [number, number, number] {
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    return [x, y, z];
  }

  /**
   * 生成模拟配置数据（用于无Electron环境时）
   */
  private getMockConfig(): ClaudeConfig {
    return {
      skills: [
        {
          name: 'agent-browser',
          description: '浏览器自动化Agent',
          category: 'automation',
          path: '/mock/skills/agent-browser',
          enabled: true,
        },
        {
          name: 'processing-creative',
          description: 'Processing创意编程',
          category: 'creative',
          path: '/mock/skills/processing-creative',
          enabled: true,
        },
        {
          name: 'ui-ux-pro-max',
          description: 'UI/UX设计专家',
          category: 'design',
          path: '/mock/skills/ui-ux-pro-max',
          enabled: true,
        },
      ],
      mcps: [
        {
          name: 'playwright',
          description: 'Playwright浏览器自动化',
          command: 'npx',
          args: ['@playwright/mcp'],
          enabled: true,
        },
        {
          name: 'firebase',
          description: 'Firebase MCP服务',
          command: 'firebase-mcp',
          args: [],
          enabled: true,
        },
      ],
      plugins: [
        {
          name: 'backend-development',
          version: '1.0.0',
          description: '后端开发插件',
          path: '/mock/plugins/backend-development',
          enabled: true,
        },
        {
          name: 'frontend-design',
          version: '1.0.0',
          description: '前端设计插件',
          path: '/mock/plugins/frontend-design',
          enabled: true,
        },
      ],
      knowledgeBasePath: this.rootPath,
    };
  }
}

// 单例实例
export const claudeConfigService = new ClaudeConfigService();
