@echo off
echo ========================================
echo  Reconstruction 3D - Starting...
echo ========================================
echo.

:: 检查 node_modules 是否存在
if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

:: 启动开发服务器
echo [INFO] Starting development server...
echo [INFO] Opening http://localhost:3000 in browser...
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev:next

pause
