'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useKnowledgeStore } from '@/stores/useKnowledgeStore';
import { Vector3 } from 'three';

export default function Camera() {
  const { camera } = useThree();
  const { selectedNode, cameraTarget } = useKnowledgeStore();

  // 聚焦到选中节点
  useEffect(() => {
    if (selectedNode && camera) {
      const target = new Vector3(...selectedNode.position);
      const offset = new Vector3(0, 5, 10);
      const newPosition = target.clone().add(offset);

      // 平滑过渡到新位置（简单实现，后续可以使用 gsap）
      const duration = 1000;
      const startPos = camera.position.clone();
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

        camera.position.lerpVectors(startPos, newPosition, eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [selectedNode, camera]);

  // 相机预设位置
  useEffect(() => {
    if (cameraTarget && camera) {
      const positions: { [key: string]: [number, number, number] } = {
        home: [0, 20, 40],
        top: [0, 50, 0],
        side: [50, 10, 0],
        front: [0, 10, 50],
      };

      const targetPos = positions[cameraTarget];
      if (targetPos) {
        camera.position.set(...targetPos);
      }
    }
  }, [cameraTarget, camera]);

  return null;
}
