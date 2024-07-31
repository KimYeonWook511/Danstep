import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createDetector, PoseDetector, SupportedModels, BlazePoseMediaPipeModelConfig, util, Keypoint } from '@tensorflow-models/pose-detection';
import '../canvas.css';
import { detectFirstFrame, checkInitialZAlignment, isArmsUp } from './zVerification';

const JOINTS = [
    [11, 13], [13, 15], [12, 14], [14, 16], // 팔
    [11, 12], [23, 24], // 몸통
    [23, 25], [25, 27], [24, 26], [26, 28]  // 다리
];

const PoseEstimator: React.FC = () => {
    const camRef = useRef<HTMLVideoElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const camcanvasRef = useRef<HTMLCanvasElement>(null);

    const checkcamRef = useRef<HTMLVideoElement>(null);
    const checkcamcanvasRef = useRef<HTMLCanvasElement>(null);

    const checkintervalRef = useRef<number | null>(null);
    const intervalRef = useRef<number | null>(null);
    const firstFrameZ = useRef<number[]>([]);

    // const isZAligned = useRef(false);
    // const detectedArmsUp = useRef(false);
    let isZAligned = false;
    const [detectedArmsUp, setDetectedArmsUp] = useState<boolean>(false);

    useEffect(() => {
        const setupVideo = async () => {
            if (videoRef.current) {
                videoRef.current.src = 'proto.mp4'; // 비디오 파일 경로를 설정하세요.
                return new Promise<HTMLVideoElement>((resolve) => {
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
            console.log(videoRef.current);
            if (videoRef.current && camRef.current && canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');

                if (videoRef.current.paused || videoRef.current.ended) {
                    return; // 비디오가 일시 정지되거나 종료된 경우 반복 중지
                }

                if (ctx) {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    canvasRef.current.width = videoRef.current.videoWidth;
                    canvasRef.current.height = videoRef.current.videoHeight;
                    ctx.drawImage(camRef.current!, 0, 0, canvasRef.current.width, canvasRef.current.height);

                    const poses = await detector.estimatePoses(videoRef.current);

                    if (poses[0]) drawGreen(ctx, poses[0].keypoints);
                    return poses[0].keypoints;
                }
            }
        };

        const camdetectPose = async (detector: PoseDetector) => {
            if (videoRef.current && camRef.current && camcanvasRef.current) {
                const ctx = camcanvasRef.current.getContext('2d');

                if (videoRef.current.paused || videoRef.current.ended) {
                    return; // 비디오가 일시 정지되거나 종료된 경우 반복 중지
                }

                if (ctx) {
                    ctx.clearRect(0, 0, camcanvasRef.current.width, camcanvasRef.current.height);
                    camcanvasRef.current.width = camRef.current.videoWidth;
                    camcanvasRef.current.height = camRef.current.videoHeight;
                    
                    const camposes = await detector.estimatePoses(camRef.current);

                    if (camposes[0]) drawRed(ctx, camposes[0].keypoints);
                    return camposes[0].keypoints;
                }
            }
        };

        const checkdetectPose = async (detector: PoseDetector) => {
            if (camRef.current && camcanvasRef.current) {
                const ctx = camcanvasRef.current.getContext('2d');

                if (ctx) {
                    ctx.clearRect(0, 0, camcanvasRef.current.width, camcanvasRef.current.height);
                    camcanvasRef.current.width = camRef.current.videoWidth;
                    camcanvasRef.current.height = camRef.current.videoHeight;
                    
                    const checkposes = await detector.estimatePoses(camRef.current);

                    if (checkposes[0]) drawRed(ctx, checkposes[0].keypoints);
                    return checkposes[0].keypoints;
                }
            }
        };

        const init = async () => {
            await tf.ready();
            await setupCamera();
        
            const video = await setupVideo();
            
            if (video) {
                const modelConfig = {
                    runtime: 'mediapipe',
                    modelType: 'lite',
                    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/',
                };
        
                const detector = await createDetector(SupportedModels.BlazePose, modelConfig);
                const camdetector = await createDetector(SupportedModels.BlazePose, modelConfig);
                const checkdetector = await createDetector(SupportedModels.BlazePose, modelConfig);
        
                await detectFirstFrame(checkdetector, videoRef, firstFrameZ);
        
                checkintervalRef.current = window.setInterval(async () => {
                    if (checkintervalRef.current == null) return;
        
                    const checkKeypoints = await checkdetectPose(checkdetector);
                    isZAligned = await checkInitialZAlignment(camdetector, camRef, firstFrameZ);
        
                    if (checkKeypoints && isArmsUp(checkKeypoints)) {
                        // detectedArmsUp = true;
                        setDetectedArmsUp(true);
                        clearInterval(checkintervalRef.current);
                        checkintervalRef.current = null;

                        // 비디오 시작 및 포즈 감지 루프 실행
                        if (isZAligned) {
                            videoRef.current!.play();
                            console.log("Video is playing...");
                            
                            intervalRef.current = window.setInterval(async () => {
                                console.log("Running pose detection...");
                                const posesKeypoints = await detectPose(detector);
                                const camKeypoints = await camdetectPose(camdetector);
                                if (posesKeypoints && camKeypoints) {
                                    const sum = calculateScore(posesKeypoints, camKeypoints);
                                    console.log(sum);
                                }
                            }, 20);
                        } else {
                            console.log("Initial Z alignment failed.");
                        }
                    }
                }, 20);
            }
        };
        
        init();
        
        return () => {
            if (checkintervalRef.current !== null) {
                clearInterval(checkintervalRef.current);
            }
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    },[]);

    const drawGreen = (ctx: CanvasRenderingContext2D, keypoints: Keypoint[]) => {
        const color = "rgba(0,255,0,0.5)";
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 10;

        util.getAdjacentPairs(SupportedModels.BlazePose).forEach(([i, j]) => {
            const kp1 = keypoints[i];
            const kp2 = keypoints[j];

            const score1 = kp1.score != null ? kp1.score : 1;
            const score2 = kp2.score != null ? kp2.score : 1;
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

    const drawRed = (ctx: CanvasRenderingContext2D, keypoints: Keypoint[]) => {
        const color = "rgba(255,0,0,0.5)";
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 10;

        util.getAdjacentPairs(SupportedModels.BlazePose).forEach(([i, j]) => {
            const kp1 = keypoints[i];
            const kp2 = keypoints[j];

            const score1 = kp1.score != null ? kp1.score : 1;
            const score2 = kp2.score != null ? kp2.score : 1;
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

    const calculateScore = (
        keypoints1: Keypoint[],
        keypoints2: Keypoint[]
    ) => {
        let sum = 0;
        let pose1ConfidenceSum = 0;

        JOINTS.map((joint) => {
            const v1 = {
                x: keypoints1[joint[0]].x - keypoints1[joint[1]].x,
                y: keypoints1[joint[0]].y - keypoints1[joint[1]].y,
                z: keypoints1[joint[0]].z! - keypoints1[joint[1]].z!,
            };
            const v2 = {
                x: keypoints2[joint[0]].x - keypoints2[joint[1]].x,
                y: keypoints2[joint[0]].y - keypoints2[joint[1]].y,
                z: keypoints2[joint[0]].z! - keypoints2[joint[1]].z!,
            };

            const pose1Confidence =
                (keypoints1[joint[0]].score! + keypoints1[joint[1]].score!) / 2;
            const pose2Confidence =
                (keypoints2[joint[0]].score! + keypoints2[joint[1]].score!) / 2;
            const diffConfidence = Math.abs(pose1Confidence - pose2Confidence);

            const norm_v1 = l2_norm(v1);
            const norm_v2 = l2_norm(v2);
            let tempSum =
                diffConfidence > 0.3
                    ? 0
                    : similarity(v1, v2) * (1 - diffConfidence);
            pose1ConfidenceSum += 1 - diffConfidence;
            sum += tempSum;

            return sum;
        });

        let avg = sum / pose1ConfidenceSum;
        if (avg < 0) avg = 0;
        return avg * 100;
    };

    const l2_norm = (kpt: { x: number; y: number; z: number }) => {
        const norm = Math.sqrt(kpt.x * kpt.x + kpt.y * kpt.y + kpt.z * kpt.z);
        return { x: kpt.x / norm, y: kpt.y / norm, z: kpt.z / norm };
    };

    const similarity = (v1: { x: number, y: number, z: number }, v2: { x: number, y: number, z: number }) => {
        const dotProduct = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        const norm1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
        const norm2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
        return dotProduct / (norm1 * norm2);
    };

    return (
        <div>
            <p>{detectedArmsUp ? "true" : "false"}</p>
            {detectedArmsUp ? (
                <div>
                    <video ref={camRef} style={{ display: 'none', width: '640px', height: '480px' }} autoPlay muted />
                    <video ref={videoRef} style={{ display: 'none', width: '640px', height: '480px' }} autoPlay muted />
                    <canvas ref={camcanvasRef} className="canvas cam-canvas" />
                    <canvas ref={canvasRef} className="canvas video-canvas" />
                </div>
            ) : (
                <div>
                    <video ref={camRef} style={{ display: 'none', width: '1280px', height: '960px' }} autoPlay muted />
                    <video ref={videoRef} style={{ display: 'none', width: '640px', height: '480px' }} autoPlay muted />
                    <canvas ref={camcanvasRef} className="canvas cam2-canvas" />
                    <canvas ref={canvasRef} className="canvas video2-canvas" />
                </div>
            )}
        </div>
    );
};

export default PoseEstimator;
