'use client';

import { Suspense } from 'react';
import Scene from '@/components/scene/Scene';
import Sidebar from '@/components/ui/Sidebar';
import TopBar from '@/components/ui/TopBar';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ManagementPanel from '@/components/ui/ManagementPanel';
import ClaudeConfigPanel from '@/components/ui/ClaudeConfigPanel';
import NodeDetailPanel from '@/components/ui/NodeDetailPanel';

export default function Home() {
  return (
    <main className="w-full h-full flex flex-col relative overflow-hidden">
      {/* Top Bar - 固定在顶部，高优先级 */}
      <div className="relative" style={{ zIndex: 1000 }}>
        <TopBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* 3D Scene */}
        <div className="flex-1 relative">
          <Suspense fallback={<LoadingScreen />}>
            <Scene />
          </Suspense>

          {/* Claude配置信息面板 - 左下角 */}
          <ClaudeConfigPanel />

          {/* 节点详情面板 - 右侧 */}
          <NodeDetailPanel />
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>

      {/* Management Panel - 浮动按钮和弹窗 */}
      <ManagementPanel />
    </main>
  );
}
