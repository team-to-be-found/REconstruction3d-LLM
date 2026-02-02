# MCP 加载修复总结

## 🐛 问题描述

启动应用时，后台出现大量 MCP 加载失败错误：

```
❌ 加载 MCP 失败: Error: ENOENT: no such file or directory, open 'E:\Bobo's Coding cache\.claude\config.json'
```

最终结果：`mcps: 0`（MCP 数量为 0）

---

## 🔍 根本原因

**错误的配置文件路径假设**

原代码假设 MCP 配置存储在单一的 `config.json` 文件中（Claude Desktop 的方式）：

```typescript
// ❌ 原代码（错误）
const configPath = path.join(rootPath, 'config.json');
const configContent = await fs.readFile(configPath, 'utf8');
```

但 **Claude Code CLI** 使用的是不同的配置结构：
- MCP 配置分散在多个 `mcp-*/` 目录中
- 每个目录包含独立的 `mcp-config.json` 文件
- 没有集中的 `config.json` 文件

---

## ✅ 修复方案

### 1. 重写 `loadMCPs()` 函数

**文件**: `src/app/api/claude-config/route.ts:141-191`

**新逻辑**:
1. 遍历所有 `mcp-*` 目录
2. 读取每个目录下的 `mcp-config.json`
3. 合并所有 MCP 配置到一个数组
4. 添加详细的日志和错误处理

```typescript
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
    console.log(`✅ 总共加载 ${allMcps.length} 个 MCP`);

    return allMcps;
  } catch (error) {
    console.error('❌ 加载 MCP 失败:', error);
    return [];
  }
}
```

---

## 📊 修复效果

### 修复前
```
❌ 加载 MCP 失败: ENOENT: no such file or directory
✅ 加载完成: { skills: 106, mcps: 0, plugins: 1 }
```

### 修复后（预期）
```
📦 发现 27 个 MCP 目录
  ✓ mcp-1Kocou: 加载 3 个 MCP (sequential-thinking, context7, playwright)
  ✓ mcp-2b5toP: 加载 2 个 MCP
  ... (其他 MCP 目录)
✅ 总共加载 XX 个 MCP
✅ 加载完成: { skills: 106, mcps: XX, plugins: 1 }
```

---

## 🧪 测试方法

### 方法 1: 浏览器测试（推荐）

1. 启动开发服务器：
   ```bash
   cd "e:\Bobo's Coding cache\reconstruction-3d"
   npm run dev:next
   ```

2. 打开浏览器访问：http://localhost:3000

3. 打开浏览器开发者工具（F12）→ Console

4. 刷新页面，查看日志输出：
   - 应该看到 `📦 发现 XX 个 MCP 目录`
   - 应该看到每个 MCP 目录的加载日志
   - 应该看到 `✅ 总共加载 XX 个 MCP`

5. 检查左下角状态栏：
   - **修复前**: Skills: 106 | MCPs: **0** | Plugins: 1
   - **修复后**: Skills: 106 | MCPs: **>0** | Plugins: 1

### 方法 2: API 直接测试

等服务器启动后，使用 curl 测试 API：

```bash
curl -X POST http://localhost:3000/api/claude-config \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-only-key" \
  -d @test-api.json | python -m json.tool | head -100
```

检查响应中的 `mcps` 数组是否有内容。

---

## 📁 相关文件

| 文件 | 修改内容 |
|------|---------|
| `src/app/api/claude-config/route.ts` | 重写 `loadMCPs()` 函数（L141-191） |

---

## 🎯 验收标准

- ✅ 服务器启动无错误
- ✅ Console 显示 MCP 加载日志
- ✅ API 返回 `mcps` 数组包含数据
- ✅ 左下角状态栏显示 MCPs 数量 > 0
- ✅ 3D 场景正常显示
- ✅ 所有功能正常工作

---

## 🔧 故障排除

### 问题 1: 仍然显示 mcps: 0

**原因**: 可能是服务器缓存问题

**解决**:
1. 停止开发服务器（Ctrl+C）
2. 删除 `.next` 目录：`rm -rf .next`
3. 重新启动：`npm run dev:next`

### 问题 2: MCP 目录找不到

**原因**: `.claude` 路径配置错误

**解决**:
1. 检查 `ClaudeConfigService.ts` 中的默认路径
2. 确保路径指向正确的 `.claude` 目录
3. 检查该目录下是否有 `mcp-*` 子目录

### 问题 3: 部分 MCP 加载失败

**原因**: 个别 `mcp-config.json` 文件损坏或格式错误

**解决**:
1. 检查 Console 日志，找到失败的 MCP 目录名
2. 手动检查该目录下的 `mcp-config.json` 文件
3. 验证 JSON 格式是否正确
4. 失败的 MCP 不会影响其他 MCP 加载

---

## 📝 后续优化建议

1. **性能优化**:
   - 当前并行加载所有 MCP，如果 MCP 数量过多可能影响启动速度
   - 可考虑添加加载超时和重试机制

2. **缓存机制**:
   - 可以缓存 MCP 配置，避免每次请求都重新读取文件
   - 使用 Next.js 的 unstable_cache 或 Redis 缓存

3. **热重载**:
   - 添加文件监控，当 MCP 配置变化时自动重新加载
   - 使用 chokidar 监控 `mcp-*/mcp-config.json` 文件变化

4. **错误详情**:
   - 在 UI 中显示 MCP 加载状态
   - 提供更详细的错误信息给用户

---

**修复完成时间**: 2026-01-30
**修复状态**: ✅ 完成
**测试状态**: ⏳ 待用户验证
