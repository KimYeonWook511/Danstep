import React, { useEffect, useRef, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createDetector, PoseDetector, SupportedModels } from '@tensorflow-models/pose-detection';
import '../../canvas.css';
import '../neon/Neon.css';
import '../neon/TopBar.css';
import { drawGreen } from '../utils/DrawUtils';
import NeonButton from '../neon/NeonButton';
import NeonCircle from '../neon/NeonCircle';
import ThreeStars from '../neon/ThreeStars';

const CreateTest: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const videoIntervalRef = useRef<any>(null);

  const detector = useRef<PoseDetector>();
  const videoKeypoints = useRef<Object[]>([]);

  useEffect(() => {
    init();

    // videoRef.current!.onloadedmetadata = async () => {
    //     await videoRef.current!.play();
    // };

    return () => {
      if (videoIntervalRef.current) {
        console.log("end videoIntervalRef")
        clearInterval(videoIntervalRef.current);
      }
    };
  }, []);

  const init = async () => {
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
    }
  };

  const setupVideo = async () => {
    if (videoRef.current) {
      videoRef.current.src = 'proto2.mp4'; // 비디오 파일 경로를 설정하세요.
      return new Promise<HTMLVideoElement>((resolve) => {
        videoRef.current!.onloadedmetadata = async () => {
          // await videoRef.current!.play();
          resolve(videoRef.current!);
        };
      });
    }
    return null;
  };

  const keypointsJson = useRef([]);
  const idx = useRef(0);
  const len = useRef(0);
  const fetchKeypoints = async () => {
    const jsonUrl = '/keypoints423.json'; // 로컬 JSON 파일의 상대 경로

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

  const detectPose = async (detector: PoseDetector) => {
    if (idx.current >= len.current) {
      console.log("끝입니다")
      clearInterval(videoIntervalRef.current);
      return;
    }

    if (videoRef.current && canvasRef.current) {
      // if (videoRef.current.paused || videoRef.current.ended) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        
          if (idx.current == 0 && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play()
          }

          const poses = keypointsJson.current[idx.current++];
          console.log(idx.current, poses);

          if (poses) drawGreen(ctx, poses);
          return poses;
      }
    }
  };

  // 임시 테스트
  const info = () => {
    console.log(keypointsJson);
    console.log(keypointsJson.current.length);
    console.log(keypointsJson.current[keypointsJson.current.length - 1]);
  }

  return (
    <div className="Neon">
      <ThreeStars />
      <div className="topBar">
        <div className="left">
          <NeonButton onClick={() => {
              videoIntervalRef.current = setInterval(async () => await detectPose(detector.current!), 50);
            }
          }>재생</NeonButton>
        </div>
        <div className="center">
          {/* <ScoreDisplay score={health.current} /> */}
        </div>
        <div className="right">
          <NeonButton onClick={() => console.log("저장할게 없어용")}>저장</NeonButton>
          <NeonButton onClick={info}>?</NeonButton>
        </div>
      </div>
      <NeonCircle />
      <div className="container" style={{zIndex:"10"}}>
        <video ref={videoRef} className="game-video" style={{ display: 'none' }} autoPlay />
        <canvas ref={canvasRef} className="canvas video-canvas" />
      </div>
    </div>
  );
};

export default CreateTest;
