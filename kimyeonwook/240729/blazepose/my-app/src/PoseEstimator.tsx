import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createDetector, PoseDetector, SupportedModels, BlazePoseMediaPipeModelConfig, util, Keypoint } from '@tensorflow-models/pose-detection';

const PoseEstimator: React.FC = () => {
    const camRef = useRef<HTMLVideoElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const arr = useRef<number[]>(null);
    const start = useRef<Date>(new Date());

    // useEffect(() => {
    //     const setupCamera = async () => {
    //         if (videoRef.current) {
    //             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    //             videoRef.current.srcObject = stream;
    //             return new Promise<HTMLVideoElement>((resolve) => {
    //                 if (videoRef.current) {
    //                     videoRef.current.onloadedmetadata = () => {
    //                         if (videoRef.current) {
    //                             videoRef.current.play();
    //                             resolve(videoRef.current!);
    //                         }
    //                     };
    //                 }
    //             });
    //         }
    //         return null;
    //     };

    //     const detectPose = async (detector: PoseDetector) => {
    //         if (videoRef.current && canvasRef.current) {
    //             const ctx = canvasRef.current.getContext('2d');
                
    //             // 일정 시간 대기 후 포즈 추정
    //             // console.log(
    //             //     "videoRef.current => ", videoRef.current
    //             // )
    //             const poses = await detector.estimatePoses(videoRef.current);
    //             console.log('Detected poses:', poses); // 디버깅을 위한 콘솔 출력

    //             if (ctx) {
    //                 // ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    //                 // canvasRef.current.width = 640;
    //                 // canvasRef.current.height = 480;

    //                 // 비디오 프레임을 캔버스에 그리기
    //                 ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    //                 canvasRef.current.width = videoRef.current.videoWidth;
    //                 canvasRef.current.height = videoRef.current.videoHeight;
    //                 ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    //                 // 배경색 설정
    //                 ctx.fillStyle = 'lightgray';
    //                 // ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    //                 // 원 그리기
    //                 // ctx.fillStyle = 'blue';
    //                 // ctx.beginPath();
    //                 // ctx.arc(320, 240, 50, 0, 2 * Math.PI);
    //                 // ctx.fill();

    //                 if (poses.length > 0) {
    //                     poses.forEach((pose) => {
    //                         // if (pose.score && !isNaN(pose.score) && pose.score > 0.5) {
    //                             pose.keypoints.forEach((keypoint) => {
    //                                 if (keypoint.score && !isNaN(keypoint.score) && keypoint.score > 0.5) {
    //                                     ctx.beginPath();
    //                                     ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
    //                                     ctx.fillStyle = 'red';
    //                                     ctx.fill();
    //                                 }
    //                             });
    //                         // }
    //                     });
    //                 } else {
    //                     console.log("empty")
    //                 }
    //             }
    //         }

    //         // 다음 프레임을 위해 다시 호출
    //         requestAnimationFrame(() => detectPose(detector));
    //     };

    //     const init = async () => {
    //         await tf.ready(); // TensorFlow.js가 준비될 때까지 대기
    //         const video = await setupCamera();
    //         if (video) {
    //             canvasRef.current!.width = video.videoWidth;
    //             canvasRef.current!.height = video.videoHeight;

    //             const modelConfig: BlazePoseMediaPipeModelConfig = {
    //                 runtime: 'mediapipe',
    //                 modelType: 'lite',
    //                 solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/',
    //             };

    //             const detector = await createDetector(SupportedModels.BlazePose, modelConfig);
                
    //             console.log('Detector initialized:', detector); // 디버깅을 위한 콘솔 출력

    //             // await detector.estimatePoses(new ImageData(480, 640));

    //             // console.log('Detector initialized:', detector); // 디버깅을 위한 콘솔 출력

    //             detectPose(detector);
    //         }
    //     };

    //     init();
    // }, []);

    useEffect(() => {
        const setupVideo = async () => {
            if (videoRef.current) {
                // 비디오 소스를 MP4 파일로 설정합니다.
                videoRef.current.src = 'proto.mp4'; // 비디오 파일 경로를 설정하세요.
                return new Promise<HTMLVideoElement>((resolve) => {
                    // if (videoRef.current) {
                    //     videoRef.current.onloadedmetadata = () => {
                    //         if (videoRef.current) {
                    //             videoRef.current.play();
                    //             resolve(videoRef.current!);
                    //         }
                    //     };
                    // }
                    videoRef.current!.onloadedmetadata = () => {
                        videoRef.current!.play();
                        resolve(videoRef.current!);
                    };
                });
            }
            return null;
        };

        const setupCamera = async () => {
            if (camRef.current) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                camRef.current.srcObject = stream;
                return new Promise<HTMLVideoElement>((resolve) => {
                    camRef.current!.onloadedmetadata = () => {
                        camRef.current!.play();
                        resolve(camRef.current!);
                    };
                });
            }

            return null;
        };

        const detectPose = async (detector: PoseDetector) => {
            if (videoRef.current && canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                
                if (videoRef.current.paused || videoRef.current.ended) {
                    return; // 비디오가 일시 정지되거나 종료된 경우 반복 중지
                }

                if (ctx) {
                    // 비디오 프레임을 캔버스에 그리기
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    canvasRef.current.width = videoRef.current.videoWidth;
                    canvasRef.current.height = videoRef.current.videoHeight;
                    ctx.drawImage(camRef.current!, 0, 0, canvasRef.current.width, canvasRef.current.height);

                    // x 축을 반전하기 위해 scale 메서드를 사용
                    ctx.scale(-1, 1);

                    // 이미지의 너비를 음수로 지정하여 x 축을 반전
                    ctx.drawImage(camRef.current!, -canvasRef.current.width, 0, canvasRef.current.width, canvasRef.current.height);

                    // 다시 scale을 사용하여 원래대로 돌려놓기
                    ctx.scale(-1, 1);

                    // 포즈 추정
                    // console.log(
                    //     "videoRef => ", videoRef.current
                    // )
                    const poses = await detector.estimatePoses(videoRef.current);
                    console.log(new Date().getSeconds()," " , new Date().getMilliseconds(), "->", poses[0]); // 디버깅을 위한 콘솔 출력
    
                    if (poses[0]) drawGreen(ctx, detector, poses[0].keypoints);
                    /*
                    // 빨간선과 점으로 사람 표시
                    poses.forEach((pose) => {
                        // if (pose.score && !isNaN(pose.score) && pose.score > 0.5) {
                            pose.keypoints.forEach((keypoint) => {
                                if (keypoint.score && !isNaN(keypoint.score) && keypoint.score > 0.5) {
                                    ctx.beginPath();
                                    ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
                                    ctx.fillStyle = 'red';
                                    ctx.fill();
                                }
                            });
                        // }
                    });
                    */
                }

                // 다음 프레임을 위해 다시 호출
                requestAnimationFrame(() => detectPose(detector));
            }
        };

        const init = async () => {
            await tf.ready(); // TensorFlow.js가 준비될 때까지 대기
            await setupCamera();
            const video = await setupVideo();
            if (video) {
                const modelConfig: BlazePoseMediaPipeModelConfig = {
                    runtime: 'mediapipe',
                    modelType: 'lite',
                    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/',
                };

                const detector = await createDetector(SupportedModels.BlazePose, modelConfig);
                console.log('Detector initialized:', detector); // 디버깅을 위한 콘솔 출력

                detectPose(detector);
            }
        };

        init();
    }, []);

    // 초록선 그리기
    // const drawGreen = (keypoints: poseDetection.Keypoint[], color: string) => {
    // /*
    const drawGreen = (ctx: CanvasRenderingContext2D, detector: PoseDetector, keypoints: Keypoint[]) => {
        const color = "rgba(0,255,0,0.5)";
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 10;

        util.getAdjacentPairs(SupportedModels.BlazePose).forEach(([i, j]) => {
            const kp1 = keypoints[i];
            const kp2 = keypoints[j];

            const score1 = kp1.score != null ? kp1.score : 1;
            const score2 = kp2.score != null ? kp2.score : 1;
            // const scoreThreshold = BLAZEPOSE_CONFIG.scoreThreshold || 0;
            const scoreThreshold = 0.1;

            if (score1 >= scoreThreshold && 
                score2 >= scoreThreshold && 
                i > 10 && j > 10) {
                ctx.beginPath();
                ctx.moveTo(kp1.x, kp1.y);
                ctx.lineTo(kp2.x, kp2.y);
                ctx.stroke();
            }
        });

        // 얼굴그리기
        const left = Math.sqrt(Math.pow(keypoints[0].x - keypoints[8].x, 2) +
                                Math.pow(keypoints[0].y - keypoints[8].y, 2) +
                                Math.pow(keypoints[0].z! - keypoints[8].z!, 2));
        
        const right = Math.sqrt(Math.pow(keypoints[0].x - keypoints[7].x, 2) +
                                Math.pow(keypoints[0].y - keypoints[7].y, 2) +
                                Math.pow(keypoints[0].z! - keypoints[7].z!, 2));

        const circle = new Path2D();
        circle.arc((keypoints[0].x + keypoints[7].x + keypoints[8].x) / 3, 
                    (keypoints[0].y + keypoints[7].y + keypoints[8].y) / 3,
                    (left + right) / 2,
                    0,
                    2 * Math.PI
                    );
        ctx.fill(circle);
        ctx.stroke(circle);
    };
    // */
    return (
        <div>
            {/* <video ref={videoRef} style={{ width: '640px', height: '480px' }} autoPlay muted /> */}
            {/* <video ref={camRef} style={{ display: 'none' }} autoPlay muted /> */}
            <video ref={camRef} style={{ display: 'none', width: '640px', height: '480px'}} autoPlay muted />
            <video ref={videoRef} style={{ display: 'none', width: '640px', height: '480px' }} autoPlay muted />
            <canvas ref={canvasRef} style={{ width: '640px', height: '480px' }}/>
        </div>
    );
};

export default PoseEstimator;

