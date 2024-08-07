import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const MirrorBall: React.FC = () => {
  const ballRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ballRef.current) {
      ballRef.current.rotation.y += 0.01;
    }
  });

  // 무지개 텍스처 생성
  const rainbowTexture = generateRainbowTexture();
  if (!rainbowTexture) {
    return null; // 텍스처 생성 실패 시 null 반환
  }

  return (
    <mesh ref={ballRef} position={[0, 3, 0]} scale={[0.2, 0.2, 0.2]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial map={rainbowTexture} metalness={0.7} roughness={0.1} />
    </mesh>
  );
};

// 무지개 텍스처 생성 함수
const generateRainbowTexture = (): THREE.CanvasTexture | null => {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) return null;

  const gradient = context.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, 'red');
  gradient.addColorStop(0.16, 'orange');
  gradient.addColorStop(0.32, 'yellow');

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
};
