// Claude配置相关类型定义

export interface ClaudeSkill {
  name: string;
  description?: string;
  category?: string;
  path: string;
  enabled: boolean;
}

export interface ClaudeMCP {
  name: string;
  description?: string;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  enabled: boolean;
}

export interface ClaudePlugin {
  name: string;
  version?: string;
  description?: string;
  path: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface ClaudeConfig {
  skills: ClaudeSkill[];
  mcps: ClaudeMCP[];
  plugins: ClaudePlugin[];
  knowledgeBasePath: string;
}

export interface ClaudeConfigStats {
  totalSkills: number;
  enabledSkills: number;
  totalMCPs: number;
  enabledMCPs: number;
  totalPlugins: number;
  enabledPlugins: number;
}
