'use client';

import { useState, useEffect } from 'react';
import { Package, Zap, Puzzle, X, Search, Settings as SettingsIcon } from 'lucide-react';

interface MCPServer {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  description: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
}

interface Plugin {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
}

export default function ManagementPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'mcp' | 'skills' | 'plugins'>('skills');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [mcpServers] = useState<MCPServer[]>([
    { id: '1', name: 'Bytebase', status: 'active', description: 'SQL Database Management' },
    { id: '2', name: 'Honeycomb', status: 'active', description: 'Monitoring & Tracing' },
    { id: '3', name: 'Playwright', status: 'active', description: 'Browser Automation' },
    { id: '4', name: 'Chart', status: 'inactive', description: 'Chart Generation' },
  ]);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [plugins] = useState<Plugin[]>([
    { id: '1', name: 'backend-development', version: '1.0.0', enabled: true },
    { id: '2', name: 'frontend-mobile-development', version: '1.0.0', enabled: true },
    { id: '3', name: 'security-scanning', version: '1.0.0', enabled: true },
    { id: '4', name: 'cloud-infrastructure', version: '1.0.0', enabled: false },
  ]);

  useEffect(() => {
    if (isOpen && activeTab === 'skills' && skills.length === 0) {
      loadSkills();
    }
  }, [isOpen, activeTab]);

  const loadSkills = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/skills');
      const data = await response.json();
      const loadedSkills: Skill[] = data.skills.map((skill: any, index: number) => ({
        id: skill.id || String(index + 1),
        name: skill.name,
        category: skill.category || 'general',
        enabled: Math.random() > 0.3,
      }));
      setSkills(loadedSkills);
    } catch (error) {
      console.error('Failed to load skills:', error);
      setSkills([
        { id: '1', name: 'commit', category: 'git', enabled: true },
        { id: '2', name: 'create-pr', category: 'git', enabled: true },
        { id: '3', name: 'code-review', category: 'development', enabled: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 border-2 border-cyan-400 bg-black hover:bg-cyan-500/20 transition-all z-50 relative group"
        title="Open Management Panel"
      >
        <SettingsIcon className="w-6 h-6 text-cyan-400" />
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[85vh] bg-black/95 border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 flex flex-col overflow-hidden relative">
        {/* HUD Corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 pointer-events-none z-10" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 pointer-events-none z-10" />

        {/* Header */}
        <div className="p-6 border-b border-cyan-500/30 bg-black/60 relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-cyan-400 animate-pulse" />
                  <div className="w-2 h-3 bg-cyan-400/60" />
                  <div className="w-1 h-3 bg-cyan-400/30" />
                </div>
                <h2 className="text-2xl font-bold text-cyan-400 font-mono tracking-wider">
                  MANAGEMENT_PANEL
                </h2>
              </div>
              <p className="text-sm text-cyan-400/60 font-mono">SYSTEM_V2.0_CONTROL_INTERFACE</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2.5 border border-magenta-500/60 bg-black/60 hover:bg-magenta-500/10 transition-all relative"
            >
              <X className="w-5 h-5 text-magenta-400" />
              <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-magenta-400" />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-magenta-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {[
              { key: 'mcp', icon: Package, label: 'MCP_SERVERS' },
              { key: 'skills', icon: Zap, label: 'SKILLS', count: skills.length },
              { key: 'plugins', icon: Puzzle, label: 'PLUGINS' },
            ].map(({ key, icon: Icon, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 px-4 py-2.5 transition-all relative font-mono text-sm ${
                  activeTab === key
                    ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-400'
                    : 'bg-black/40 text-cyan-400/60 border border-cyan-500/30 hover:bg-cyan-500/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {count !== undefined && count > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-magenta-500/20 border border-magenta-400/40 text-magenta-400 text-xs">
                    {count}
                  </span>
                )}
                {activeTab === key && (
                  <>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4 gap-4">
                <div className="flex-1 relative">
                  <div className="border border-cyan-500/40 bg-black/60 relative">
                    <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-cyan-400" />
                    <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-cyan-400" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                    <input
                      type="text"
                      placeholder=">> SEARCH_SKILLS_"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-transparent text-cyan-400 placeholder-cyan-400/40 font-mono text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-cyan-400/70 text-sm font-mono">
                  <span>{filteredSkills.length}</span>
                  <span>/</span>
                  <span>{skills.length}</span>
                  <span className="text-cyan-400/50">SKILLS</span>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12 text-cyan-400 font-mono">
                  <div className="animate-pulse">LOADING_SKILLS...</div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                  {filteredSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-3 bg-black/60 border border-cyan-500/30 hover:border-cyan-500/50 transition-all relative group"
                    >
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 border-2 border-cyan-400 bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-mono text-sm text-cyan-400 truncate">{skill.name}</h3>
                            <p className="text-xs text-cyan-400/50 font-mono">[{skill.category.toUpperCase()}]</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={skill.enabled}
                              onChange={() => {}}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-black border border-cyan-500/40 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[1px] after:start-[1px] after:bg-cyan-400 after:border-cyan-400 after:border after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500/20 peer-checked:border-cyan-400"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MCP & Plugins tabs - placeholder */}
          {activeTab === 'mcp' && (
            <div className="text-cyan-400 font-mono">MCP_SERVERS_PANEL</div>
          )}
          {activeTab === 'plugins' && (
            <div className="text-cyan-400 font-mono">PLUGINS_PANEL</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-500/30 bg-black/60 flex justify-end gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-black/60 border border-gray-600 text-gray-400 hover:bg-black/80 transition-all font-mono text-sm"
          >
            CLOSE
          </button>
          <button className="px-4 py-2 bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-500/30 transition-all font-mono text-sm relative">
            SAVE_CHANGES
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
