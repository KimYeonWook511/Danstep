import React, { useEffect, useRef, useState, useCallback } from 'react';
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

  const workerRef = useRef<Worker>();

  const init = useCallback(async () => {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('../utils/poseWorker.ts', import.meta.url));
    }

    workerRef.current.postMessage({ type: 'INIT', data: '/pose/' });

    workerRef.current.onmessage = (e) => {
      const { type, keypoints } = e.data;

      switch (type) {
        case 'INIT_DONE':
          setupVideo().then((video) => {
            if (video) {
              detectFirstFrameInWorker();
            }
          });
          break;

        case 'POSE_DETECTED':
          setPoseKeypoints(keypoints || []);
          break;

        case 'CAM_POSE_DETECTED':
          // Handle camera pose detection
          break;

        case 'CHECK_POSE_DETECTED':
          // Handle check pose detection
          break;
      }
    };
  }, []);

  const setupVideo = useCallback(async () => {
    if (videoRef.current) {
      videoRef.current.src = 'proto.mp4';
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
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

  const detectFirstFrameInWorker = () => {
    workerRef.current?.postMessage({
      type: 'CHECK_DETECT_POSE',
      data: {
        videoElement: videoRef.current,
        canvasElement: offscreenCanvasRef.current,
      },
    });
  };

  const detectPoseInWorker = () => {
    workerRef.current?.postMessage({
      type: 'DETECT_POSE',
      data: {
        videoElement: videoRef.current,
        canvasElement: canvasRef.current,
      },
    });
  };

  const camDetectPoseInWorker = () => {
    workerRef.current?.postMessage({
      type: 'CAM_DETECT_POSE',
      data: {
        videoElement: camRef.current,
        canvasElement: camcanvasRef.current,
      },
    });
  };

  useEffect(() => {
    setupCamera().then(() => init());

    return () => {
      if (checkAnimationRef.current !== null) {
        cancelAnimationFrame(checkAnimationRef.current);
      }
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      workerRef.current?.terminate();
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
      {/* <Firework /> */}
      {detectedArmsUp ? (
        <div className="container">
          <video ref={camRef} className="cam-video" style={{ display: 'none' }} autoPlay muted />
          <video ref={videoRef} className="game-video" style={{ display: 'none' }} autoPlay />

          <canvas ref={camcanvasRef} className="canvas cam-canvas" style={{ transform: 'scaleX(-1)' }} />
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
          <canvas ref={camcanvasRef} className="canvas cam-canvas" style={{ transform: 'scaleX(-1)' }} />
          <canvas ref={canvasRef} className="canvas video-canvas" />
        </div>
      )}
    </div>
  );
};

export default PoseEstimator;
