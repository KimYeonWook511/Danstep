// // src/PoseEstimator.tsx
// import React, { useEffect, useRef } from 'react';
// import * as tf from '@tensorflow/tfjs';
// import { createDetector, PoseDetector, Pose, SupportedModels } from '@tensorflow-models/pose-detection';

// const PoseEstimator: React.FC = () => {
//     const videoRef = useRef<HTMLVideoElement>(null);
//     const canvasRef = useRef<HTMLCanvasElement>(null);

//     useEffect(() => {
//         const setupCamera = async () => {
//             if (videoRef.current) {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//                 videoRef.current.srcObject = stream;
//                 return new Promise<HTMLVideoElement>((resolve) => {
//                     if (videoRef.current) {
//                         videoRef.current.onloadedmetadata = () => {
//                             resolve(videoRef.current!);
//                         };
//                     }
//                 });
//             }
//             return null;
//         };

//         const detectPose = async (detector: PoseDetector) => {
//             if (videoRef.current && canvasRef.current) {
//                 const ctx = canvasRef.current.getContext('2d');
//                 const poses: Pose[] = await detector.estimatePoses(videoRef.current);
//                 if (ctx) {
//                     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//                     poses.forEach((pose) => {
//                         // if (pose.score && pose.score > 0.5) {
//                         if (pose.score) {
//                             pose.keypoints.forEach((keypoint) => {
//                                 // if (keypoint.score && keypoint.score > 0.5) {
//                                 if (keypoint.score) {
//                                     ctx.beginPath();
//                                     ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
//                                     ctx.fillStyle = 'red';
//                                     ctx.fill();
//                                 }
//                             });
//                         }
//                     });
//                 }
//             }
//             requestAnimationFrame(() => detectPose(detector));
//         };

//         const init = async () => {
//             const video = await setupCamera();
//             if (video) {
//                 video.play();
//                 const detector = await createDetector(SupportedModels.BlazePose, {
//                     runtime: 'mediapipe', // 또는 'tfjs' 외에 'mediapipe'도 사용할 수 있습니다.
//                     modelType: 'full', // 'full' 또는 'lite'를 선택
//                     solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/pose",
//                 });
//                 detectPose(detector);
//             }
//         };

//         init();
//     }, []);

//     return (
//         <div>
//             <video ref={videoRef} style={{ display: 'none' }} />
//             <canvas ref={canvasRef} width={640} height={480} />
//         </div>
//     );
// };

// export default PoseEstimator;

// src/PoseEstimator.tsx
// import React, { useEffect, useRef } from 'react';
// import * as tf from '@tensorflow/tfjs';
// import { createDetector, PoseDetector, SupportedModels } from '@tensorflow-models/pose-detection';

// const PoseEstimator: React.FC = () => {
//     const videoRef = useRef<HTMLVideoElement>(null);
//     const canvasRef = useRef<HTMLCanvasElement>(null);

//     useEffect(() => {
//         const setupCamera = async () => {
//             if (videoRef.current) {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//                 videoRef.current.srcObject = stream;
//                 return new Promise<HTMLVideoElement>((resolve) => {
//                         if (videoRef.current) {
//                             console.log("여기성공")
//                             videoRef.current.onloadedmetadata = () => {
//                                 console.log(videoRef.current);
//                                 resolve(videoRef.current!);
//                             }
//                         } else {
//                             console.log("여기땡")
//                         }
//                 });
//             }
//             return null;
//         };

//         const detectPose = async (detector: PoseDetector) => {
//             if (videoRef.current && canvasRef.current) {
//                 const ctx = canvasRef.current.getContext('2d');
//                 const poses = await detector.estimatePoses(videoRef.current);

//                 if (ctx) {
//                     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//                     poses.forEach((pose) => {
//                         console.log(pose);
//                         // if (pose.score > 0.5) {
//                         //     pose.keypoints.forEach((keypoint) => {
//                         //         if (keypoint.score > 0.5) {
//                         //             ctx.beginPath();
//                         //             ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
//                         //             ctx.fillStyle = 'red';
//                         //             ctx.fill();
//                         //         }
//                         //     });
//                         // }
//                     });
//                 }
//             }
//             requestAnimationFrame(() => detectPose(detector));
//         };

//         const init = async () => {
//             // await tf.ready(); // TensorFlow.js가 준비될 때까지 대기
//             const video = await setupCamera();

//             if (video) {
//                 video.play();
                
//                 // GPU 가속을 사용할 수 있도록 설정
//                 await tf.ready(); // TensorFlow.js가 준비될 때까지 대기
//                 const detector = await createDetector(SupportedModels.BlazePose, {
//                     runtime: 'tfjs', // GPU 가속을 사용하기 위해 'tfjs'를 선택
//                     // runtime: 'mediapipe' as 'mediapipe',
//                     // solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/pose",
//                     modelType: 'lite', // 또는 'full'을 선택 가능
//                 });
//                 console.log("model -> ", detector);
//                 detectPose(detector);
//             }
//         };

//         init();
//     }, []);

//     return (
//         <div>
//             <video ref={videoRef} style={{ display: 'none' }} />
//             <canvas ref={canvasRef} width={640} height={480} />
//         </div>
//     );
// };

// export default PoseEstimator;

// src/PoseEstimator.tsx
// import React, { useEffect, useRef } from 'react';
// import * as tf from '@tensorflow/tfjs';
// import { createDetector, PoseDetector, SupportedModels } from '@tensorflow-models/pose-detection';
// // import { BlazePoseMediaPipeEstimationConfig, BlazePoseMediaPipeModelConfig, BlazePoseModelType } from '@tensorflow-models/pose-detection';

// const PoseEstimator: React.FC = () => {
//     const videoRef = useRef<HTMLVideoElement>(null);
//     const canvasRef = useRef<HTMLCanvasElement>(null);

//     useEffect(() => {
//         const setupCamera = async () => {
//             if (videoRef.current) {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//                 videoRef.current.srcObject = stream;
//                 return new Promise<HTMLVideoElement>((resolve) => {
//                     if (videoRef.current) {
//                         console.log(videoRef.current);
//                         videoRef.current.onloadedmetadata = () => {
//                             resolve(videoRef.current!);
//                         };
//                     } else {
//                         console.log("때애애애애애ㅐ앵ㅇ");
//                     }
//                 });
//             }
//             return null;
//         };

//         const detectPose = async (detector: PoseDetector) => {
//             if (videoRef.current && canvasRef.current) {
//                 const ctx = canvasRef.current.getContext('2d');
//                 const poses = await detector.estimatePoses(videoRef.current);

//                 if (ctx) {
//                     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//                     poses.forEach((pose) => {
//                         if (pose.score && !isNaN(pose.score) && pose.score > 0.5) {
//                             pose.keypoints.forEach((keypoint) => {
//                                 if (keypoint.score && !isNaN(keypoint.score) && keypoint.score > 0.5) {
//                                     ctx.beginPath();
//                                     ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
//                                     ctx.fillStyle = 'red';
//                                     ctx.fill();
//                                 }
//                             });
//                         }
//                     });
//                 }
//             }
//             requestAnimationFrame(() => detectPose(detector));
//         };

//         const init = async () => {
//             await tf.ready(); // TensorFlow.js가 준비될 때까지 대기
//             const video = await setupCamera();
//             if (video) {
//                 // 비디오 크기를 캔버스에 맞게 설정
//                 canvasRef.current!.width = video.videoWidth;
//                 canvasRef.current!.height = video.videoHeight;

//                 video.play();
//                 console.log("디텍터!!")
//                 const detector = await createDetector(SupportedModels.BlazePose, {
//                     runtime: 'mediapipe', // MediaPipe를 사용하여 GPU 가속
//                     modelType: 'lite', // 또는 'full'을 선택 가능
//                     solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/', // MediaPipe의 올바른 경로
//                 });
//                 // const detector = await createDetector(SupportedModels.BlazePose, BlazePoseMediaPipeModelConfig);
//                 console.log(detector);
//                 detectPose(detector);
//             }
//         };

//         init();
//     }, []);

//     return (
//         <div>
//             <video ref={videoRef} style={{ display: 'none' }} />
//             <canvas ref={canvasRef} width={640} height={480} />
//         </div>
//     );
// };

// export default PoseEstimator;

// src/PoseEstimator.tsx
// import React, { useEffect, useRef } from 'react';
// import * as tf from '@tensorflow/tfjs';
// import { createDetector, PoseDetector, SupportedModels, BlazePoseMediaPipeModelConfig } from '@tensorflow-models/pose-detection';

// const PoseEstimator: React.FC = () => {
//     const videoRef = useRef<HTMLVideoElement>(null);
//     const canvasRef = useRef<HTMLCanvasElement>(null);

//     useEffect(() => {
//         const setupCamera = async () => {
//             if (videoRef.current) {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//                 videoRef.current.srcObject = stream;
//                 return new Promise<HTMLVideoElement>((resolve) => {
//                     if (videoRef.current) {
//                         videoRef.current.onloadedmetadata = () => {
//                             if (videoRef.current) {
//                                 videoRef.current.play();
//                                 resolve(videoRef.current!);
//                             }
//                         }
//                     };
//                 });
//             }
//             return null;
//         };

//         const detectPose = async (detector: PoseDetector) => {
//             if (videoRef.current && canvasRef.current) {
//                 // console.log(1)
//                 const ctx = canvasRef.current.getContext('2d');
//                 console.log(detector);
//                 const poses = await detector.estimatePoses(videoRef.current);
//                 console.log(poses);
//                 if (ctx) {
//                     // console.log(ctx)
//                     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//                     // console.log(poses);
//                     poses.forEach((pose) => {
//                         console.log(pose);
//                         if (pose.score && !isNaN(pose.score) && pose.score > 0.5) {
//                             pose.keypoints.forEach((keypoint) => {
//                                 if (keypoint.score && !isNaN(keypoint.score) && keypoint.score > 0.5) {
//                                     ctx.beginPath();
//                                     ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
//                                     ctx.fillStyle = 'red';
//                                     ctx.fill();
//                                 }
//                             });
//                         }
//                     });
//                 }
//             }
//             requestAnimationFrame(() => detectPose(detector));
//         };

//         const init = async () => {
//             await tf.ready(); // TensorFlow.js가 준비될 때까지 대기
//             const video = await setupCamera();
//             if (video) {
//                 // 비디오 크기를 캔버스에 맞게 설정
//                 canvasRef.current!.width = video.videoWidth;
//                 canvasRef.current!.height = video.videoHeight;

//                 const modelConfig: BlazePoseMediaPipeModelConfig = {
//                     runtime: 'mediapipe',
//                     modelType: 'lite',
//                     solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/',
//                 };

//                 const detector = await createDetector(SupportedModels.BlazePose, modelConfig);
//                 console.log(detector)
//                 detectPose(detector);
//             }
//         };

//         init();
//     }, []);

//     return (
//         <div>
//             {/* <video ref={videoRef} style={{ display: 'none' }} /> */}
//             <video ref={videoRef}/>
//             <canvas ref={canvasRef} />
//         </div>
//     );
// };

// export default PoseEstimator;

import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createDetector, PoseDetector, SupportedModels, BlazePoseMediaPipeModelConfig } from '@tensorflow-models/pose-detection';

const PoseEstimator: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const setupCamera = async () => {
            if (videoRef.current) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                return new Promise<HTMLVideoElement>((resolve) => {
                    if (videoRef.current) {
                        videoRef.current.onloadedmetadata = () => {
                            if (videoRef.current) {
                                videoRef.current.play();
                                resolve(videoRef.current!);
                            }
                        };
                    }
                });
            }
            return null;
        };

        const detectPose = async (detector: PoseDetector) => {
            if (videoRef.current && canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                
                // 일정 시간 대기 후 포즈 추정
                // console.log(
                //     "videoRef.current => ", videoRef.current
                // )
                const poses = await detector.estimatePoses(videoRef.current);
                console.log('Detected poses:', poses); // 디버깅을 위한 콘솔 출력

                if (ctx) {
                    // ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    // canvasRef.current.width = 640;
                    // canvasRef.current.height = 480;

                    // 비디오 프레임을 캔버스에 그리기
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    canvasRef.current.width = videoRef.current.videoWidth;
                    canvasRef.current.height = videoRef.current.videoHeight;
                    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

                    // 배경색 설정
                    ctx.fillStyle = 'lightgray';
                    // ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                    // 원 그리기
                    // ctx.fillStyle = 'blue';
                    // ctx.beginPath();
                    // ctx.arc(320, 240, 50, 0, 2 * Math.PI);
                    // ctx.fill();

                    if (poses.length > 0) {
                        poses.forEach((pose) => {
                            // if (pose.score && !isNaN(pose.score) && pose.score > 0.5) {
                                pose.keypoints.forEach((keypoint) => {
                                    if (keypoint.score && !isNaN(keypoint.score) && keypoint.score > 0.5) {
                                        alert("여기 실행됨");
                                        ctx.beginPath();
                                        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
                                        ctx.fillStyle = 'red';
                                        ctx.fill();
                                    }
                                });
                            // }
                        });
                    } else {
                        console.log("empty")
                    }
                }
            }

            // 다음 프레임을 위해 다시 호출
            requestAnimationFrame(() => detectPose(detector));
        };

        const init = async () => {
            await tf.ready(); // TensorFlow.js가 준비될 때까지 대기
            const video = await setupCamera();
            if (video) {
                canvasRef.current!.width = video.videoWidth;
                canvasRef.current!.height = video.videoHeight;

                const modelConfig: BlazePoseMediaPipeModelConfig = {
                    runtime: 'mediapipe',
                    modelType: 'lite',
                    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/',
                };

                const detector = await createDetector(SupportedModels.BlazePose, modelConfig);
                
                console.log('Detector initialized:', detector); // 디버깅을 위한 콘솔 출력

                // await detector.estimatePoses(new ImageData(480, 640));

                // console.log('Detector initialized:', detector); // 디버깅을 위한 콘솔 출력

                detectPose(detector);
            }
        };

        init();
    }, []);

    return (
        <div>
            {/* <video ref={videoRef} style={{ width: '640px', height: '480px' }} autoPlay muted /> */}
            <video ref={videoRef} style={{ display: 'none' }} autoPlay muted />
            <canvas ref={canvasRef}/>
        </div>
    );
};

export default PoseEstimator;

