/**
 * Claude Config Adapter
 *
 * 解析 Claude Code 配置文件（Skills、Plugins、MCP Servers）
 * 并转换为知识图谱数据结构
 */

import { BaseAdapter, AdapterConfig } from './base';
import { KnowledgeNode, KnowledgeConnection, KnowledgeGraphData, NodeType } from '@/types/knowledge';

/**
 * Claude Skill 原始数据结构
 */
interface ClaudeSkill {
  name: string;
  description?: string;
  category?: string;
  plugin?: string;
  subagentType?: string;
}

/**
 * Claude Plugin 原始数据结构
 */
interface ClaudePlugin {
  name: string;
  description?: string;
  skills?: string[];
}

/**
 * Claude MCP Server 原始数据结构
 */
interface ClaudeMCPServer {
  name: string;
  description?: string;
  tools?: string[];
}

/**
 * Claude 配置原始响应
 */
interface ClaudeConfigResponse {
  skills: ClaudeSkill[];
  plugins: ClaudePlugin[];
  mcpServers: ClaudeMCPServer[];
}

export class ClaudeConfigAdapter extends BaseAdapter {
  readonly name = 'claude-config';
  readonly displayName = 'Claude Configuration';
  readonly description = 'Visualize Claude Code skills, plugins, and MCP servers';
  readonly sourceType = 'api' as const;

  constructor(config?: AdapterConfig) {
    super({
      apiEndpoint: '/api/claude-config',
      ...config
    });
  }

  async fetchData(): Promise<KnowledgeGraphData> {
    const cacheKey = 'claude-config-data';
    const cached = this.getCachedData<KnowledgeGraphData>(cacheKey);
    if (cached) {
      console.log('[ClaudeConfigAdapter] Returning cached data');
      return cached;
    }

    try {
      const response = await fetch(this.config.apiEndpoint!);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData: ClaudeConfigResponse = await response.json();

      if (!this.validateData(rawData)) {
        throw new Error('Invalid data structure from API');
      }

      const graphData = this.transformToGraph(rawData);
      this.setCachedData(cacheKey, graphData);

      return graphData;
    } catch (error) {
      this.handleError(error, 'fetchData');
    }
  }

  /**
   * 将 Claude 配置转换为知识图谱
   */
  private transformToGraph(data: ClaudeConfigResponse): KnowledgeGraphData {
    const nodes: KnowledgeNode[] = [];
    const connections: KnowledgeConnection[] = [];

    // 创建分类节点
    const categories = new Set<string>();
    data.skills.forEach(skill => {
      if (skill.category) categories.add(skill.category);
    });

    categories.forEach(category => {
      nodes.push({
        id: `category-${category}`,
        type: 'category' as NodeType,
        data: {
          title: category,
          description: `${category} category`,
          category
        }
      });
    });

    // 创建 Skill 节点
    data.skills.forEach(skill => {
      const node = this.parseNode({ ...skill, nodeType: 'skill' });
      nodes.push(node);

      // 连接到分类
      if (skill.category) {
        connections.push({
          source: node.id,
          target: `category-${skill.category}`,
          type: 'belongsTo'
        });
      }
    });

    // 创建 Plugin 节点
    data.plugins.forEach(plugin => {
      const node = this.parseNode({ ...plugin, nodeType: 'plugin' });
      nodes.push(node);

      // 连接到分类（Plugin 也属于某个分类）
      connections.push({
        source: node.id,
        target: `category-plugin`,
        type: 'belongsTo'
      });
    });

    // 创建 MCP Server 节点
    data.mcpServers.forEach(mcp => {
      const node = this.parseNode({ ...mcp, nodeType: 'mcp' });
      nodes.push(node);

      // 连接到分类
      connections.push({
        source: node.id,
        target: `category-mcp-server`,
        type: 'belongsTo'
      });
    });

    return { nodes, connections };
  }

  parseNode(raw: any): KnowledgeNode {
    const nodeType = raw.nodeType || 'skill';

    return {
      id: `${nodeType}-${raw.name}`,
      type: nodeType as NodeType,
      data: {
        title: raw.name,
        description: raw.description || '',
        category: raw.category || nodeType,
        metadata: {
          plugin: raw.plugin,
          subagentType: raw.subagentType,
          tools: raw.tools
        }
      }
    };
  }

  parseConnection(raw: any): KnowledgeConnection {
    return {
      source: raw.source,
      target: raw.target,
      type: raw.type || 'default'
    };
  }

  validateData(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.skills) &&
      Array.isArray(data.plugins) &&
      Array.isArray(data.mcpServers)
    );
  }

  async getStatistics() {
    try {
      const data = await this.fetchData();
      const categories = new Set(
        data.nodes
          .filter(n => n.type === 'skill')
          .map(n => n.data.category)
          .filter(Boolean)
      );

      return {
        nodeCount: data.nodes.length,
        connectionCount: data.connections.length,
        categories: Array.from(categories) as string[],
        lastUpdated: new Date()
      };
    } catch (error) {
      this.handleError(error, 'getStatistics');
    }
  }

  async refresh(): Promise<boolean> {
    try {
      this.clearCache();
      await this.fetchData();
      return true;
    } catch (error) {
      console.error('[ClaudeConfigAdapter] Refresh failed:', error);
      return false;
    }
  }
}
