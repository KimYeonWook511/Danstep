import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createDetector, PoseDetector, SupportedModels } from '@tensorflow-models/pose-detection';
import '../../canvas.css';
import '../neon/Neon.css';
import '../neon/TopBar.css';
import {
  detectFirstFrame,
  checkInitialZAlignment,
  isArmsUp,
  keypointsDetected,
} from '../utils/Verification';
import { sendScores } from '../utils/Result';
import { drawGreen, drawRed } from '../utils/DrawUtils';
import { calculateScore } from '../utils/CalculateUtils';
import { updateScores } from '../utils/ScoreUtils';
import NeonButton from '../neon/NeonButton';
import NeonRating from '../neon/NeonRating';
import RainbowHealthBar from '../neon/RainbowHealthBar';
import NeonCircle from '../neon/NeonCircle';
import ScoreDisplay from '../neon/ScoreDisplay';
import ThreeStars from '../neon/ThreeStars';

const PoseEstimator: React.FC = () => {
  const camRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const camcanvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  const checkAnimationRef = useRef<number | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const firstFrameZ = useRef<number[]>([]);

  const requiredKeypointsIndices = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];

  let isZAligned = false;
  let iskeypoint = false;

  const bad = useRef(0);
  const good = useRef(0);
  const great = useRef(0);
  const perfect = useRef(0);
  const health = useRef(100);

  const [detectedArmsUp, setDetectedArmsUp] = useState<boolean>(false);
  const [scores, setScores] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [poseKeypoints, setPoseKeypoints] = useState<any[]>([]);

  const init = useCallback(async () => {
    await tf.setBackend('webgl');
    await tf.ready();
    const video = await setupVideo();
    if (video) {
      const modelConfig = {
        runtime: 'mediapipe',
        modelType: 'full',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/',
      };
      const detector = await createDetector(SupportedModels.BlazePose, modelConfig);
      const camdetector = await createDetector(SupportedModels.BlazePose, modelConfig);
      const checkdetector = await createDetector(SupportedModels.BlazePose, modelConfig);
      await detectFirstFrame(checkdetector, videoRef, firstFrameZ);

      const checkAndDetect = async () => {
        if (checkAnimationRef.current == null) return;
        const checkKeypoints = await checkdetectPose(checkdetector);
        isZAligned = await checkInitialZAlignment(camdetector, camRef, firstFrameZ);
        if (checkKeypoints)
          iskeypoint = await keypointsDetected(checkKeypoints, requiredKeypointsIndices);
        if (checkKeypoints && isArmsUp(checkKeypoints) && iskeypoint) {
          setDetectedArmsUp(true);
          cancelAnimationFrame(checkAnimationRef.current);
          checkAnimationRef.current = null;

          if (isZAligned) {
            let startTime: number | null = null;
            let lastLoggedSecond = 0;
            const startTimer = (timestamp: number) => {
              if (!startTime) startTime = timestamp;
              const elapsed = timestamp - startTime;
              const seconds = Math.floor(elapsed / 1000);
              if (seconds > lastLoggedSecond && seconds <= 3) {
                lastLoggedSecond = seconds;
                console.log(`${seconds} second${seconds > 1 ? 's' : ''}`);
              }
              if (elapsed >= 3000) {
                videoRef.current!.play();
                const detectAndScore = async () => {
                  const posesKeypoints = await detectPose(detector);
                  const camKeypoints = await camdetectPose(camdetector);
                  setScores((prevScores) => {
                    const newScores = [...prevScores];
                    if (posesKeypoints && camKeypoints) {
                      const sum = calculateScore(posesKeypoints, camKeypoints);
                      newScores.push(sum);
                      if (newScores.length === 16) {
                        const averageScore = newScores.reduce((a, b) => a + b, 0) / 16;
                        console.log('Average Score:', averageScore);
                        updateScores(averageScore, bad, good, great, perfect, health);
                        console.log(bad, good, great, perfect, health);
                        videoRef.current!.onended = () => {
                          sendScores({
                            bad: bad.current,
                            good: good.current,
                            great: great.current,
                            perfect: perfect.current,
                            health: health.current,
                          });
                          setIsFinished(true);
                        };
                        return [];
                      }
                    }
                    return newScores;
                  });
                  setPoseKeypoints(posesKeypoints || []);
                  animationFrameIdRef.current = requestAnimationFrame(detectAndScore);
                };
                detectAndScore();
              } else {
                animationFrameIdRef.current = requestAnimationFrame(startTimer);
              }
            };
            animationFrameIdRef.current = requestAnimationFrame(startTimer);
          } else {
            console.log('Initial Z alignment failed.');
          }
        } else {
          checkAnimationRef.current = requestAnimationFrame(checkAndDetect);
        }
      };
      checkAnimationRef.current = requestAnimationFrame(checkAndDetect);
    }
  }, []);

  const setupVideo = useCallback(async () => {
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
  }, []);

  const setupCamera = useCallback(async () => {
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
  }, []);

  const detectPose = useCallback(async (detector: PoseDetector) => {
    if (videoRef.current && camRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const offscreenCtx = offscreenCanvasRef.current.getContext('2d');
      if (videoRef.current.paused || videoRef.current.ended) return;
      if (ctx && offscreenCtx) {
        offscreenCanvasRef.current.width = videoRef.current.videoWidth;
        offscreenCanvasRef.current.height = videoRef.current.videoHeight;

        const poses = await detector.estimatePoses(videoRef.current);
        if (poses[0]) drawGreen(offscreenCtx, poses[0].keypoints);

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(offscreenCanvasRef.current, 0, 0);
        return poses[0].keypoints;
      }
      return undefined;
    }
  }, []);

  const camdetectPose = useCallback(async (detector: PoseDetector) => {
    if (videoRef.current && camRef.current && camcanvasRef.current) {
      const ctx = camcanvasRef.current.getContext('2d');
      const offscreenCtx = offscreenCanvasRef.current.getContext('2d');
      if (videoRef.current.paused || videoRef.current.ended) return;
      if (ctx && offscreenCtx) {
        offscreenCanvasRef.current.width = camRef.current.videoWidth;
        offscreenCanvasRef.current.height = camRef.current.videoHeight;

        offscreenCtx.clearRect(
          0,
          0,
          offscreenCanvasRef.current.width,
          offscreenCanvasRef.current.height
        );
        const camposes = await detector.estimatePoses(camRef.current);
        if (camposes[0]) drawRed(offscreenCtx, camposes[0].keypoints);

        ctx.clearRect(0, 0, camcanvasRef.current.width, camcanvasRef.current.height);
        camcanvasRef.current.width = camRef.current.videoWidth;
        camcanvasRef.current.height = camRef.current.videoHeight;
        ctx.drawImage(offscreenCanvasRef.current, 0, 0);
        return camposes[0].keypoints;
      }
    }
    return undefined;
  }, []);

  const checkdetectPose = useCallback(async (detector: PoseDetector) => {
    if (camRef.current && camcanvasRef.current) {
      const ctx = camcanvasRef.current.getContext('2d');
      const offscreenCtx = offscreenCanvasRef.current.getContext('2d');
      if (ctx && offscreenCtx) {
        offscreenCanvasRef.current.width = camRef.current.videoWidth;
        offscreenCanvasRef.current.height = camRef.current.videoHeight;

        offscreenCtx.clearRect(
          0,
          0,
          offscreenCanvasRef.current.width,
          offscreenCanvasRef.current.height
        );
        const checkposes = await detector.estimatePoses(camRef.current);
        if (checkposes[0]) drawRed(offscreenCtx, checkposes[0].keypoints);

        ctx.clearRect(0, 0, camcanvasRef.current.width, camcanvasRef.current.height);
        camcanvasRef.current.width = camRef.current.videoWidth;
        camcanvasRef.current.height = camRef.current.videoHeight;
        ctx.drawImage(offscreenCanvasRef.current, 0, 0);
        return checkposes[0].keypoints;
      }
    }
    return undefined;
  }, []);

  useEffect(() => {
    setupCamera().then(() => init());

    return () => {
      if (checkAnimationRef.current !== null) {
        cancelAnimationFrame(checkAnimationRef.current);
      }
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [init, setupCamera]);

  const handleRestart = () => {
    setDetectedArmsUp(false);
    setIsFinished(false);
    setScores([]);
    firstFrameZ.current = [];
    setPoseKeypoints([]);
    init();
  };

  return (
    <div className="Neon">
      <ThreeStars />
      <div className="topBar">
        <div className="left">
          <NeonButton onClick={() => console.log('Go Back')}>Back</NeonButton>
        </div>
        <div className="center">
          <ScoreDisplay score={health.current} />
        </div>
        <div className="right">
          <NeonButton onClick={handleRestart}>Retry</NeonButton>
          <NeonButton onClick={() => console.log('Help')}>?</NeonButton>
        </div>
      </div>
      <RainbowHealthBar health={health.current} />
      <NeonCircle />
      <NeonRating />
      {detectedArmsUp ? (
        <div className="container">
          <video ref={camRef} className="cam-video" style={{ display: 'none' }} autoPlay />
          <video ref={videoRef} className="game-video" style={{ display: 'none' }} autoPlay />

          <canvas ref={camcanvasRef} className="canvas cam-canvas" />
          <canvas ref={canvasRef} className="canvas video-canvas" />

          {isFinished && (
            <button
              className="button"
              onClick={handleRestart}
              style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}
            >
              Restart
            </button>
          )}
        </div>
      ) : (
        <div className="container">
          <video ref={camRef} className="cam-video" autoPlay muted />
          <video ref={videoRef} className="game-video" autoPlay muted />
          <canvas ref={camcanvasRef} className="canvas cam-canvas" />
          <canvas ref={canvasRef} className="canvas video-canvas" />
        </div>
      )}
    </div>
  );
};

export default PoseEstimator;