import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createDetector, PoseDetector, SupportedModels, BlazePoseMediaPipeModelConfig } from '@tensorflow-models/pose-detection';

const PoseEstimatorVideo: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const setupVideo = async () => {
            if (videoRef.current) {
                // 비디오 소스를 MP4 파일로 설정합니다.
                videoRef.current.src = 'proto.mp4'; // 비디오 파일 경로를 설정하세요.
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
                
                if (videoRef.current.paused || videoRef.current.ended) {
                    return; // 비디오가 일시 정지되거나 종료된 경우 반복 중지
                }

                if (ctx) {
                    // 비디오 프레임을 캔버스에 그리기
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    canvasRef.current.width = videoRef.current.videoWidth;
                    canvasRef.current.height = videoRef.current.videoHeight;
                    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
                    // 포즈 추정
                    console.log(
                        "videoRef => ", videoRef.current
                    )
                    const poses = await detector.estimatePoses(videoRef.current);
                    console.log('Detected poses:', poses); // 디버깅을 위한 콘솔 출력
    
                    poses.forEach((pose) => {
                        // console.log(pose);
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
                }

                // 다음 프레임을 위해 다시 호출
                requestAnimationFrame(() => detectPose(detector));
            }
        };

        const init = async () => {
            await tf.ready(); // TensorFlow.js가 준비될 때까지 대기
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

    return (
        <div>
            <video ref={videoRef} style={{ display: 'none' }} autoPlay muted />
            <canvas ref={canvasRef} style={{ width: '640px', height: '480px' }}/>
        </div>
    );
};

export default PoseEstimatorVideo;
