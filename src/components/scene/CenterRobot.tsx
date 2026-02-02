'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export default function CenterRobot() {
  const robotRef = useRef<Mesh>(null);
  const headRef = useRef<Mesh>(null);
  const leftArmRef = useRef<Mesh>(null);
  const rightArmRef = useRef<Mesh>(null);

  // 🌬️ 呼吸 + 悬浮动画（Phase 4.1）
  useFrame((state) => {
    if (robotRef.current) {
      // 🫁 呼吸效果：周期性缩放（3% 振幅）
      const breathScale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
      robotRef.current.scale.setScalar(breathScale);

      // 🎈 悬浮动画
      robotRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      robotRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }

    // 🎭 头部轻微摆动
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }

    // 👋 手臂摆动
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.5;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -Math.sin(state.clock.elapsedTime * 1.5) * 0.5;
    }
  });

  return (
    <group ref={robotRef} position={[0, 0, 0]}>
      {/* 身体 - 主体（深空配色） */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 2, 1]} />
        <meshStandardMaterial
          color="#5B8EFF"  // 中蓝色
          metalness={0.8}
          roughness={0.2}
          emissive="#4A5FC1"  // 深蓝紫发光
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 头部 */}
      <group ref={headRef} position={[0, 1.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 1, 1]} />
          <meshStandardMaterial
            color="#7AA2FF"  // 浅蓝色
            metalness={0.9}
            roughness={0.1}
            emissive="#5B8EFF"  // 中蓝色发光
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* 眼睛 - 左（柔和的蓝光） */}
        <mesh position={[-0.3, 0.1, 0.51]}>
          <circleGeometry args={[0.15, 16]} />
          <meshStandardMaterial
            color="#7AA2FF"
            emissive="#7AA2FF"
            emissiveIntensity={2}
          />
        </mesh>

        {/* 眼睛 - 右 */}
        <mesh position={[0.3, 0.1, 0.51]}>
          <circleGeometry args={[0.15, 16]} />
          <meshStandardMaterial
            color="#7AA2FF"
            emissive="#7AA2FF"
            emissiveIntensity={2}
          />
        </mesh>

        {/* 天线（金属色保持） */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
          <meshStandardMaterial color="#8BA3C7" metalness={1} roughness={0} />
        </mesh>
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#5B8EFF"  // 蓝色灯
            emissive="#5B8EFF"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* 左手臂（深空配色） */}
      <group ref={leftArmRef} position={[-1, 0.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 1.5, 0.4]} />
          <meshStandardMaterial
            color="#5B8EFF"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* 左手 */}
        <mesh position={[0, -0.9, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#7AA2FF"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* 右手臂 */}
      <group ref={rightArmRef} position={[1, 0.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 1.5, 0.4]} />
          <meshStandardMaterial
            color="#5B8EFF"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* 右手 */}
        <mesh position={[0, -0.9, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#7AA2FF"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* 腿部底座 */}
      <mesh position={[0, -1.5, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.6, 1, 16]} />
        <meshStandardMaterial
          color="#4A5FC1"  // 深蓝紫
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* 能量环 - 装饰（深空配色） */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[2, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#7AA2FF"  // 浅蓝色
          emissive="#7AA2FF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 外层能量环 */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#5B8EFF"  // 中蓝色
          emissive="#5B8EFF"
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* 底部光环 */}
      <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.2, 32]} />
        <meshStandardMaterial
          color="#7AA2FF"  // 浅蓝色
          emissive="#7AA2FF"
          emissiveIntensity={1}
          transparent
          opacity={0.5}
          side={2}
        />
      </mesh>
    </group>
  );
}
