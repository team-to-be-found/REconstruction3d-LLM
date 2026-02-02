'use client';

import { useKnowledgeStore } from '@/stores/useKnowledgeStore';
import { X, Calendar, File, Tag, Layers } from 'lucide-react';
import { getColorByType } from '@/utils/colors';

/**
 * 节点详情面板（Phase 3.1）
 *
 * 设计规范：玻璃态（Glassmorphism）深空风格
 * - 深蓝黑半透明背景
 * - backdrop-filter: blur
 * - 柔和的蓝色边框
 * - "Quiet, Intelligent, Confident" 美学
 */
export default function NodeDetailPanel() {
  const { selectedNode, setSelectedNode, connections } = useKnowledgeStore();

  // 如果没有选中节点，不渲染
  if (!selectedNode) return null;

  // 获取节点的语义颜色
  const colorScheme = getColorByType(selectedNode.type);

  // 格式化日期
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 获取类型显示文本
  const getTypeText = () => {
    const typeMap: Record<string, string> = {
      category: '核心分类',
      skill: 'Claude Skill',
      mcp: 'MCP Server',
      plugin: 'Plugin',
      config: '配置文件',
      document: '知识文档',
      error: '错误记录',
    };
    return typeMap[selectedNode.type] || selectedNode.type;
  };

  // 获取轨道名称
  const getOrbitName = (orbit?: number) => {
    if (!orbit) return '未分配';
    const orbitNames = ['内环', '中环', '外环'];
    return orbitNames[orbit - 1] || `轨道 ${orbit}`;
  };

  // 计算连接数量
  const connectionCount = connections.filter(
    (conn) => conn.source === selectedNode.id || conn.target === selectedNode.id
  ).length;

  return (
    <div
      className="absolute right-6 top-24 bottom-6 w-96 flex flex-col"
      style={{
        background: 'rgba(26, 31, 58, 0.7)', // 深蓝黑半透明
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', // Safari 兼容
        border: '1px solid rgba(91, 142, 255, 0.3)', // 蓝色半透明边框
        borderRadius: '16px',
        boxShadow: '0 8px 32px 0 rgba(10, 14, 39, 0.37)',
      }}
    >
      {/* 标题栏 */}
      <div
        className="flex items-center justify-between p-4"
        style={{
          borderBottom: '1px solid rgba(91, 142, 255, 0.2)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* 节点颜色指示器 */}
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: colorScheme.primary,
              boxShadow: `0 0 8px ${colorScheme.glow}`,
            }}
          />
          <h3
            className="text-sm font-medium tracking-wide"
            style={{ color: '#E6F1FF' }}
          >
            节点详情
          </h3>
        </div>
        <button
          onClick={() => setSelectedNode(null)}
          className="transition-all duration-200 hover:scale-110"
          style={{ color: '#7AA2FF' }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* 节点标题和类型 */}
        <div>
          <h2
            className="text-xl font-medium mb-3"
            style={{ color: '#FFFFFF' }}
          >
            {selectedNode.title}
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            {/* 类型徽章 */}
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: `${colorScheme.primary}20`,
                color: colorScheme.primary,
                border: `1px solid ${colorScheme.primary}40`,
              }}
            >
              {getTypeText()}
            </span>
            {/* 轨道徽章 */}
            {selectedNode.orbit && (
              <span
                className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                style={{
                  background: 'rgba(122, 162, 255, 0.15)',
                  color: '#7AA2FF',
                  border: '1px solid rgba(122, 162, 255, 0.3)',
                }}
              >
                <Layers className="w-3 h-3" />
                {getOrbitName(selectedNode.orbit)}
              </span>
            )}
          </div>
        </div>

        {/* 描述 */}
        {selectedNode.description && (
          <div>
            <div
              className="text-xs font-medium mb-2 tracking-wide"
              style={{ color: '#8BA3C7' }}
            >
              描述
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: '#C7D5E8' }}
            >
              {selectedNode.description}
            </p>
          </div>
        )}

        {/* 连接信息 */}
        <div>
          <div
            className="text-xs font-medium mb-2 tracking-wide"
            style={{ color: '#8BA3C7' }}
          >
            连接
          </div>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: '#7AA2FF' }}
          >
            <span className="font-medium">{connectionCount}</span>
            <span style={{ color: '#8BA3C7' }}>个关联节点</span>
          </div>
        </div>

        {/* 元数据 */}
        {selectedNode.metadata && (
          <div className="space-y-2">
            <div
              className="text-xs font-medium mb-2 tracking-wide"
              style={{ color: '#8BA3C7' }}
            >
              元数据
            </div>

            {/* 创建时间 */}
            {selectedNode.metadata.created && (
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="w-3.5 h-3.5" style={{ color: '#8BA3C7' }} />
                <span style={{ color: '#8BA3C7' }}>创建:</span>
                <span className="font-mono" style={{ color: '#7AA2FF' }}>
                  {formatDate(selectedNode.metadata.created)}
                </span>
              </div>
            )}

            {/* 修改时间 */}
            {selectedNode.metadata.modified && (
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="w-3.5 h-3.5" style={{ color: '#8BA3C7' }} />
                <span style={{ color: '#8BA3C7' }}>修改:</span>
                <span className="font-mono" style={{ color: '#7AA2FF' }}>
                  {formatDate(selectedNode.metadata.modified)}
                </span>
              </div>
            )}

            {/* 文件大小 */}
            {selectedNode.metadata.size && (
              <div className="flex items-center gap-2 text-xs">
                <File className="w-3.5 h-3.5" style={{ color: '#8BA3C7' }} />
                <span style={{ color: '#8BA3C7' }}>大小:</span>
                <span className="font-mono" style={{ color: '#7AA2FF' }}>
                  {(selectedNode.metadata.size / 1024).toFixed(2)} KB
                </span>
              </div>
            )}

            {/* 重要性进度条 */}
            {selectedNode.metadata.importance !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: '#8BA3C7' }}>重要性</span>
                  <span className="font-mono" style={{ color: '#7AA2FF' }}>
                    {(selectedNode.metadata.importance * 100).toFixed(0)}%
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(122, 162, 255, 0.15)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${selectedNode.metadata.importance * 100}%`,
                      background: 'linear-gradient(90deg, #5B8EFF 0%, #7AA2FF 100%)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 文件路径 */}
        {selectedNode.filePath && (
          <div>
            <div
              className="text-xs font-medium mb-2 tracking-wide"
              style={{ color: '#8BA3C7' }}
            >
              文件路径
            </div>
            <div
              className="font-mono text-xs p-2.5 rounded break-all"
              style={{
                background: 'rgba(10, 14, 39, 0.5)',
                color: '#7AA2FF',
                border: '1px solid rgba(91, 142, 255, 0.2)',
              }}
            >
              {selectedNode.filePath}
            </div>
          </div>
        )}

        {/* 标签 */}
        {selectedNode.tags && selectedNode.tags.length > 0 && (
          <div>
            <div
              className="flex items-center gap-2 text-xs font-medium mb-2 tracking-wide"
              style={{ color: '#8BA3C7' }}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>标签</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedNode.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-medium rounded-full"
                  style={{
                    background: 'rgba(91, 142, 255, 0.15)',
                    color: '#7AA2FF',
                    border: '1px solid rgba(91, 142, 255, 0.3)',
                  }}
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
            <div
              className="text-xs font-medium mb-2 tracking-wide"
              style={{ color: '#8BA3C7' }}
            >
              内容预览
            </div>
            <pre
              className="text-xs p-3 rounded overflow-x-auto whitespace-pre-wrap"
              style={{
                background: 'rgba(10, 14, 39, 0.5)',
                color: '#C7D5E8',
                border: '1px solid rgba(91, 142, 255, 0.2)',
              }}
            >
              {selectedNode.content.slice(0, 500)}
              {selectedNode.content.length > 500 && '...'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
