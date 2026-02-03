'use client';

import { X } from 'lucide-react';
import { useKnowledgeStore } from '@/stores/useKnowledgeStore';

/**
 * 右侧节点详情面板 - 赛博朋克风格
 * 特点：滑入/滑出动画、玻璃态背景、HUD 装饰
 */
export default function RightInfoPanel() {
  const { selectedNode, setSelectedNode } = useKnowledgeStore();

  // 如果没有选中节点，不显示面板
  if (!selectedNode) return null;

  // 格式化日期
  const formatDate = (date?: string | Date) => {
    if (!date) return 'N/A';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  // 获取节点类型显示名称
  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      skill: 'Skill',
      plugin: 'Plugin',
      mcp: 'MCP Server',
      category: '分类',
      document: '文档',
    };
    return typeMap[type] || type;
  };

  // 获取节点类型颜色
  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      skill: 'text-cyan-400 border-cyan-500',
      plugin: 'text-magenta-400 border-magenta-500',
      mcp: 'text-yellow-400 border-yellow-500',
      category: 'text-green-400 border-green-500',
      document: 'text-blue-400 border-blue-500',
    };
    return colorMap[type] || 'text-cyan-400 border-cyan-500';
  };

  return (
    <div
      className="
        fixed
        right-0
        top-16
        bottom-12
        w-80
        bg-[rgba(10,14,39,0.85)]
        backdrop-blur-lg
        border-l
        border-cyan-500/30
        overflow-y-auto
        z-40
        animate-slide-in-right
        shadow-[-10px_0_30px_rgba(0,255,255,0.3)]
      "
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,255,255,0.02) 20px, rgba(0,255,255,0.02) 21px)',
      }}
    >
      <div className="p-6 space-y-6">
        {/* 标题栏 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-cyan-400 tracking-wider">
            节点详情
          </h3>
          <button
            onClick={() => setSelectedNode(null)}
            className="
              w-8
              h-8
              flex
              items-center
              justify-center
              text-cyan-400
              hover:text-magenta-400
              hover:bg-magenta-500/20
              border
              border-cyan-500/50
              rounded
              transition-all
              duration-300
              hover:shadow-[0_0_15px_rgba(255,0,255,0.5)]
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 节点名称 */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">
            {selectedNode.title}
          </h2>
          <div
            className={`
              inline-block
              px-3
              py-1
              text-xs
              font-semibold
              rounded-full
              border
              ${getTypeColor(selectedNode.type)}
              bg-black/50
            `}
          >
            {getTypeLabel(selectedNode.type)}
          </div>
        </div>

        {/* 描述 */}
        {selectedNode.description && (
          <div>
            <div className="text-xs text-cyan-400 mb-2 font-semibold">
              描述
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              {selectedNode.description}
            </p>
          </div>
        )}

        {/* 元数据 */}
        <div
          className="
            p-4
            bg-black/30
            border
            border-cyan-500/20
            rounded
            space-y-2
          "
        >
          <div className="text-xs text-cyan-400 mb-3 font-semibold">
            元数据
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-white/50">创建时间:</span>
            <span className="text-cyan-400 font-mono">
              {formatDate(selectedNode.metadata?.created)}
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-white/50">修改时间:</span>
            <span className="text-cyan-400 font-mono">
              {formatDate(selectedNode.metadata?.modified)}
            </span>
          </div>

          {selectedNode.filePath && (
            <div className="pt-2 border-t border-cyan-500/20">
              <div className="text-white/50 text-xs mb-1">文件路径:</div>
              <div
                className="
                  text-cyan-400
                  text-xs
                  font-mono
                  break-all
                  bg-black/30
                  p-2
                  rounded
                  border
                  border-cyan-500/10
                "
              >
                {selectedNode.filePath}
              </div>
            </div>
          )}
        </div>

        {/* 标签 */}
        {selectedNode.tags && selectedNode.tags.length > 0 && (
          <div>
            <div className="text-xs text-cyan-400 mb-3 font-semibold">
              标签
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedNode.tags.map((tag) => (
                <span
                  key={tag}
                  className="
                    px-3
                    py-1
                    bg-cyan-500/20
                    text-cyan-400
                    text-xs
                    rounded-full
                    border
                    border-cyan-500/40
                    hover:bg-cyan-500/30
                    hover:shadow-[0_0_10px_rgba(0,255,255,0.5)]
                    transition-all
                    duration-300
                  "
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 内容预览 */}
        {selectedNode.content && (
          <div>
            <div className="text-xs text-cyan-400 mb-3 font-semibold">
              内容预览
            </div>
            <pre
              className="
                text-xs
                text-white/70
                bg-black/50
                p-3
                rounded
                border
                border-cyan-500/20
                overflow-x-auto
                font-mono
                whitespace-pre-wrap
                leading-relaxed
              "
            >
              {selectedNode.content.slice(0, 500)}
              {selectedNode.content.length > 500 && '...'}
            </pre>
          </div>
        )}

        {/* HUD 装饰 - 左上角 */}
        <div
          className="
            absolute
            -top-px
            -left-px
            w-4
            h-4
            border-t-2
            border-l-2
            border-cyan-400
          "
        />
        {/* HUD 装饰 - 右上角 */}
        <div
          className="
            absolute
            -top-px
            -right-px
            w-4
            h-4
            border-t-2
            border-r-2
            border-cyan-400
          "
        />
        {/* HUD 装饰 - 左下角 */}
        <div
          className="
            absolute
            -bottom-px
            -left-px
            w-4
            h-4
            border-b-2
            border-l-2
            border-cyan-400
          "
        />
        {/* HUD 装饰 - 右下角 */}
        <div
          className="
            absolute
            -bottom-px
            -right-px
            w-4
            h-4
            border-b-2
            border-r-2
            border-cyan-400
          "
        />
      </div>

      {/* 扫描线效果 */}
      <div
        className="
          absolute
          inset-0
          pointer-events-none
          opacity-20
        "
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)',
          animation: 'scanlines 8s linear infinite',
        }}
      />

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes scanlines {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(4px);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
