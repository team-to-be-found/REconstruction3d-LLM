@echo off
REM 3D 知识图谱开发服务器 - 一键启动脚本（Windows）
REM 用法：双击运行或在 CMD 中执行 start-dev.bat

chcp 65001 >nul
setlocal enabledelayedexpansion

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🚀 3D 知识图谱开发服务器 - 启动脚本
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM 1. 清理端口
echo 📍 步骤 1: 清理端口...
echo    正在检查端口 3000, 3001, 3002...
call npx kill-port 3000 3001 3002 2>nul
if %errorlevel%==0 (
    echo    ✓ 端口已释放
) else (
    echo    ✓ 端口已清空（无占用）
)
echo.

REM 2. 询问是否清理缓存
echo 🧹 步骤 2: 缓存清理（可选）
set /p clean_cache="   是否清理 .next 缓存？[y/N]: "
if /i "%clean_cache%"=="y" (
    if exist .next (
        rmdir /s /q .next
        echo    ✓ .next 缓存已清理
    ) else (
        echo    ✓ 无需清理（.next 不存在）
    )
) else (
    echo    ⊘ 跳过缓存清理
)
echo.

REM 3. 验证依赖
echo 📦 步骤 3: 验证依赖...
if not exist node_modules (
    echo    ✗ node_modules 不存在，正在安装依赖...
    call npm install
    echo    ✓ 依赖安装完成
) else (
    echo    ✓ 依赖已存在
)
echo.

REM 4. 启动开发服务器
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✨ 步骤 4: 启动开发服务器...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📍 访问地址：
echo    主页: http://localhost:3000
echo    V2 UI: http://localhost:3000/v2
echo.
echo 💡 提示：按 Ctrl+C 停止服务器
echo.

REM 启动服务器
call npm run dev

pause
