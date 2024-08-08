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

const CreateGame: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const videoIntervalRef = useRef<any>(null);

  const detector = useRef<PoseDetector>();
  const videoKeypoints = useRef<Object[]>([]);

  const isDetecting = useRef(false);

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


  // const videoDetect = async () => {
  //     const posesKeypoints = await detectPose(detector.current!);
  // };

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

  let cnt = 1;
  const detectPose = async (detector: PoseDetector) => {
    if (videoRef.current && canvasRef.current) {
      if (isDetecting.current) {
        if (videoRef.current.paused || videoRef.current.ended) {
          clearInterval(videoIntervalRef.current);
          return;
        }
      }
      
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        
        if (!isDetecting.current && videoRef.current) {
          isDetecting.current = true;
          videoRef.current.currentTime = 0;
          videoRef.current.play()
        }

        if (isDetecting.current) {
          const poses = await detector.estimatePoses(videoRef.current);
          
          if (poses.length > 0) {
            videoKeypoints.current.push(poses[0].keypoints!);
            console.log(cnt++, poses);
            drawGreen(ctx, poses[0].keypoints);
            return poses[0].keypoints;
          }
        }
      }
    }
  };

  // json 저장하기
  const saveKeypointsAsJson = () => {
    // keypoints를 JSON 문자열로 변환
    const json = JSON.stringify(videoKeypoints.current, null, 2); // 2는 들여쓰기를 위한 값

    // Blob 객체 생성
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // 다운로드를 위한 링크 생성
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keypoints2.json'; // 파일 이름
    document.body.appendChild(a);
    a.click(); // 링크 클릭하여 다운로드 시작
    document.body.removeChild(a); // 링크 제거
    URL.revokeObjectURL(url); // URL 객체 해제
  };

  // 임시 테스트
  const info = () => {
    console.log(videoKeypoints);
    console.log(videoKeypoints.current.length);
    console.log(videoIntervalRef.current[videoKeypoints.current.length - 1]);
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
          <NeonButton onClick={saveKeypointsAsJson}>저장</NeonButton>
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

export default CreateGame;
