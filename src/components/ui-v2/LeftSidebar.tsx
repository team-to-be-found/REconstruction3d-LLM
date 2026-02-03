'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Circle, Box, Hexagon, FileText, AlertCircle } from 'lucide-react';
import GlassCard from './GlassCard';
import { useKnowledgeStore } from '@/stores/useKnowledgeStore';

interface NodeType {
  id: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  count: number;
  enabled: boolean;
}

/**
 * 左侧边栏 - 节点类型过滤和图例
 * 特点：可折叠分类、节点统计、过滤器
 */
export default function LeftSidebar() {
  const { nodes, enabledNodeTypes, toggleNodeType } = useKnowledgeStore();

  // 计算每种节点类型的数量
  const nodeTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      skill: 0,
      plugin: 0,
      mcp: 0,
      document: 0,
      error: 0,
    };
    nodes.forEach((node) => {
      if (counts[node.type] !== undefined) {
        counts[node.type]++;
      }
    });
    return counts;
  }, [nodes]);

  // 节点类型配置
  const nodeTypes: NodeType[] = [
    {
      id: 'skill',
      label: 'Skills',
      color: '#00FFFF',
      icon: <Hexagon className="w-4 h-4" />,
      count: nodeTypeCounts.skill,
      enabled: enabledNodeTypes.has('skill'),
    },
    {
      id: 'plugin',
      label: 'Plugins',
      color: '#FF00FF',
      icon: <Box className="w-4 h-4" />,
      count: nodeTypeCounts.plugin,
      enabled: enabledNodeTypes.has('plugin'),
    },
    {
      id: 'mcp',
      label: 'MCPs',
      color: '#FFFF00',
      icon: <Circle className="w-4 h-4" />,
      count: nodeTypeCounts.mcp,
      enabled: enabledNodeTypes.has('mcp'),
    },
    {
      id: 'document',
      label: '文档',
      color: '#10B981',
      icon: <FileText className="w-4 h-4" />,
      count: nodeTypeCounts.document,
      enabled: enabledNodeTypes.has('document'),
    },
    {
      id: 'error',
      label: '错误',
      color: '#EF4444',
      icon: <AlertCircle className="w-4 h-4" />,
      count: nodeTypeCounts.error,
      enabled: enabledNodeTypes.has('error'),
    },
  ];

  const [categories, setCategories] = useState([
    { id: 'backend', label: '后端开发', expanded: true },
    { id: 'frontend', label: '前端开发', expanded: false },
    { id: 'devops', label: 'DevOps', expanded: false },
    { id: 'security', label: '安全', expanded: false },
  ]);

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, expanded: !cat.expanded } : cat
      )
    );
  };

  return (
    <aside
      className="
        fixed
        left-0
        top-16
        bottom-12
        w-60
        bg-[rgba(26,30,63,0.8)]
        border-r
        border-cyan-500/20
        overflow-y-auto
        z-40
      "
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,255,255,0.02) 20px, rgba(0,255,255,0.02) 21px)',
      }}
    >
      <div className="p-4 space-y-4">
        {/* 节点类型过滤器 */}
        <GlassCard className="p-3" glowColor="cyan">
          <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-cyan-500 rounded" />
            节点类型
          </h3>

          <div className="space-y-2">
            {nodeTypes.map((type) => (
              <label
                key={type.id}
                className="
                  flex
                  items-center
                  gap-3
                  p-2
                  rounded
                  cursor-pointer
                  hover:bg-white/5
                  transition-colors
                  group
                "
              >
                {/* 自定义复选框 */}
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={type.enabled}
                    onChange={() => toggleNodeType(type.id)}
                    className="sr-only"
                  />
                  <div
                    className={`
                      w-5
                      h-5
                      rounded
                      border-2
                      flex
                      items-center
                      justify-center
                      transition-all
                      ${
                        type.enabled
                          ? 'border-cyan-500 bg-cyan-500/20'
                          : 'border-gray-500'
                      }
                    `}
                    style={{
                      boxShadow: type.enabled
                        ? `0 0 10px ${type.color}80`
                        : 'none',
                    }}
                  >
                    {type.enabled && (
                      <svg
                        className="w-3 h-3 text-cyan-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* 图标 */}
                <div style={{ color: type.color }}>{type.icon}</div>

                {/* 标签 */}
                <span className="flex-1 text-sm text-white/80 group-hover:text-white">
                  {type.label}
                </span>

                {/* 数量徽章 */}
                <span
                  className="
                    px-2
                    py-0.5
                    text-xs
                    font-semibold
                    rounded-full
                    bg-white/10
                    text-white/70
                  "
                >
                  {type.count}
                </span>
              </label>
            ))}
          </div>
        </GlassCard>

        {/* 分类树 */}
        <GlassCard className="p-3" glowColor="magenta">
          <h3 className="text-sm font-semibold text-magenta-400 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-magenta-500 rounded" />
            分类
          </h3>

          <div className="space-y-1">
            {categories.map((category) => (
              <div key={category.id}>
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="
                    w-full
                    flex
                    items-center
                    gap-2
                    p-2
                    rounded
                    text-left
                    hover:bg-white/5
                    transition-colors
                    group
                  "
                >
                  <ChevronDown
                    className={`
                      w-4
                      h-4
                      text-magenta-400
                      transition-transform
                      ${category.expanded ? '' : '-rotate-90'}
                    `}
                  />
                  <span className="text-sm text-white/80 group-hover:text-white">
                    {category.label}
                  </span>
                </button>

                {category.expanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    <div className="text-xs text-white/50 p-2">
                      • 节点 1
                    </div>
                    <div className="text-xs text-white/50 p-2">
                      • 节点 2
                    </div>
                    <div className="text-xs text-white/50 p-2">
                      • 节点 3
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* 连接强度滑块 */}
        <GlassCard className="p-3" glowColor="yellow">
          <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-yellow-500 rounded" />
            连接强度
          </h3>

          <input
            type="range"
            min="0"
            max="100"
            defaultValue="50"
            className="
              w-full
              h-2
              bg-white/10
              rounded-full
              appearance-none
              cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-yellow-500
              [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,0,0.7)]
            "
          />
        </GlassCard>
      </div>
    </aside>
  );
}
