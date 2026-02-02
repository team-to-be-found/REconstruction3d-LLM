'use client';

import { useRef, useEffect, useState } from 'react';
import { Mesh, Group } from 'three';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { KnowledgeNode } from '@/types/knowledge';
import { useKnowledgeStore } from '@/stores/useKnowledgeStore';
import { getColorByType } from '@/utils/colors';

interface PlanetNodeProps {
  node: KnowledgeNode;
}

export default function PlanetNode({ node }: PlanetNodeProps) {
  const groupRef = useRef<Group>(null);
  const planetRef = useRef<Mesh>(null);
  const { selectedNode, setSelectedNode, hoveredNode, setHoveredNode } = useKnowledgeStore();

  const isSelected = selectedNode?.id === node.id;
  const isHovered = hoveredNode?.id === node.id;
  const isDimmed = hoveredNode !== null && !isSelected && !isHovered;

  // 🎨 获取语义颜色
  const colorScheme = getColorByType(node.type);

  // 📏 根据轨道和类型决定尺寸（调整为更小，更合理）
  const getSize = () => {
    // Category 节点（第一轨道）最大
    if (node.type === 'category') {
      return 1.8;
    }
    // Skill 和 MCP（第二轨道）中等
    if (node.type === 'skill' || node.type === 'mcp') {
      return 1.2;
    }
    // Plugin 和其他（第三轨道）小
    return 0.8;
  };

  const planetSize = getSize();

  // 🎭 Hover 状态管理
  const [hoverScale, setHoverScale] = useState(1);

  useEffect(() => {
    if (isHovered) {
      setHoverScale(1.15); // Hover 时放大 15%
    } else {
      setHoverScale(1);
    }
  }, [isHovered]);

  // 🎪 点击处理
  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedNode(isSelected ? null : node);
  };

  // 🎪 Hover 处理
  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHoveredNode(node);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHoveredNode(null);
    document.body.style.cursor = 'auto';
  };

  // 🌊 极轻微悬浮动画（振幅减小，更稳重像星球）
  useFrame((state) => {
    if (groupRef.current && !isSelected) {
      // 极轻微的浮动，避免"气球感"
      groupRef.current.position.y =
        node.position[1] + Math.sin(state.clock.elapsedTime * 0.5 + node.position[0]) * 0.05;
    }
  });

  // 🧹 内存清理
  useEffect(() => {
    return () => {
      if (planetRef.current) {
        const mesh = planetRef.current;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      }

      if (groupRef.current) {
        groupRef.current.traverse((child: any) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material: any) => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
    };
  }, []);

  // 🎨 决定几何体（不同层级不同形状）
  const getGeometry = () => {
    if (node.type === 'category') {
      // Category 使用八面体（更有层次感）
      return <octahedronGeometry args={[planetSize, 0]} />;
    }
    // 其他使用球体
    return <sphereGeometry args={[planetSize, 32, 32]} />;
  };

  return (
    <group
      ref={groupRef}
      position={node.position}
      scale={hoverScale}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 星球本体：使用 meshStandardMaterial + 语义颜色 */}
      <mesh ref={planetRef} castShadow receiveShadow>
        {getGeometry()}
        <meshStandardMaterial
          color={colorScheme.primary}
          roughness={0.6}                // 更粗糙，像真实星球表面
          metalness={0.2}                // 轻微金属感，增加质感
          transparent={isDimmed}         // 只在 dim 时透明
          opacity={isDimmed ? 0.3 : 1.0} // 正常状态完全不透明
          emissive={colorScheme.glow}    // 自发光（弱）
          emissiveIntensity={isHovered ? 0.3 : 0.15} // Hover 时增强 glow（降低强度）
        />
      </mesh>

      {/* 大气层 - 发光外壳（极克制，避免气球感） */}
      {!isDimmed && (isSelected || isHovered) && (
        <mesh>
          <sphereGeometry args={[planetSize * 1.1, 24, 24]} />
          <meshBasicMaterial
            color={colorScheme.glow}
            transparent
            opacity={isSelected ? 0.15 : 0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* 选中效果 - HUD 圆环 */}
      {isSelected && (
        <>
          {/* 水平圆环 */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[planetSize * 1.3, 0.08, 16, 32]} />
            <meshBasicMaterial
              color={colorScheme.secondary}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* 垂直圆环 */}
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[planetSize * 1.3, 0.08, 16, 32]} />
            <meshBasicMaterial
              color={colorScheme.secondary}
              transparent
              opacity={0.6}
            />
          </mesh>
        </>
      )}

      {/* 文字标签 - 只在 Hover 或 Selected 时显示（最多 2 行） */}
      {(isHovered || isSelected) && (
        <Text
          position={[0, planetSize + 1.2, 0]}
          fontSize={0.6}
          color={colorScheme.glow}
          anchorX="center"
          anchorY="bottom"
          font="/fonts/Orbitron-Bold.ttf"
          outlineWidth={0.05}
          outlineColor="#000000"
          maxWidth={8}
          textAlign="center"
          // 限制为 2 行
          text={
            node.title.length > 30
              ? node.title.substring(0, 30) + '...'
              : node.title
          }
        />
      )}

      {/* 轨道编号指示器（调试用，可选） */}
      {process.env.NODE_ENV === 'development' && isHovered && node.orbit && (
        <Text
          position={[0, -planetSize - 0.8, 0]}
          fontSize={0.4}
          color="#666666"
          anchorX="center"
          anchorY="top"
        >
          Orbit {node.orbit}
        </Text>
      )}
    </group>
  );
}
