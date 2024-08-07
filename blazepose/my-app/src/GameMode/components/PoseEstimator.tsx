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
import { drawGreen, drawHandFoot, drawRed } from '../utils/DrawUtils';
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

  // requestAnimationFrame -> setInterval로 변경
  const intervalRef = useRef<any>(null);

  const firstFrameZ = useRef<number[]>([]);

  const requiredKeypointsIndices = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];

  const isZAligned = useRef(false);
  const isCheckEnd = useRef(false);
  let iskeypoint = false;

  const bad = useRef(0);
  const good = useRef(0);
  const great = useRef(0);
  const perfect = useRef(0);
  const health = useRef(100);

  const [detectedArmsUp, setDetectedArmsUp] = useState<boolean>(false);
  const [scores, setScores] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const keypointsJson = useRef([]);
  const idx = useRef(-1);
  const len = useRef(0);
  const detector = useRef<PoseDetector>();
  const camdetector = useRef<PoseDetector>();
  const checkdetector = useRef<PoseDetector>();

  const camKeypoints = useRef<Object[]>([]);

  const init = async () => {
    await tf.setBackend('webgl');
    await tf.ready();

    await setupCamera();
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
      intervalRef.current = setInterval(async () => await checkDetect(), 50);
    }
  };

  const checkDetect = async () => {
    if (isCheckEnd.current) return;

    const checkKeypoints = await checkdetectPose(checkdetector.current!);
    isZAligned.current = await checkInitialZAlignment(camdetector.current!, camRef, firstFrameZ);

    if (checkKeypoints && checkKeypoints.length > 0) {
      iskeypoint = keypointsDetected(checkKeypoints!, requiredKeypointsIndices);

      if (iskeypoint && isArmsUp(checkKeypoints)) {
        setDetectedArmsUp(true);

        if (isZAligned.current) {
          console.log("타이머 시작");
          clearInterval(intervalRef.current!);
          isCheckEnd.current = true;
          startTimer();
          return;
        }

        console.log('Initial Z alignment failed.');
        console.log("동작 재 검사");
        return;
      }

      console.log("손을 들거나 더 뒤로 가 주세영");
      return;
    }

    console.log("인식이 안 되고 있는 거 같아요");
  }

  const startTimer = () => {
    let nowTime = 0;

    return new Promise<void>((resolve) => {
      const intervalTimer = setInterval(() => {
        nowTime += 100;
  
        if (nowTime % 1000) {
          console.log((nowTime / 1000) + "초");
        }
  
        if (nowTime >= 3000) {
          clearInterval(intervalTimer);
          intervalRef.current = setInterval(async () => await camDetect(), 50);
          resolve();
        }
      }, 100);
    });
  };

  const camDetect = async () => {
    // console.log("camDetect: ", idx.current);
    if (idx.current >= len.current) {
      console.log("끝!!!");
      clearInterval(intervalRef.current);
      return;
    }

    if (idx.current == -1 && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }

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
  };

  const setupVideo = async () => {
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

  const drawJson = (keypoints: Keypoint[]) => {
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
  };

  const camdetectPose = async (detector: PoseDetector) => {
    if (videoRef.current && camRef.current && camcanvasRef.current) {
      const ctx = camcanvasRef.current.getContext('2d');

      if (videoRef.current.paused || videoRef.current.ended) return;

      if (ctx) {
          ctx.clearRect(0, 0, camcanvasRef.current.width, camcanvasRef.current.height);
          camcanvasRef.current.width = camRef.current.videoWidth;
          camcanvasRef.current.height = camRef.current.videoHeight;

          const camposes = await detector.estimatePoses(camRef.current);
          if (camposes.length > 0) {
            camKeypoints.current.push(camposes[0].keypoints);
            drawRed(ctx, camposes[0].keypoints);
            drawHandFoot(ctx, camposes[0].keypoints);
            return camposes[0].keypoints;
          }
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

          if (checkposes[0]){
            drawRed(ctx, checkposes[0].keypoints);
            drawHandFoot(ctx, checkposes[0].keypoints);
            return checkposes[0].keypoints;
          }
      }
    }
  };

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
    a.download = 'userKeypoints.json'; // 파일 이름
    document.body.appendChild(a);
    a.click(); // 링크 클릭하여 다운로드 시작
    document.body.removeChild(a); // 링크 제거
    URL.revokeObjectURL(url); // URL 객체 해제
  };

  const fetchKeypoints = async () => {
    const jsonUrl = '/keypoints424.json'; // 로컬 JSON 파일의 상대 경로
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
    init();
  }, []);

  const handleRestart = () => {
    setDetectedArmsUp(false);
    setIsFinished(false);
    setScores([]);
    firstFrameZ.current = [];
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
        <div className="container">
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
        <div className="container">
          <video ref={camRef} className="cam-video" style={{display:'none'}} autoPlay muted />
          <video ref={videoRef} className="game-video" style={{display:'none'}} autoPlay muted />
          <canvas ref={camcanvasRef} className="canvas cam-canvas" style={{ transform: 'scaleX(-1)' }}/>
          <canvas ref={canvasRef} className="canvas video-canvas" />
        </div>
      )}
    </div>
  );
};

export default PoseEstimator;
