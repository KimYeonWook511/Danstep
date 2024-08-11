import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createDetector, PoseDetector, SupportedModels, Keypoint } from '@tensorflow-models/pose-detection';
import '../../canvas.css';
import '../neon/Neon.css';
import '../neon/TopBar.css';
import { detectFirstFrame, checkInitialYAlignment, isArmsUp, keypointsDetected } from '../utils/Verification';
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
import ResultModal from './ResultModal';
import { useNavigate } from 'react-router-dom';
import Guide from '../../components/Guide';
import ComboEffect from './ComboEffect';
import LifeEffect from './LifeEffect';
import axios from 'axios';
import Loader from '../../components/Loading'

interface Game {
  id: number;
  title : string;
  uploadDate : string;
  playtime : number;
  thumbnailFilename : string;
  auidoFilename : string;
  poseFilename : string;
  videoFilename : string;
  backgroundFilenmae : string;
  level : number;
  thumbnailUrl: string;
  audioUrl : string;
  backgroundUrl : string;
  poseData : object;
}

interface PoseEstimatorProps {
  game: Game;
}

const PoseEstimator: React.FC<PoseEstimatorProps> = ({ game }) => {
  const navigate = useNavigate();
  const camRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const camcanvasRef = useRef<HTMLCanvasElement>(null);

  const [showPoseEstimator, setShowPoseEstimator] = useState(false);

  // requestAnimationFrame -> setInterval로 변경
  const intervalRef = useRef<any>(null);

  const firstFrameY = useRef<number[]>([]);

  const requiredKeypointsIndices = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];

  const yAligned = useRef(0);
  const isYAligned = useRef(false);
  const isCheckEnd = useRef(false);
  let iskeypoint = false;

  const bad = useRef(0);
  const good = useRef(0);
  const great = useRef(0);
  const perfect = useRef(0);
  const health = useRef(100);
  const combo = useRef(0);
  const maxCombo = useRef(0);
  const grade = useRef('');

  const [yAlignedState, setYAlignedState] = useState(isYAligned.current);
  const [detectedArmsUp, setDetectedArmsUp] = useState<boolean>(false);
  const [scores, setScores] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [state, setState] = useState<boolean>(false);

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

    const camera = await setupCamera();
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

      // if(camera && video && detector.current && camdetector.current && checkdetector.current){
      //   setState(true);
      // }
      // 첫 프레임 가져오기
      await detectFirstFrame(keypointsJson.current[0], firstFrameY);

      // 시작 동작 검사 (만세)
      console.log('동작 검사 시작');
      intervalRef.current = setInterval(async () => await checkDetect(), 50);
    }
  };

  const checkDetect = async () => {
    if (isCheckEnd.current) return;

    isYAligned.current = false;
    setYAlignedState(isYAligned.current);

    const checkKeypoints = await checkdetectPose(checkdetector.current!);
    yAligned.current = await checkInitialYAlignment(camdetector.current!, camRef, firstFrameY);

    if (checkKeypoints && checkKeypoints.length > 0) {
      iskeypoint = keypointsDetected(checkKeypoints!, requiredKeypointsIndices);

      if (iskeypoint) {
        // 프레임 안에 모든 키포인트가 다 들어가 있는지 체크
        if (yAligned.current > -0.5 && yAligned.current < 0.5) {
          console.log('키포인트 인식이 완료되었습니다!!!!');
          isYAligned.current = true;
          setYAlignedState(isYAligned.current);
        } else {
          if (yAligned.current < -0.5) console.log('카메라에서 멀어지세요');
          if (yAligned.current > 0.5) console.log('카메라로 가까이 오세요');
        }

        if (isYAligned.current) {
          // 영상의 비율과 나의 비율이 맞는지 체크

          if (isArmsUp(checkKeypoints)) {
            // 손 들었는지 체크
            setDetectedArmsUp(true);
            console.log('타이머 시작');
            // clearInterval(intervalRef.current!);
            isCheckEnd.current = true;
            startTimer();
            return;
          }

          console.log('프레임이 초록색일 때 머리 위로 동그라미를 만들면 게임이 시작됩니다.');
          return;
        }

        return;
      }

      console.log('몸 전체가 프레임 안에 들어오도록 해주세요');
      return;
    }

    console.log('인식이 안 되고 있는 거 같아요');
  };

  const startTimer = () => {
    let nowTime = 0;

    return new Promise<void>((resolve) => {
      const intervalTimer = setInterval(() => {
        nowTime += 100;

        console.log(nowTime / 1000 + '초');

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
      console.log('끝!!!');
      clearInterval(intervalRef.current);
      return;
    }

    if (idx.current === -1 && videoRef.current) {
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

          updateScores(averageScore, bad, good, great, perfect, health, combo, maxCombo, grade);

          // console.log("bad: ", bad, good, great, perfect, health);

          videoRef.current!.onended = () => {
            console.log('끝났으니 결과 보내기!');
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
      videoRef.current.src = game.audioUrl; // 비디오 파일 경로를 설정하세요.
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
    if (videoRef.current && camRef.current && canvasRef.current && camcanvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      if (videoRef.current.paused || videoRef.current.ended) return;

      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.width = 720;
        canvasRef.current.height = 1280;
        console.log(canvasRef.current)
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
      setState(true);
      const ctx = camcanvasRef.current.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, camcanvasRef.current.width, camcanvasRef.current.height);
        camcanvasRef.current.width = camRef.current.videoWidth;
        camcanvasRef.current.height = camRef.current.videoHeight;

        const checkposes = await detector.estimatePoses(camRef.current);

        if (checkposes[0]) {
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
    try {
      const response = await axios.get(`https://i11a406.p.ssafy.io/api/v1/games/${game.id}/pose`);
      keypointsJson.current = response.data; // API로부터 가져온 JSON 데이터를 keypointsJson에 저장
      len.current = keypointsJson.current.length; // JSON 데이터의 길이 설정
      console.log('Loaded keypoints:', keypointsJson.current); // 로드된 keypoints 출력
      console.log('data length: ', len.current);
    } catch (error) {
      console.error('Error fetching JSON:', error); // 오류 처리
    }
  };

  useEffect(() => {
    init();
  },[game.id]);

  const handleRestart = async () => {
    window.location.reload();
  };

  const moveMainpage = () => {
    // 카메라 스트림을 정지시키는 로직 추가
    if (camRef.current && camRef.current.srcObject) {
      const stream = camRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop()); // 모든 트랙을 정지
      camRef.current.srcObject = null; // 참조를 제거하여 메모리 누수 방지
    }

    navigate('/');
  };
  const handleShowPoseEstimator = () => {
    setShowPoseEstimator((prev) => !prev);
  };

  return (
    <div className='Neon'>
      {/* <ThreeStars /> */}
      <div className='topBar'>
        <div className='left'>
          <NeonButton onClick={moveMainpage}>Back</NeonButton>
        </div>
        {/* <div className="center">
          <ScoreDisplay score={health.current} />
        </div> */}
        <div className='right'>
          <NeonButton onClick={handleRestart}>Retry</NeonButton>
          <NeonButton onClick={handleShowPoseEstimator}>?</NeonButton>
        </div>
      </div>
      {showPoseEstimator && <Guide onShowPoseEstimator={handleShowPoseEstimator} />}
      {!state && <Loader/>}
      <RainbowHealthBar health={health.current} />
      <NeonCircle />

      <div style={{ width: '100%', height: '100%', display: 'flex', marginTop: '100px' }}>
        <div
          className={`container ${detectedArmsUp ? 'no-border' : isYAligned.current ? 'aligned' : 'not-aligned'}`}
          style={{ width: '100%', height: '90%' }}
        >
          {detectedArmsUp ? (
            <>
              <video
                ref={videoRef}
                className='game-video'
                style={{ display: 'none' }}
                autoPlay
              />
              <canvas
                ref={canvasRef}
                className='canvas video-canvas'
              />

              {/* {isFinished && (
                <button
                  className='button'
                  onClick={handleRestart}
                  style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}
                >
                  Restart
                </button>
              )} */}
            </>
          ) : (
            <>
              <video
                ref={videoRef}
                className='game-video'
                style={{ display: 'none' }}
                autoPlay
                muted
              />
              <canvas
                ref={canvasRef}
                className='canvas video-canvas'
              />
            </>
          )}
        </div>
        <div
          style={{
            width: '100%',
            height: '90%',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {detectedArmsUp ? (
            <>
              <ComboEffect
                combo={combo.current}
                grade={grade.current}
              />

              <LifeEffect health={health.current} />
            </>
          ) : (
            <div
              className='animated-text combo'
              style={{ fontFamily: 'neon-text' }}
            >
              Are You Ready
            </div>
          )}
        </div>
        <div
          className={`container ${detectedArmsUp ? 'no-border' : isYAligned.current ? 'aligned' : 'not-aligned'}`}
          style={{ width: '100%', height: '90%' }}
        >
          {detectedArmsUp ? (
            <>
              <video
                ref={camRef}
                className='cam-video'
                style={{ display: 'none' }}
                autoPlay
                muted
              />

              <canvas
                ref={camcanvasRef}
                className='canvas cam-canvas'
                style={{ transform: 'scaleX(-1)' }}
              />

              {/* {isFinished && (
                <button
                  className='button'
                  onClick={handleRestart}
                  style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}
                >
                  Restart
                </button>
              )} */}
            </>
          ) : (
            <>
              <video
                ref={camRef}
                className='cam-video'
                style={{ display: 'none' }}
                autoPlay
                muted
              />
              <canvas
                ref={camcanvasRef}
                className='canvas cam-canvas'
                style={{ transform: 'scaleX(-1)' }}
              />
            </>
          )}
        </div>
      </div>
      <ResultModal
        isOpen={isFinished}
        onClose={handleRestart}
        score={health.current}
        bad={bad.current}
        good={good.current}
        great={great.current}
        perfect={perfect.current}
        maxCombo={maxCombo.current}
        poseData={JSON.stringify(camKeypoints.current, null, 2)}
        gameInfoId={game.id}
      />
    </div>
  );
};

export default PoseEstimator;
