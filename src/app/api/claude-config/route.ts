import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// 🔒 安全配置：路径白名单
const ALLOWED_ROOTS = [
  'E:\\Bobo\'s Coding cache\\.claude',
  'C:\\Users\\Administrator\\.claude',
  '/Users/Administrator/.claude', // macOS/Linux 兼容
];

/**
 * API Route: 加载本地 Claude 配置
 * 读取 Skills, MCP, Plugins 的真实数据
 *
 * 🔒 安全特性：
 * - 路径白名单验证
 * - 规范化路径处理
 * - 防止路径遍历攻击
 */
export async function POST(request: NextRequest) {
  try {
    // 🔒 API 授权验证
    const apiKey = request.headers.get('x-api-key');
    const expectedKey = process.env.CLAUDE_CONFIG_API_KEY || 'dev-only-key';

    if (apiKey !== expectedKey) {
      console.warn('⚠️ 安全警告：未授权的 API 访问尝试');
      return NextResponse.json(
        { error: 'Unauthorized. Invalid API key.' },
        { status: 401 }
      );
    }

    const { rootPath } = await request.json();

    // 🔒 路径安全验证
    if (!rootPath || typeof rootPath !== 'string') {
      return NextResponse.json(
        { error: 'Invalid rootPath parameter' },
        { status: 400 }
      );
    }

    // 规范化路径（解析 ../ 等）
    const normalizedPath = path.normalize(rootPath);
    const resolvedPath = path.resolve(normalizedPath);

    // 检查是否在白名单中
    const isAllowed = ALLOWED_ROOTS.some(allowed => {
      const normalizedAllowed = path.normalize(allowed);
      return resolvedPath.startsWith(normalizedAllowed);
    });

    if (!isAllowed) {
      console.warn('⚠️ 安全警告：拒绝无效路径访问:', resolvedPath);
      return NextResponse.json(
        { error: 'Access denied. Invalid path.' },
        { status: 403 }
      );
    }

    console.log('📂 API Route: 开始加载 Claude 配置');
    console.log('📂 根路径:', resolvedPath);

    // 并行加载 Skills, MCP, Plugins（使用验证后的路径）
    const [skills, mcps, plugins] = await Promise.all([
      loadSkills(resolvedPath),
      loadMCPs(resolvedPath),
      loadPlugins(resolvedPath),
    ]);

    console.log('✅ 加载完成:', {
      skills: skills.length,
      mcps: mcps.length,
      plugins: plugins.length,
    });

    return NextResponse.json({
      skills,
      mcps,
      plugins,
      knowledgeBasePath: resolvedPath,
    });
  } catch (error: any) {
    console.error('❌ API Route 错误:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * 加载 Skills
 */
async function loadSkills(rootPath: string) {
  try {
    const skillsPath = path.join(rootPath, 'skills');
    const skillDirs = await fs.readdir(skillsPath, { withFileTypes: true });

    const skills = await Promise.all(
      skillDirs
        .filter((d) => d.isDirectory())
        .map(async (dir) => {
          const skillPath = path.join(skillsPath, dir.name);
          const configPath = path.join(skillPath, 'skill.json');

          try {
            const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
            return {
              name: dir.name,
              description: config.description || '',
              category: config.category || 'general',
              path: skillPath,
              enabled: config.enabled !== false,
            };
          } catch {
            // 如果没有 skill.json，使用默认配置
            return {
              name: dir.name,
              description: `Skill: ${dir.name}`,
              category: 'general',
              path: skillPath,
              enabled: true,
            };
          }
        })
    );

    // 🔧 去重：防止目录扫描重复
    const uniqueSkills = Array.from(
      new Map(skills.map(skill => [skill.name, skill])).values()
    );

    console.log(`✅ Skills 加载完成: ${skills.length} 个（去重后 ${uniqueSkills.length} 个）`);

    return uniqueSkills;
  } catch (error) {
    console.error('❌ 加载 Skills 失败:', error);
    return [];
  }
}

/**
 * 加载 MCP Servers
 * Claude Code 将 MCP 配置存储在独立的 mcp-* 目录中
 */
async function loadMCPs(rootPath: string) {
  try {
    // 读取所有 mcp-* 目录
    const entries = await fs.readdir(rootPath, { withFileTypes: true });
    const mcpDirs = entries.filter(
      (entry) => entry.isDirectory() && entry.name.startsWith('mcp-')
    );

    console.log(`📦 发现 ${mcpDirs.length} 个 MCP 目录`);

    // 并行加载所有 MCP 配置
    const mcpArrays = await Promise.all(
      mcpDirs.map(async (dir) => {
        try {
          const mcpConfigPath = path.join(rootPath, dir.name, 'mcp-config.json');
          const configContent = await fs.readFile(mcpConfigPath, 'utf8');
          const config = JSON.parse(configContent);

          if (!config.mcpServers) {
            console.warn(`⚠️ ${dir.name} 缺少 mcpServers 配置`);
            return [];
          }

          // 转换为数组格式
          const mcps = Object.entries(config.mcpServers).map(
            ([name, mcpConfig]: [string, any]) => ({
              name,
              description: mcpConfig.description || '',
              command: mcpConfig.command,
              args: mcpConfig.args || [],
              env: mcpConfig.env || {},
              enabled: mcpConfig.enabled !== false,
              source: dir.name, // 记录来源目录
            })
          );

          console.log(`  ✓ ${dir.name}: 加载 ${mcps.length} 个 MCP`);
          return mcps;
        } catch (error) {
          console.warn(`  ✗ ${dir.name}: 加载失败`, error instanceof Error ? error.message : error);
          return [];
        }
      })
    );

    // 合并所有 MCP 配置
    const allMcps = mcpArrays.flat();

    // 🔧 去重：如果多个 mcp-* 目录包含同名 MCP，只保留最后一个
    const uniqueMcps = Array.from(
      new Map(allMcps.map(mcp => [mcp.name, mcp])).values()
    );

    console.log(`✅ 总共加载 ${allMcps.length} 个 MCP（去重后 ${uniqueMcps.length} 个）`);

    return uniqueMcps;
  } catch (error) {
    console.error('❌ 加载 MCP 失败:', error);
    return [];
  }
}

/**
 * 加载 Plugins
 */
async function loadPlugins(rootPath: string) {
  try {
    const pluginsPath = path.join(rootPath, 'plugins');
    const pluginDirs = await fs.readdir(pluginsPath, { withFileTypes: true });

    const plugins = await Promise.all(
      pluginDirs
        .filter((d) => d.isDirectory())
        .map(async (dir) => {
          const pluginPath = path.join(pluginsPath, dir.name);
          const packageJsonPath = path.join(pluginPath, 'package.json');

          try {
            const packageJson = JSON.parse(
              await fs.readFile(packageJsonPath, 'utf8')
            );
            return {
              name: dir.name,
              version: packageJson.version || '1.0.0',
              description: packageJson.description || '',
              path: pluginPath,
              enabled: true,
              config: packageJson.claudeConfig || {},
            };
          } catch {
            // 如果没有 package.json，使用默认配置
            return {
              name: dir.name,
              version: '1.0.0',
              description: `Plugin: ${dir.name}`,
              path: pluginPath,
              enabled: true,
            };
          }
        })
    );

    // 🔧 去重：防止目录扫描重复
    const uniquePlugins = Array.from(
      new Map(plugins.map(plugin => [plugin.name, plugin])).values()
    );

    console.log(`✅ Plugins 加载完成: ${plugins.length} 个（去重后 ${uniquePlugins.length} 个）`);

    return uniquePlugins;
  } catch (error) {
    console.error('❌ 加载 Plugins 失败:', error);
    return [];
  }
}
