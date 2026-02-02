import { NextResponse } from 'next/server';
import { loadLocalSkills, getMockSkills } from '@/utils/skillsLoader';

export async function GET() {
  try {
    // 尝试从本地加载 skills
    const skills = await loadLocalSkills();

    // 如果没有找到 skills，返回模拟数据
    if (skills.length === 0) {
      return NextResponse.json({
        skills: getMockSkills(),
        source: 'mock',
        message: 'Using mock data. Local skills not found.',
      });
    }

    return NextResponse.json({
      skills,
      source: 'local',
      count: skills.length,
    });
  } catch (error) {
    console.error('Error loading skills:', error);
    return NextResponse.json(
      {
        skills: getMockSkills(),
        source: 'mock',
        error: String(error),
      },
      { status: 500 }
    );
  }
}
