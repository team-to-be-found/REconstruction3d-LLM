'use client';

import { useState } from 'react';
import { useKnowledgeStore } from '@/stores/useKnowledgeStore';
import NeonButton from './NeonButton';

/**
 * 底部工具栏 - 赛博朋克风格
 * 特点：缩放控制、重置视图、状态信息、小地图
 */
export default function BottomToolbar() {
  const { selectedNode } = useKnowledgeStore();
  const [zoom, setZoom] = useState(100);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 5, z: 15 });

  // 重置视图
  const handleResetView = () => {
    setZoom(100);
    setCameraPosition({ x: 0, y: 5, z: 15 });
    // TODO: 集成到 3D 场景控制
    console.log('重置视图');
  };

  // 缩放控制
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(200, prev + 10));
    // TODO: 集成到 3D 场景控制
    console.log('放大', zoom + 10);
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(10, prev - 10));
    // TODO: 集成到 3D 场景控制
    console.log('缩小', zoom - 10);
  };

  return (
    <footer
      className="
        fixed
        left-60
        right-0
        bottom-0
        h-12
        bg-[rgba(10,14,39,0.7)]
        backdrop-blur-md
        border-t
        border-cyan-500/20
        flex
        items-center
        justify-between
        px-4
        z-40
      "
    >
      {/* 左侧：缩放控制 */}
      <div className="flex items-center gap-4">
        <NeonButton
          variant="secondary"
          size="sm"
          onClick={handleResetView}
        >
          重置视图
        </NeonButton>

        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="
              w-6
              h-6
              flex
              items-center
              justify-center
              text-cyan-400
              border
              border-cyan-500/50
              rounded
              hover:bg-cyan-500/20
              hover:shadow-[0_0_10px_rgba(0,255,255,0.5)]
              transition-all
              duration-300
              font-bold
            "
          >
            -
          </button>
          <span className="text-xs text-white/70 font-mono w-12 text-center">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            className="
              w-6
              h-6
              flex
              items-center
              justify-center
              text-cyan-400
              border
              border-cyan-500/50
              rounded
              hover:bg-cyan-500/20
              hover:shadow-[0_0_10px_rgba(0,255,255,0.5)]
              transition-all
              duration-300
              font-bold
            "
          >
            +
          </button>
        </div>
      </div>

      {/* 中间：状态信息 */}
      <div className="flex items-center gap-6 text-xs text-white/50">
        <span className="font-mono">
          相机位置: ({cameraPosition.x.toFixed(1)}, {cameraPosition.y.toFixed(1)}, {cameraPosition.z.toFixed(1)})
        </span>
        <span className="w-px h-4 bg-white/20" />
        <span>
          选中节点: {selectedNode ? selectedNode.title : '无'}
        </span>
      </div>

      {/* 右侧：小地图（占位） */}
      <div
        className="
          w-32
          h-8
          bg-[rgba(0,255,255,0.05)]
          border
          border-cyan-500/30
          rounded
          flex
          items-center
          justify-center
          text-xs
          text-cyan-400/50
          hover:bg-[rgba(0,255,255,0.1)]
          hover:border-cyan-500/50
          transition-all
          duration-300
        "
      >
        小地图
      </div>

      {/* 底部扫描线效果 */}
      <div
        className="
          absolute
          top-0
          left-0
          right-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-cyan-500
          to-transparent
          animate-pulse
        "
      />
    </footer>
  );
}
