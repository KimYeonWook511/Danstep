import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createDetector, PoseDetector, SupportedModels, Keypoint } from '@tensorflow-models/pose-detection';
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

const PoseEstimatorJson: React.FC = () => {
  const camRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const camcanvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  const checkAnimationRef = useRef<number | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  // 임시
  // const intervalFrameRef = useRef<any>(null);
  // const checkIntervalRef = useRef<any>(null);

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

  const detector = useRef<PoseDetector>();
  const camdetector = useRef<PoseDetector>();
  const checkdetector = useRef<PoseDetector>();

  const startTime = useRef(0); // let startTime: number | null = null;
  const lastLoggedSecond = useRef(0);

  // const camKeypoints : Object[] = [];
  const camKeypoints = useRef<Object[]>([]);

  const init = useCallback(async () => {
    await tf.setBackend('webgl');
    await tf.ready();
    const video = await setupVideo();
    await fetchKeypoints();

    if (video) {
      const modelConfig = {
        runtime: 'mediapipe',
        modelType: 'full',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/',
        render3D: true,
      };

      detector.current = await createDetector(SupportedModels.BlazePose, modelConfig);
      camdetector.current = await createDetector(SupportedModels.BlazePose, modelConfig);
      checkdetector.current = await createDetector(SupportedModels.BlazePose, modelConfig);

      // 첫 프레임 가져오기
      await detectFirstFrame(keypointsJson.current[0], firstFrameZ);

      // 시작 동작 검사 (만세)
      console.log("동작 검사 시작");
      checkAnimationRef.current = requestAnimationFrame(checkDetect);
    }
  }, []);

  const checkDetect = async () => {
    console.log("checkDetect 실행중!")
    if (checkAnimationRef.current == null) return;

    const checkKeypoints = await checkdetectPose(checkdetector.current!);
    isZAligned = await checkInitialZAlignment(camdetector.current!, camRef, firstFrameZ);

    if (checkKeypoints && checkKeypoints.length > 0) {
      iskeypoint = keypointsDetected(checkKeypoints!, requiredKeypointsIndices);
    }

    if (checkKeypoints && isArmsUp(checkKeypoints) && iskeypoint) {
      setDetectedArmsUp(true);
      cancelAnimationFrame(checkAnimationRef.current!);
      checkAnimationRef.current = null;

      if (isZAligned) {
        console.log("타이머 시작");
        animationFrameIdRef.current = requestAnimationFrame(startTimer);
      } else {
        // 여기 손봐야함
        console.log('Initial Z alignment failed.');
        console.log("동작 재 검사");
        checkAnimationRef.current = requestAnimationFrame(checkDetect);
      }

      return;
    }
    
    checkAnimationRef.current = requestAnimationFrame(checkDetect);
  }

  const startTimer = (timestamp: number) => {
    if (startTime.current == 0) {
      startTime.current = timestamp;
    }

    const elapsed = timestamp - startTime.current;
    const seconds = Math.floor(elapsed / 1000);

    if (seconds > lastLoggedSecond.current && seconds <= 3) {
      lastLoggedSecond.current = seconds;
      console.log(`${seconds} second${seconds > 1 ? 's' : ''}`);
    }

    if (elapsed >= 3000) {
      videoRef.current!.play();
      // camDetect();
      // await camDetect();
      animationFrameIdRef.current = requestAnimationFrame(camDetect);
    } else {
      animationFrameIdRef.current = requestAnimationFrame(startTimer);
    }
  }

  const camDetect = async () => {
      // const posesKeypoints = await detectPose(detector);
      console.log(idx.current);
      const posesKeypoints = drawJson(keypointsJson.current[idx.current++]);
      const camKeypoints = await camdetectPose(camdetector.current!);

      setScores((prevScores) => {
        const newScores = [...prevScores];

        if (posesKeypoints && camKeypoints) {
          const sum = calculateScore(posesKeypoints, camKeypoints);
          newScores.push(sum);

          if (newScores.length === 16) {
            const averageScore = newScores.reduce((a, b) => a + b, 0) / 16;
            console.log('Average Score:', averageScore);

            updateScores(averageScore, bad, good, great, perfect, health);
            // console.log("bad: ", bad, good, great, perfect, health);

            videoRef.current!.onended = () => {
              console.log("끝났으니 결과 보내기!");
              // sendScores({
              //   bad: bad.current,
              //   good: good.current,
              //   great: great.current,
              //   perfect: perfect.current,
              //   health: health.current,
              // });
              setIsFinished(true);
            };
            return [];
          }
        }
        return newScores;
      });

      if (idx.current < len.current) {
        animationFrameIdRef.current = requestAnimationFrame(camDetect);
      }
  };

  const setupVideo = useCallback(async () => {
    if (videoRef.current) {
      videoRef.current.src = 'proto2.mp4'; // 비디오 파일 경로를 설정하세요.
      return new Promise<HTMLVideoElement>((resolve) => {
        videoRef.current!.onloadedmetadata = () => {
          // videoRef.current!.play();
          videoRef.current!.pause(); // 이거 안 넣어도 되지 않나??
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

  // json으로 바꾸면서 사용하지 않음 -> 나중에 영상 업로드 페이지에서 쓰여야 할 듯
  // const detectPose = useCallback(async (detector: PoseDetector) => {
  //   if (videoRef.current && camRef.current && canvasRef.current) {
  //     const ctx = canvasRef.current.getContext('2d');
  //     if (videoRef.current.paused || videoRef.current.ended) return;
  //     if (ctx) {
  //         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  //         canvasRef.current.width = videoRef.current.videoWidth;
  //         canvasRef.current.height = videoRef.current.videoHeight;
        
  //         const poses = await detector.estimatePoses(videoRef.current);
  //         if (poses[0]) drawGreen(ctx, poses[0].keypoints);
  //         return poses[0]?.keypoints;
  //     }
  //   }
  // }, []);

  const drawJson = useCallback((keypoints: Keypoint[]) => {
    if (videoRef.current && camRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      if (videoRef.current.paused || videoRef.current.ended) return;

      if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        
          if (keypoints) drawGreen(ctx, keypoints);
          return keypoints;
      }
    }
  }, []);

  const camdetectPose = useCallback(async (detector: PoseDetector) => {
    if (videoRef.current && camRef.current && camcanvasRef.current) {
      const ctx = camcanvasRef.current.getContext('2d');

      if (videoRef.current.paused || videoRef.current.ended) return;

      if (ctx) {
          ctx.clearRect(0, 0, camcanvasRef.current.width, camcanvasRef.current.height);
          camcanvasRef.current.width = camRef.current.videoWidth;
          camcanvasRef.current.height = camRef.current.videoHeight;

          const camposes = await detector.estimatePoses(camRef.current);
          camKeypoints.current.push(camposes[0].keypoints);

          if (camposes[0]) drawRed(ctx, camposes[0].keypoints);
          return camposes[0]?.keypoints;
      }
    }
  }, []);

  const checkdetectPose = useCallback(async (detector: PoseDetector) => {
    if (camRef.current && camcanvasRef.current) {
      const ctx = camcanvasRef.current.getContext('2d');

      if (ctx) {
          ctx.clearRect(0, 0, camcanvasRef.current.width, camcanvasRef.current.height);
          camcanvasRef.current.width = camRef.current.videoWidth;
          camcanvasRef.current.height = camRef.current.videoHeight;

          const checkposes = await detector.estimatePoses(camRef.current);

          if (checkposes[0]) drawRed(ctx, checkposes[0].keypoints);
          return checkposes[0]?.keypoints;
      }
    }
  }, []);

  // json 저장하기
  const saveKeypointsAsJson = () => {
    // keypoints를 JSON 문자열로 변환
    const json = JSON.stringify(camKeypoints.current, null, 2); // 2는 들여쓰기를 위한 값

    // Blob 객체 생성
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // 다운로드를 위한 링크 생성
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keypoints.json'; // 파일 이름
    document.body.appendChild(a);
    a.click(); // 링크 클릭하여 다운로드 시작
    document.body.removeChild(a); // 링크 제거
    URL.revokeObjectURL(url); // URL 객체 해제
  };

  const keypointsJson = useRef([]);
  const idx = useRef(0);
  const len = useRef(0);
  const jsonUrl = '/keypoints.json'; // 로컬 JSON 파일의 상대 경로
  const fetchKeypoints = async () => {
      try {
          const response = await fetch(jsonUrl);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json(); // JSON 데이터 파싱
          keypointsJson.current = data;
          len.current = keypointsJson.current.length;
          console.log("Loaded keypoints:", keypointsJson.current); // 로드된 keypoints 출력
          console.log("data length: ", len.current);
      } catch (error) {
          console.error("Error fetching JSON:", error); // 오류 처리
      }
  };

  useEffect(() => {
    setupCamera().then(() => init());

    return () => {
      if (checkAnimationRef.current) {
        console.log("end checkAnimationRef")
        cancelAnimationFrame(checkAnimationRef.current);
      }

      if (animationFrameIdRef.current) {
        console.log("end animationFrameIdRef")
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
      {/* <NeonRating /> */}
      {detectedArmsUp ? (
        <div className="container" style={{zIndex:"10"}}>
          <video ref={camRef} className="cam-video" style={{ display: 'none' }} autoPlay muted />
          <video ref={videoRef} className="game-video" style={{ display: 'none' }} autoPlay />
          <canvas ref={camcanvasRef} className="canvas cam-canvas" style={{ transform: 'scaleX(-1)' }}/>
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
        <div className="container" style={{zIndex:"10"}}>
          <video ref={camRef} className="cam-video" autoPlay muted />
          <video ref={videoRef} className="game-video" autoPlay muted />
          <canvas ref={camcanvasRef} className="canvas cam-canvas" style={{ transform: 'scaleX(-1)' }}/>
          <canvas ref={canvasRef} className="canvas video-canvas" />
        </div>
      )}
    </div>
  );
};

export default PoseEstimatorJson;
