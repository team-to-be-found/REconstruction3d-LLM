'use client';

import { useKnowledgeStore } from '@/stores/useKnowledgeStore';
import { Server, Zap, Puzzle, CheckCircle, XCircle } from 'lucide-react';

/**
 * Claude配置信息面板
 * 显示Skills、MCP、Plugins的加载状态和统计信息
 */
export default function ClaudeConfigPanel() {
  const { claudeConfig, claudeConfigStats } = useKnowledgeStore();

  if (!claudeConfigStats) {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-4 w-80 bg-black/90 backdrop-blur-md border border-cyan-500/40 p-4 rounded-lg">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyan-500/30">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <h3 className="text-cyan-400 font-mono text-sm font-bold">CLAUDE CONFIG</h3>
      </div>

      {/* 统计信息 */}
      <div className="space-y-3">
        {/* Skills */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-gray-300 text-sm font-mono">Skills</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-sm font-mono">
              {claudeConfigStats.enabledSkills}
            </span>
            <span className="text-gray-500 text-sm">/</span>
            <span className="text-gray-400 text-sm font-mono">
              {claudeConfigStats.totalSkills}
            </span>
            {claudeConfigStats.enabledSkills > 0 ? (
              <CheckCircle className="w-3 h-3 text-green-400" />
            ) : (
              <XCircle className="w-3 h-3 text-red-400" />
            )}
          </div>
        </div>

        {/* MCPs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-300 text-sm font-mono">MCP Servers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 text-sm font-mono">
              {claudeConfigStats.enabledMCPs}
            </span>
            <span className="text-gray-500 text-sm">/</span>
            <span className="text-gray-400 text-sm font-mono">
              {claudeConfigStats.totalMCPs}
            </span>
            {claudeConfigStats.enabledMCPs > 0 ? (
              <CheckCircle className="w-3 h-3 text-cyan-400" />
            ) : (
              <XCircle className="w-3 h-3 text-red-400" />
            )}
          </div>
        </div>

        {/* Plugins */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Puzzle className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-300 text-sm font-mono">Plugins</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-sm font-mono">
              {claudeConfigStats.enabledPlugins}
            </span>
            <span className="text-gray-500 text-sm">/</span>
            <span className="text-gray-400 text-sm font-mono">
              {claudeConfigStats.totalPlugins}
            </span>
            {claudeConfigStats.enabledPlugins > 0 ? (
              <CheckCircle className="w-3 h-3 text-yellow-400" />
            ) : (
              <XCircle className="w-3 h-3 text-red-400" />
            )}
          </div>
        </div>
      </div>

      {/* 知识库路径 */}
      {claudeConfig?.knowledgeBasePath && (
        <div className="mt-4 pt-3 border-t border-cyan-500/30">
          <div className="text-xs text-gray-500 font-mono">Knowledge Base:</div>
          <div className="text-xs text-cyan-400/60 font-mono truncate mt-1">
            {claudeConfig.knowledgeBasePath}
          </div>
        </div>
      )}

      {/* 角落装饰 */}
      <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-cyan-400" />
      <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-cyan-400" />
    </div>
  );
}
