import fs from 'fs';
import path from 'path';

export interface SkillInfo {
  id: string;
  name: string;
  path: string;
  category: string;
  description: string;
}

/**
 * 从本地 .claude/skills 目录扫描所有 skills
 */
export async function loadLocalSkills(basePath?: string): Promise<SkillInfo[]> {
  const skillsPath = basePath || path.join(process.env.HOME || process.env.USERPROFILE || '', '.claude', 'skills');

  const skills: SkillInfo[] = [];

  try {
    // 递归扫描目录
    const scanDirectory = (dirPath: string, category: string = 'general') => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // 递归扫描子目录
          scanDirectory(fullPath, entry.name);
        } else if (entry.name.endsWith('.md')) {
          // 读取 skill 文件
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n');

            // 提取第一行作为描述（通常是标题）
            let description = 'No description';
            for (const line of lines) {
              if (line.startsWith('#')) {
                description = line.replace(/^#+\s*/, '').trim();
                break;
              }
            }

            const skillName = entry.name.replace('.md', '');

            skills.push({
              id: `skill-${skills.length + 1}`,
              name: skillName,
              path: fullPath,
              category: category,
              description: description.substring(0, 100), // 限制长度
            });
          } catch (error) {
            console.error(`Error reading skill file ${fullPath}:`, error);
          }
        }
      }
    };

    if (fs.existsSync(skillsPath)) {
      scanDirectory(skillsPath);
    }
  } catch (error) {
    console.error('Error loading skills:', error);
  }

  return skills;
}

/**
 * 模拟数据（用于客户端）
 */
export function getMockSkills(): SkillInfo[] {
  return [
    { id: '1', name: 'agent-browser', category: 'automation', path: '', description: 'Browser automation agent' },
    { id: '2', name: 'literature-review', category: 'research', path: '', description: 'Conduct comprehensive literature review' },
    { id: '3', name: 'skill-seeker', category: 'development', path: '', description: 'Skill Seeker - Automatically find skills' },
    { id: '4', name: 'processing-creative', category: 'creative', path: '', description: 'Creative coding with Processing' },
    { id: '5', name: 'remotion-dev', category: 'video', path: '', description: 'Remotion video development' },
  ];
}
