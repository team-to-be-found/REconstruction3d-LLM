'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 🌌 深空背景系统（Phase 2.3）
 *
 * 设计规范来自 DESIGN_SPEC.md:
 * - 深蓝黑渐变（#0A0E27 → #1A1F3A）
 * - 微弱噪声纹理（5-10% opacity）
 * - 3 层 Parallax 景深效果
 * - 极少量远景粒子（避免廉价感）
 * - "Quiet, Intelligent, Confident" 美学
 */
export default function SpaceBackground() {
  const distantStarsRef = useRef<THREE.Points>(null);
  const midStarsRef = useRef<THREE.Points>(null);
  const nearStarsRef = useRef<THREE.Points>(null);
  const noiseRef = useRef<THREE.Points>(null);

  // 🌌 Layer 1: 远景粒子（极少，150 半径）
  const distantStars = useMemo(() => {
    const positions = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      const radius = 150 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  // 🌌 Layer 2: 中景粒子（100 半径）
  const midStars = useMemo(() => {
    const positions = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      const radius = 100 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  // 🌌 Layer 3: 近景粒子（60 半径）
  const nearStars = useMemo(() => {
    const positions = new Float32Array(15 * 3);
    for (let i = 0; i < 15; i++) {
      const radius = 60 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  // ✨ 噪声纹理粒子（200个微小粒子）
  const noise = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 50; // 靠后
    }
    return positions;
  }, []);

  // Parallax 动画（不同层级不同速度）
  useFrame(() => {
    if (distantStarsRef.current) {
      distantStarsRef.current.rotation.y += 0.0001; // 最慢
    }
    if (midStarsRef.current) {
      midStarsRef.current.rotation.y += 0.0002;
    }
    if (nearStarsRef.current) {
      nearStarsRef.current.rotation.y += 0.0003; // 最快
    }
    if (noiseRef.current) {
      noiseRef.current.rotation.z += 0.00005; // 极缓慢旋转
    }
  });

  return (
    <>
      {/* 背景色 - 深蓝黑渐变基调 */}
      <color attach="background" args={['#0A0E27']} />
      <fog attach="fog" args={['#1A1F3A', 100, 200]} />

      {/* 远景粒子（最远层，最少数量） */}
      <Points
        ref={distantStarsRef}
        positions={distantStars}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#4A5FC1" // 深蓝紫
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.3} // 低饱和度
        />
      </Points>

      {/* 中景粒子 */}
      <Points
        ref={midStarsRef}
        positions={midStars}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#5B8EFF" // 中蓝色
          size={0.12}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>

      {/* 近景粒子（最少） */}
      <Points
        ref={nearStarsRef}
        positions={nearStars}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#7AA2FF" // 浅蓝色
          size={0.1}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.5}
        />
      </Points>

      {/* 噪声纹理层（微弱） */}
      <Points
        ref={noiseRef}
        positions={noise}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#1A1F3A" // 深蓝灰
          size={0.05}
          sizeAttenuation={false}
          depthWrite={false}
          opacity={0.08} // 5-10% 噪声强度
        />
      </Points>

      {/* 环境光 - 提高强度以支持 meshStandardMaterial */}
      <ambientLight intensity={0.5} color="#1A2F4A" />

      {/* 主光源 - 柔和的白光（模拟远方星光） */}
      <directionalLight
        position={[20, 20, 10]}
        intensity={0.8}
        color="#E6F1FF"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* 辅助光源 - 冷色调填充光 */}
      <directionalLight
        position={[-15, -10, -10]}
        intensity={0.3}
        color="#4A5FC1"
      />

      {/* 背景点光源（克制的点缀） */}
      <pointLight
        position={[0, 40, -80]}
        intensity={0.2}
        color="#5B8EFF"
        distance={120}
      />
    </>
  );
}
