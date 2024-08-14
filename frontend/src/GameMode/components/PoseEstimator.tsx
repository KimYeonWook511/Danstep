import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createDetector, PoseDetector, SupportedModels, Keypoint } from '@tensorflow-models/pose-detection';
import '../../canvas.css';
import '../neon/Neon.css';
import '../neon/TopBar.css';
import { detectFirstFrame, checkInitialYAlignment, isArmsUp, keypointsDetected } from '../utils/Verification';
import { sendScores } from '../utils/Result';
import { drawGreen, drawHandFoot, drawRed,drawHandFootGreen } from '../utils/DrawUtils';
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
import api from "../../api/api";
import Loader from '../../components/Loading';

interface Game {
  id: number;
  title: string;
  uploadDate: string;
  playtime: number;
  thumbnailFilename: string;
  auidoFilename: string;
  poseFilename: string;
  videoFilename: string;
  backgroundFilename: string;
  level: number;
  thumbnailUrl: string;
  audioUrl: string;
  backgroundUrl: string;
  poseData: object;
}

interface PoseEstimatorProps {
  game: Game;
  pauseAudio: () => void;
  resumeAudio: () => void;
}

const PoseEstimator: React.FC<PoseEstimatorProps> = ({ game, pauseAudio, resumeAudio }) => {
  const navigate = useNavigate();
  const camRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const camcanvasRef = useRef<HTMLCanvasElement>(null);

  const [showPoseEstimator, setShowPoseEstimator] = useState(false);

  // requestAnimationFrame -> setInterval로 변경
  const intervalRef = useRef<any>(null);

  const firstFrameY = useRef<number[]>([]);

  // const requiredKeypointsIndices = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
  const requiredKeypointsIndices = [11, 12];

  const yAligned = useRef(0);
  const isYAligned = useRef(false);
  const isCheckEnd = useRef(false);
  const iskeypoint = useRef(false);

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
  const [alignmentMessage, setAlignmentMessage] = useState<string>('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showComboEffect, setShowComboEffect] = useState<boolean>(false);
  const beepSoundRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const keypointsJson = useRef([]);
  const idx = useRef(-1);
  const len = useRef(0);
  const detector = useRef<PoseDetector>();
  const camdetector = useRef<PoseDetector>();
  const checkdetector = useRef<PoseDetector>();
  const animationFrameRef = useRef<number | null>(null);

  const camKeypoints = useRef<Object[]>([]);

  useEffect(() => {
    if (detectedArmsUp) {
      pauseAudio(); // detectedArmsUp이 true일 때 오디오 멈추기
    }
  }, [detectedArmsUp, pauseAudio]);

  const stopDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const releaseDetectors = () => {
    console.log('releaseDetectors => detector 전부 꺼버려~~~~');
    detector.current = undefined;
    camdetector.current = undefined;
    checkdetector.current = undefined;
  };

  const resetState = () => {
    setAlignmentMessage('');
    setShowComboEffect(false);
    setDetectedArmsUp(false);
    setScores([]);
    setCountdown(null);
    setState(false);

    // Refs 초기화
    isYAligned.current = false;
    isCheckEnd.current = false;
    firstFrameY.current = [];
    idx.current = -1;
    health.current = 100;
    bad.current = 0;
    good.current = 0;
    great.current = 0;
    perfect.current = 0;
    combo.current = 0;
    maxCombo.current = 0;
    grade.current = '';

    // Clear intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    if (camcanvasRef.current) {
      const ctx = camcanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, camcanvasRef.current.width, camcanvasRef.current.height);
      }
    }
  };

  useEffect(() => {
    if (!state) {
      // 상태가 false로 바뀔 때 초기화 수행
      resetResource(1);
    }
  }, [state]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isFinished && document.hidden) {
        resetResource(1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isFinished]);

  const init = async () => {
    try {
      await tf.setBackend('webgl');
      await tf.ready();

      const camera = await setupCamera();
      const video = await setupVideo();

      await fetchKeypoints();

      beepSoundRef.current = new Audio('/countdown.mp3');

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

        if (!detector.current || !camdetector.current || !checkdetector.current) {
          throw new Error('포즈 감지 초기화에 실패했습니다.');
        }

        // 첫 프레임 가져오기
        await detectFirstFrame(keypointsJson.current[0], firstFrameY);

        // 시작 동작 검사 (만세)
        console.log('동작 검사 시작');
        intervalRef.current = setInterval(async () => await checkDetect(), 50);
      }
    } catch (error) {
      console.error('init 함수에서 오류 발생:', error);
    }
  };

  const checkDetect = async () => {
    try {
      if (isCheckEnd.current) return;

      if (!checkdetector.current) {
        console.error('checkDetector가 아직 초기화되지 않았습니다.');
        return;
      }

      isYAligned.current = false;

      const checkKeypoints = await checkdetectPose(checkdetector.current);
      yAligned.current = await checkInitialYAlignment(camdetector.current!, camRef, firstFrameY);

      if (checkKeypoints && checkKeypoints.length > 0) {
        iskeypoint.current = keypointsDetected(checkKeypoints, requiredKeypointsIndices);

        if (iskeypoint) {
          if (yAligned.current > -0.5 && yAligned.current < 0.5) {
            console.log('프레임이 초록색일 때 머리 위로 동그라미를 만들면 게임이 시작됩니다.');
            isYAligned.current = true;
            setAlignmentMessage('Hands Up');
          } else {
            setAlignmentMessage(yAligned.current < -0.5 ? 'Go Back' : 'Go front');
            console.log(yAligned.current < -0.5 ? '카메라에서 멀어지세요' : '카메라로 가까이 오세요');
          }

          if (isYAligned.current && isArmsUp(checkKeypoints)) {
            setDetectedArmsUp(true);
            console.log('타이머 시작');
            clearInterval(intervalRef.current);
            isCheckEnd.current = true;
            startTimer();
          }
        } else {
          setAlignmentMessage('inside Frame');
          console.log('몸 전체가 프레임 안에 들어오도록 해주세요');
        }
      } else {
        console.log('인식이 안 되고 있는 것 같습니다.');
      }
    } catch (error) {
      console.error('checkDetect 함수에서 오류 발생:', error);
    }
  };

  const startTimer = (): Promise<void> => {
    return new Promise<void>((resolve) => {
      setCountdown(4); //출력 값

      let countdown = 4; // 카운트다운 시작 값
      let intervalCount = 0; // 50ms마다 증가할 카운트
      const interval = 20; // 20번 50ms를 더하면 1초

      timerIntervalRef.current = setInterval(() => {
        camdetectPose(detector.current!, false); // 포즈 감지 수행 (빨강이)
        drawJson(keypointsJson.current[0], 0); // 초록이

        intervalCount++;

        if (intervalCount === interval) {
          // 1초가 지나면 카운트다운 감소
          intervalCount = 0;
          countdown--;
          setCountdown(countdown);
          playBeep(); // 비프음 재생
        }

        if (countdown <= 0) {
          clearInterval(timerIntervalRef.current!); // 인터벌 종료
          setCountdown(null);
          setShowComboEffect(true);
          intervalRef.current = setInterval(async () => await camDetect(), 50);
          resolve();
        }
      }, 50); // 50ms마다 실행
    });
  };

  const playBeep = () => {
    if (beepSoundRef.current) {
      beepSoundRef.current.play();
    }
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

    const posesKeypoints = drawJson(keypointsJson.current[++idx.current], 1);
    const camKeypoints = await camdetectPose(camdetector.current!, true);

    setScores((prevScores) => {
      const newScores = [...prevScores];

      if (posesKeypoints && camKeypoints) {
        const sum = calculateScore(posesKeypoints, camKeypoints);
        newScores.push(sum);

        if (newScores.length === 8) {
          const averageScore = newScores.reduce((a, b) => a + b, 0) / 8;
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
    try {
      if (videoRef.current) {
        videoRef.current.src = game.audioUrl;

        return new Promise<HTMLVideoElement>((resolve) => {
          videoRef.current!.onloadedmetadata = () => {
            videoRef.current!.pause();
            resolve(videoRef.current!);
          };
        });
      }
    } catch (error) {
      console.error('비디오 설정 중 오류 발생:', error);
      return null;
    }
  };

  const setupCamera = async () => {
    try {
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
    } catch (error) {
      console.error('카메라 설정 중 오류 발생:', error);
      return null;
    }
  };

  const drawJson = (keypoints: Keypoint[], status: number) => {
    if (videoRef.current && camRef.current && canvasRef.current && camcanvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      if (status === 1 && (videoRef.current.paused || videoRef.current.ended)) return;

      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.width = 720;
        canvasRef.current.height = 1280;
        // console.log(canvasRef.current);
        if (keypoints){
          drawGreen(ctx, keypoints);
          drawHandFootGreen(ctx, keypoints);
        }
        return keypoints;
      }
    }
  };

  const camdetectPose = async (detector: PoseDetector, isPush: boolean) => {
    try {
      if (!detector) {
        console.log('감지기가 초기화되지 않았습니다.');
        return;
      }

      if (camRef.current && camcanvasRef.current) {
        const ctx = camcanvasRef.current.getContext('2d');

        if (ctx) {
          ctx.clearRect(0, 0, camcanvasRef.current.width, camcanvasRef.current.height);
          camcanvasRef.current.width = camRef.current.videoWidth;
          camcanvasRef.current.height = camRef.current.videoHeight;

          const camposes = await detector.estimatePoses(camRef.current);
          if (camposes.length > 0) {
            if (isPush) {
              camKeypoints.current.push(camposes[0].keypoints);
            }

            drawRed(ctx, camposes[0].keypoints);
            drawHandFoot(ctx, camposes[0].keypoints);
            return camposes[0].keypoints;
          }
        }
      }
    } catch (error) {
      console.error('camdetectPose 함수에서 오류 발생:', error);
    }
  };

  const checkdetectPose = async (detector: PoseDetector) => {
    if (!detector) {
      console.log('아직 포즈감지 초기화 안됨');
      return;
    }

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
      const response = await api.get(`/games/${game.id}/pose`);
      keypointsJson.current = response.data; // API로부터 가져온 JSON 데이터를 keypointsJson에 저장
      len.current = keypointsJson.current.length; // JSON 데이터의 길이 설정
      console.log('Loaded keypoints:', keypointsJson.current); // 로드된 keypoints 출력
      console.log('data length: ', len.current);
    } catch (error) {
      console.error('Error fetching JSON:', error); // 오류 처리
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await init(); // 비동기 함수 호출
    };

    initialize(); // 비동기 함수 호출
  }, [game.id]);

  // const handleRestart = async () => {
  const resetResource = async (status: number) => {
    // 초록색 스켈레톤이 그려져 있는 캔버스를 초기화합니다.
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // 캔버스 초기화
      }
    }

    // 빨간색 스켈레톤이 그려져 있는 캔버스를 초기화합니다.
    if (camcanvasRef.current) {
      const ctx = camcanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, camcanvasRef.current.width, camcanvasRef.current.height); // 캔버스 초기화
      }
    }

    // 카메라 스트림을 정지시키는 로직 추가
    if (camRef.current && camRef.current.srcObject) {
      const stream = camRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop()); // 모든 트랙을 정지
      camRef.current.srcObject = null; // 참조를 제거하여 메모리 누수 방지
    }

    // 카메라 스트림을 정지시키는 로직 추가
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop()); // 모든 트랙을 정지
      videoRef.current.srcObject = null; // 참조를 제거하여 메모리 누수 방지
    }

    // MediaPipe 리소스를 정리합니다.
    if (detector.current) {
      detector.current = undefined; // close 메서드를 호출하여 리소스를 해제합니다.
    }
    if (camdetector.current) {
      camdetector.current = undefined;
    }
    if (checkdetector.current) {
      checkdetector.current = undefined;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current); // setInterval로 반복 작업이 실행된 경우 정지
      intervalRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // 상태를 초기화합니다.
    // setYAlignedState(false);
    setCountdown(null);
    setShowPoseEstimator(false);
    setAlignmentMessage('');
    setShowComboEffect(false);
    setState(false);
    setDetectedArmsUp(false);
    setIsFinished(false);
    setScores([]);
    yAligned.current = 0;
    isYAligned.current = false;
    isCheckEnd.current = false;
    iskeypoint.current = false;
    firstFrameY.current = [];
    idx.current = -1;
    len.current = 0;
    health.current = 100;
    bad.current = 0;
    good.current = 0;
    great.current = 0;
    perfect.current = 0;
    combo.current = 0;
    maxCombo.current = 0;
    grade.current = '';
    beepSoundRef.current = null;
    keypointsJson.current = [];
    camKeypoints.current = [];
    pauseAudio();

    if (status === 1) {
      // handleRestart
      resumeAudio();
      await init();
    }
    if (status === 2) navigate('/'); // moveMainpage
  };

  // const moveMainpage = () => {
  //   // 상태를 초기화합니다.
  //   // setYAlignedState(false);
  //   setAlignmentMessage('');
  //   setShowComboEffect(false);
  //   setState(false);
  //   setDetectedArmsUp(false);
  //   setScores([]);
  //   isYAligned.current = false;
  //   isCheckEnd.current = false;
  //   firstFrameY.current = [];
  //   idx.current = -1;
  //   health.current = 100;
  //   bad.current = 0;
  //   good.current = 0;
  //   great.current = 0;
  //   perfect.current = 0;
  //   combo.current = 0;
  //   maxCombo.current = 0;

  //   // 카메라 스트림을 정지시키는 로직 추가
  //   if (camRef.current && camRef.current.srcObject) {
  //     const stream = camRef.current.srcObject as MediaStream;
  //     const tracks = stream.getTracks();
  //     tracks.forEach((track) => track.stop()); // 모든 트랙을 정지
  //     camRef.current.srcObject = null; // 참조를 제거하여 메모리 누수 방지
  //   }

  //   // 카메라 스트림을 정지시키는 로직 추가
  //   if (videoRef.current && videoRef.current.srcObject) {
  //     const stream = videoRef.current.srcObject as MediaStream;
  //     const tracks = stream.getTracks();
  //     tracks.forEach((track) => track.stop()); // 모든 트랙을 정지
  //     videoRef.current.srcObject = null; // 참조를 제거하여 메모리 누수 방지
  //   }

  //   // 인식 로직 정지
  //   stopDetection();
  //   releaseDetectors();

  //   if (status === 1) { // handleRestart
  //     resumeAudio();
  //     init();
  //   }
  //   if (status === 2) navigate('/'); // moveMainpage
  // };

  // const moveMainpage = () => {
  //   // 초록색 스켈레톤이 그려져 있는 캔버스를 초기화합니다.
  //   if (canvasRef.current) {
  //     const ctx = canvasRef.current.getContext('2d');
  //     if (ctx) {
  //       ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // 캔버스 초기화
  //     }
  //   }

  //   // 빨간색 스켈레톤이 그려져 있는 캔버스를 초기화합니다.
  //   if (camcanvasRef.current) {
  //     const ctx = camcanvasRef.current.getContext('2d');
  //     if (ctx) {
  //       ctx.clearRect(0, 0, camcanvasRef.current.width, camcanvasRef.current.height); // 캔버스 초기화
  //     }
  //   }

  //   // 카메라 스트림을 정지시키는 로직 추가
  //   if (camRef.current && camRef.current.srcObject) {
  //     const stream = camRef.current.srcObject as MediaStream;
  //     const tracks = stream.getTracks();
  //     tracks.forEach((track) => track.stop()); // 모든 트랙을 정지
  //     camRef.current.srcObject = null; // 참조를 제거하여 메모리 누수 방지
  //   }

  //   // 카메라 스트림을 정지시키는 로직 추가
  //   if (videoRef.current && videoRef.current.srcObject) {
  //     const stream = videoRef.current.srcObject as MediaStream;
  //     const tracks = stream.getTracks();
  //     tracks.forEach((track) => track.stop()); // 모든 트랙을 정지
  //     videoRef.current.srcObject = null; // 참조를 제거하여 메모리 누수 방지
  //   }

  //   // MediaPipe 리소스를 정리합니다.
  //   if (detector.current) {
  //     detector.current = undefined; // close 메서드를 호출하여 리소스를 해제합니다.
  //   }
  //   if (camdetector.current) {
  //     camdetector.current = undefined;
  //   }
  //   if (checkdetector.current) {
  //     checkdetector.current = undefined;
  //   }

  //   if (intervalRef.current) {
  //     clearInterval(intervalRef.current); // setInterval로 반복 작업이 실행된 경우 정지
  //     intervalRef.current = null;
  //   }

  //   // 상태를 초기화합니다.
  //   // setYAlignedState(false);
  //   setCountdown(null);
  //   setShowPoseEstimator(false)
  //   setAlignmentMessage('');
  //   setShowComboEffect(false);
  //   setState(false);
  //   setDetectedArmsUp(false);
  //   setIsFinished(false);
  //   setScores([]);
  //   yAligned.current = 0;
  //   isYAligned.current = false;
  //   isCheckEnd.current = false;
  //   iskeypoint.current = false;
  //   firstFrameY.current = [];
  //   idx.current = -1;
  //   len.current = 0;
  //   health.current = 100;
  //   bad.current = 0;
  //   good.current = 0;
  //   great.current = 0;
  //   perfect.current = 0;
  //   combo.current = 0;
  //   maxCombo.current = 0;
  //   grade.current = '';
  //   beepSoundRef.current = null;
  //   keypointsJson.current = [];
  //   camKeypoints.current = [];

  //   navigate('/');
  // };

  const handleShowPoseEstimator = () => {
    setShowPoseEstimator((prev) => !prev);
  };

  return (
    <div className='Neon'>
      {(state || isFinished) && ( // 로딩이 완료된 후에만 TopNav를 렌더링
        <div className='topBar'>
          <div className='left'>
            <NeonButton onClick={() => resetResource(2)}>Back</NeonButton>
          </div>
          <div className='right'>
            <NeonButton
              onClick={() => resetResource(1)}
              isRetry
            >
              Retry
            </NeonButton>
            <NeonButton onClick={handleShowPoseEstimator}>?</NeonButton>
          </div>
        </div>
      )}
      {showPoseEstimator && <Guide onShowPoseEstimator={handleShowPoseEstimator} />}
      {!state && <Loader />}

      <NeonCircle />

      <div style={{ width: '100%', height: '100%', display: 'flex', marginTop: '100px' }}>
        <div
          style={{
            right: '10px',
            bottom: '10px',
            width: '5%',
            height: '90%',
            background: 'none' /* Remove the background */,
            overflow: 'hidden',
            display: 'hidden',
            alignItems: 'flex-end',
            marginRight: '10px',
            marginLeft: '10px',
          }}
        ></div>

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
            showComboEffect ? (
              <ComboEffect
                combo={combo.current}
                grade={grade.current}
              />
            ) : (
              <div
                className='animated-text combo'
                style={{ fontFamily: 'neon-number', fontSize: '100px' }}
              >
                {countdown === 4 ? null : countdown}
              </div>
            )
          ) : (
            <div
              className='animated-text combo'
              style={{ fontFamily: 'neon-text', fontSize: '100px' }}
            >
              {alignmentMessage}
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
        <RainbowHealthBar health={health.current} />
      </div>
      <ResultModal
        isOpen={isFinished}
        onClose={() => resetResource(2)}
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
