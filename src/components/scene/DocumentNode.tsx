'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Text } from '@react-three/drei';
import type { KnowledgeNode } from '@/types/knowledge';
import { useKnowledgeStore } from '@/stores/useKnowledgeStore';

interface DocumentNodeProps {
  node: KnowledgeNode;
}

export default function DocumentNode({ node }: DocumentNodeProps) {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { selectedNode, setSelectedNode } = useKnowledgeStore();
  const isSelected = selectedNode?.id === node.id;

  // 悬浮动画和脉冲效果
  useFrame((state) => {
    if (meshRef.current) {
      // 持续旋转
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;

      // 悬浮动画
      const offset = Math.sin(state.clock.elapsedTime * 1.5 + parseFloat(node.id.split('-')[1] || '0') * 0.5) * 0.3;
      meshRef.current.position.y = node.position[1] + offset;

      // 选中或悬停时的脉冲
      if (isSelected || hovered) {
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.15;
        meshRef.current.scale.setScalar(node.visual.size * pulse * 1.2);
      } else {
        meshRef.current.scale.setScalar(node.visual.size);
      }
    }

    // 外发光旋转
    if (glowRef.current) {
      glowRef.current.rotation.z += 0.02;
      const glowPulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      glowRef.current.scale.setScalar(glowPulse);
    }
  });

  const handleClick = () => {
    setSelectedNode(isSelected ? null : node);
  };

  // 根据形状类型渲染不同的几何体
  const renderGeometry = () => {
    switch (node.visual.shape) {
      case 'sphere':
        return <sphereGeometry args={[1, 32, 32]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1.2, 0]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.6, 0.6, 1.8, 32]} />;
      case 'torus':
        return <torusGeometry args={[0.9, 0.35, 16, 100]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[1.1, 0]} />;
      case 'cube':
        return <boxGeometry args={[1.6, 1.6, 1.6]} />;
      default:
        return <sphereGeometry args={[1, 32, 32]} />;
    }
  };

  return (
    <group position={node.position}>
      {/* 外发光环 */}
      <mesh ref={glowRef}>
        <ringGeometry args={[1.8, 2.2, 32]} />
        <meshBasicMaterial
          color={node.visual.color}
          transparent
          opacity={isSelected || hovered ? 0.6 : 0.3}
        />
      </mesh>

      {/* 主节点 */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        {renderGeometry()}
        <meshStandardMaterial
          color={node.visual.color}
          metalness={0.8}
          roughness={0.1}
          emissive={node.visual.color}
          emissiveIntensity={node.visual.glow || hovered || isSelected ? 1.2 : 0.5}
        />
      </mesh>

      {/* 粒子环效果 */}
      {(isSelected || hovered) && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2, 2.5, 32]} />
            <meshBasicMaterial
              color="#00FFFF"
              transparent
              opacity={0.8}
              side={2}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <ringGeometry args={[2.2, 2.6, 32]} />
            <meshBasicMaterial
              color={node.visual.color}
              transparent
              opacity={0.5}
              side={2}
            />
          </mesh>
        </>
      )}

      {/* 标签（选中或悬停时显示） */}
      {(isSelected || hovered) && (
        <>
          <Text
            position={[0, 2.5, 0]}
            fontSize={0.6}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="#000000"
            fontWeight="bold"
          >
            {node.title}
          </Text>
          <Text
            position={[0, 1.8, 0]}
            fontSize={0.3}
            color="#AAAAAA"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000000"
          >
            {node.type.toUpperCase()}
          </Text>
        </>
      )}
    </group>
  );
}
