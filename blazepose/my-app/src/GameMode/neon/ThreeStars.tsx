import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const worker = new Worker(new URL('./ThreeStarsWorker.ts', import.meta.url));

const ThreeStars: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

    const starVertices: number[] = [];
    for (let i = 0; i < 1000; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    camera.position.z = 1;

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    starsRef.current = stars;

    const handleWorkerMessages = (event: MessageEvent) => {
      if (event.data.action === 'updateStars') {
        const { rotationX, rotationY } = event.data;
        stars.rotation.x = rotationX;
        stars.rotation.y = rotationY;
        renderer.render(scene, camera);
      }
    };

    worker.onmessage = handleWorkerMessages;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    worker.postMessage({ action: 'start' });

    return () => {
      mount.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
      worker.terminate();
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

export default React.memo(ThreeStars);
