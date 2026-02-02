async function testAPI() {
  try {
    console.log('🧪 测试 Claude 配置 API...\n');

    const response = await fetch('http://localhost:3000/api/claude-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'dev-only-key',
      },
      body: JSON.stringify({
        rootPath: 'E:\\Bobo\'s Coding cache\\.claude',
      }),
    });

    if (!response.ok) {
      console.error(`❌ API 请求失败: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error('响应内容:', text);
      return;
    }

    const data = await response.json();

    console.log('✅ API 响应成功!\n');
    console.log('📊 统计信息:');
    console.log(`  - Skills: ${data.skills?.length || 0}`);
    console.log(`  - MCPs: ${data.mcps?.length || 0}`);
    console.log(`  - Plugins: ${data.plugins?.length || 0}`);
    console.log(`  - 知识库路径: ${data.knowledgeBasePath}\n`);

    if (data.mcps && data.mcps.length > 0) {
      console.log('📦 MCP 列表:');
      data.mcps.forEach((mcp, index) => {
        console.log(`  ${index + 1}. ${mcp.name}`);
        console.log(`     - 命令: ${mcp.command}`);
        console.log(`     - 来源: ${mcp.source}`);
        console.log(`     - 启用: ${mcp.enabled ? '✓' : '✗'}`);
      });
    } else {
      console.log('⚠️ 未加载任何 MCP');
    }

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error(error.stack);
  }
}

testAPI();
