import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createDetector, PoseDetector, SupportedModels, BlazePoseMediaPipeModelConfig, util, Keypoint } from '@tensorflow-models/pose-detection';
import './canvas.css';

const JOINTS = [
    // 관절 쌍 배열을 정의합니다. 예:
    [11, 13], [13, 15], [12, 14], [14, 16], // 팔
    [11, 12], [23, 24], // 몸통
    [23, 25], [25, 27], [24, 26], [26, 28]  // 다리
];

const checkPose: React.FC = () => {
    const camRef = useRef<HTMLVideoElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const camcanvasRef = useRef<HTMLCanvasElement>(null);

    const intervalRef = useRef<number | null>(null);
    const firstFrameZ = useRef<number[]>([]);

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

        let cnt = 0;
        const detectPose = async (detector: PoseDetector) => {
            if (videoRef.current && camRef.current && canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');

                if (videoRef.current.paused || videoRef.current.ended) {
                    return; // 비디오가 일시 정지되거나 종료된 경우 반복 중지
                }
                // console.log(cnt++);

                if (ctx) {
                    // 비디오 프레임을 캔버스에 그리기
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    canvasRef.current.width = videoRef.current.videoWidth;
                    canvasRef.current.height = videoRef.current.videoHeight;

                    // camRef 비디오 프레임을 캔버스에 그리기
                    ctx.drawImage(camRef.current!, 0, 0, canvasRef.current.width, canvasRef.current.height);

                    // 포즈 추정 및 그리기
                    const poses = await detector.estimatePoses(videoRef.current);
                    // console.log(new Date().getSeconds(), " ", new Date().getMilliseconds(), "->", poses[0]); // 디버깅을 위한 콘솔 출력

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

                console.log(cnt++);

                if (ctx) {
                    // 포즈 추정 및 그리기
                    ctx.clearRect(0, 0, camcanvasRef.current.width, camcanvasRef.current.height);
                    camcanvasRef.current.width = camRef.current.videoWidth;
                    camcanvasRef.current.height = camRef.current.videoHeight;
                    
                    const camposes = await detector.estimatePoses(camRef.current);
                    console.log(new Date().getSeconds(), " ", new Date().getMilliseconds(), "->", camposes[0]); // 디버깅을 위한 콘솔 출력

                    if(camposes[0]) drawRed(ctx, camposes[0].keypoints);
                    return camposes[0].keypoints;
                }
            }
        };

        const detectFirstFrame = async (detector: PoseDetector) => {
            if (videoRef.current) {
                const poses = await detector.estimatePoses(videoRef.current);
                if (poses[0]) {
                    firstFrameZ.current = poses[0].keypoints.map(kp => kp.z || 0);
                    videoRef.current.pause();
                }
            }
        };

        const checkInitialZAlignment = async (detector: PoseDetector) => {
            if (camRef.current) {
                const camposes = await detector.estimatePoses(camRef.current);
                if (camposes[0]) {
                    const camZ = camposes[0].keypoints.map(kp => kp.z || 0);
                    const alignmentScore = calculateZAlignment(firstFrameZ.current, camZ);
                    console.log(`Initial Z alignment score: ${alignmentScore}`);
                    return alignmentScore > 0.7; // 유사도 임계값을 0.8로 설정
                }
            }
            return false;
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
                const camdetector = await createDetector(SupportedModels.BlazePose, modelConfig);
                console.log('Detector initialized:', detector); // 디버깅을 위한 콘솔 출력

                await detectFirstFrame(detector);

                const isZAligned = await checkInitialZAlignment(camdetector);
                if (isZAligned) {

                } else {
                    console.log("Initial Z alignment failed.");
                }
            }
        };

        init();

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

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

        // 얼굴 그리기
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

        // 얼굴 그리기
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

    
    const calculateZAlignment = (z1: number[], z2: number[]): number => {
        let sum = 0;
        let count = 0;
        for (let i = 0; i < z1.length; i++) {
            if (z1[i] !== undefined && z2[i] !== undefined) {
                const diff = Math.abs(z1[i] - z2[i]);
                sum += diff;
                count++;
            }
        }
        return count > 0 ? 1 - (sum / count) : 0;
    };

    return (
        <div>
            <video ref={camRef} style={{ display: 'none', width: '640px', height: '480px' }} autoPlay muted />
            <video ref={videoRef} style={{ display: 'none', width: '640px', height: '480px' }} autoPlay muted />
            <canvas ref={camcanvasRef} className="canvas cam-canvas" />
            <canvas ref={canvasRef} className="canvas video-canvas" />
        </div>
    );
};

export default checkPose;
