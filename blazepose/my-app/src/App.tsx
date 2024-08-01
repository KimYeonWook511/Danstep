// import React, { useRef, useEffect, useState } from 'react';
// import { Canvas, useThree, extend } from '@react-three/fiber';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import { Pose, POSE_CONNECTIONS, Results } from '@mediapipe/pose';
// import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
// import * as THREE from 'three';

// // FBXLoader를 React Three Fiber에서 사용할 수 있도록 확장
// extend({ FBXLoader });

// const PoseDetection: React.FC = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const pose = useRef<Pose | null>(null);
//   const modelRef = useRef<THREE.Group | null>(null);
//   const [modelLoaded, setModelLoaded] = useState<boolean>(false);

//   useEffect(() => {
//     const initializePose = async () => {
//       const videoElement = videoRef.current;
//       const canvasElement = canvasRef.current;
//       console.log(1)
//       if (!videoElement || !canvasElement) return;

//       // 웹캠 스트림 설정
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoElement.srcObject = stream;
//       console.log(2)
//       // 비디오가 로드되면 재생 시작
//       videoElement.onloadeddata = async () => {
//         console.log(3)
//         await videoElement.play();

//         pose.current = new Pose({
//           locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
//         });

//         pose.current.setOptions({
//           modelComplexity: 1,
//           smoothLandmarks: true,
//           enableSegmentation: false,
//           smoothSegmentation: false,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5,
//         });

//         const onResults = (results: Results) => {
//           console.log(4)
//           const canvasCtx = canvasElement.getContext('2d');
//           if (!canvasCtx) return;
          
//           canvasCtx.save();
//           canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

//           // Draw the video frame
//           canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

//           console.log(results);
//           console.log(results.poseLandmarks);
//           // Draw landmarks and connectors
//           if (results.poseLandmarks) {
//             console.log(results.poseLandmarks);
//             drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
//             drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });

//             if (modelRef.current) {
//               // 모델을 포즈 랜드마크 위치에 매핑
//               const nose = results.poseLandmarks[0];
//               modelRef.current.position.set(nose.x * 2 - 1, -nose.y * 2 + 1, -1); // Three.js 좌표로 변환
//               modelRef.current.scale.set(0.5, 0.5, 0.5); // 모델 크기 조정
//             }
//           }

//           canvasCtx.restore();
//         };

//         pose.current.onResults(onResults);

//         const detectPose = async () => {
//           if (!pose.current) {
//             console.log("pose current === false");
//             return;
//           }
//           await pose.current.send({ image: videoElement });
//           requestAnimationFrame(detectPose);
//         };

//         detectPose();
//       };
//     };

//     initializePose();
//   }, []);

//   return (
//     <div>
//       <video
//         ref={videoRef}
//         style={{ display: 'none' }}
//       ></video>
//       <canvas
//         ref={canvasRef}
//         width='640'
//         height='480'
//         style={{ position: 'absolute', zIndex: 1 }}
//       ></canvas>
//       <Canvas style={{ position: 'absolute', zIndex: 0, width: '100%', height: '100%' }}>
//         <ambientLight />
//         <pointLight position={[10, 10, 10]} />
//         {modelLoaded ? (
//           <Model
//             ref={modelRef}
//             setModelLoaded={setModelLoaded}
//           />
//         ) : (
//           <mesh>
//             <boxGeometry args={[1, 1, 1]} />
//             <meshStandardMaterial color='orange' />
//           </mesh>
//         )}
//       </Canvas>
//     </div>
//   );
// };

// interface ModelProps {
//   setModelLoaded: (loaded: boolean) => void;
// }

// const Model = React.forwardRef<THREE.Group, ModelProps>(({ setModelLoaded }, ref) => {
//   const { scene } = useThree();
//   const url = process.env.PUBLIC_URL + '/X_Bot.fbx'; // FBX 파일 경로
//   console.log('Attempting to load model from:', url);

//   useEffect(() => {
//     const loader = new FBXLoader();
//     loader.load(
//       url,
//       (fbx) => {
//         console.log('Model loaded successfully');
//         if (ref && typeof ref === 'object' && ref.current) {
//           (ref.current as THREE.Group).add(fbx);
//           scene.add(fbx);
//         }
//         setModelLoaded(true);
//       },
//       undefined,
//       (error) => {
//         console.error('Error loading model:', error);
//         setModelLoaded(false);
//       }
//     );
//   }, [url, ref, scene, setModelLoaded]);

//   return null;
// });

// export default PoseDetection;
// src/App.tsx
import React from 'react';
import PoseEstimator from './GameMode/components/PoseEstimator';

const App: React.FC = () => {
    return (
        <div>
            <h1>BlazePose with TensorFlow.js</h1>
            <PoseEstimator />
            {/* <PoseEstimatorVideo/> */}
        </div>
    );
};

export default App;
