#!/bin/bash
# 3D 知识图谱开发服务器 - 一键启动脚本
# 用法：./start-dev.sh 或 bash start-dev.sh

set -e  # 遇到错误立即退出

# 颜色定义
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}🚀 3D 知识图谱开发服务器 - 启动脚本${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 1. 清理端口
echo -e "${YELLOW}📍 步骤 1: 清理端口...${NC}"
echo "   正在检查端口 3000, 3001, 3002..."
npx kill-port 3000 3001 3002 2>/dev/null && echo -e "${GREEN}   ✓ 端口已释放${NC}" || echo -e "${GREEN}   ✓ 端口已清空（无占用）${NC}"
echo ""

# 2. 询问是否清理缓存
echo -e "${YELLOW}🧹 步骤 2: 缓存清理（可选）${NC}"
read -p "   是否清理 .next 缓存？[y/N]: " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -d ".next" ]; then
        rm -rf .next
        echo -e "${GREEN}   ✓ .next 缓存已清理${NC}"
    else
        echo -e "${GREEN}   ✓ 无需清理（.next 不存在）${NC}"
    fi
else
    echo -e "${GREEN}   ⊘ 跳过缓存清理${NC}"
fi
echo ""

# 3. 验证依赖
echo -e "${YELLOW}📦 步骤 3: 验证依赖...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${RED}   ✗ node_modules 不存在，正在安装依赖...${NC}"
    npm install
    echo -e "${GREEN}   ✓ 依赖安装完成${NC}"
else
    echo -e "${GREEN}   ✓ 依赖已存在${NC}"
fi
echo ""

# 4. 启动开发服务器
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ 步骤 4: 启动开发服务器...${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}📍 访问地址：${NC}"
echo -e "   主页: ${CYAN}http://localhost:3000${NC}"
echo -e "   V2 UI: ${CYAN}http://localhost:3000/v2${NC}"
echo ""
echo -e "${YELLOW}💡 提示：按 Ctrl+C 停止服务器${NC}"
echo ""

# 启动服务器
npm run dev
