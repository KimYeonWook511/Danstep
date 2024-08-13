import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createDetector, PoseDetector, SupportedModels, Keypoint } from '@tensorflow-models/pose-detection';
import '../../canvas.css';
import '../../GameMode/neon/Neon.css';
import '../../GameMode/neon/TopBar.css';
import './Replay.css';
import { drawGreen, drawHandFoot, drawRed } from '../../GameMode/utils/DrawUtils';
import { calculateScore } from '../../GameMode/utils/CalculateUtils';
import { updateScores } from '../../GameMode/utils/ScoreUtils';
import NeonButton from '../../GameMode/neon/NeonButton';
import RainbowHealthBar from '../../GameMode/neon/RainbowHealthBar';
import NeonCircle from '../../GameMode/neon/NeonCircle';
// import ResultModal from './ResultModal';
import { useNavigate } from 'react-router-dom';
import ComboEffect from '../../GameMode/components/ComboEffect';
import axios from 'axios';
import Loader from '../../components/Loading';
import  { jwtDecode,JwtPayload } from 'jwt-decode';
import ResultModalReplay from './ResultModalReplay';

interface CustomJwtPayload extends JwtPayload {
    username: string;
  }

const Replay: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const camcanvasRef = useRef<HTMLCanvasElement>(null);

  const [showPoseEstimator, setShowPoseEstimator] = useState(false);

  // requestAnimationFrame -> setInterval로 변경
  const intervalRef = useRef<any>(null);

  const firstFrameY = useRef<number[]>([]);

  const requiredKeypointsIndices = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
  // const requiredKeypointsIndices = [11, 12];

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
  const [alignmentMessage, setAlignmentMessage] = useState<string>('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showComboEffect, setShowComboEffect] = useState<boolean>(false);
  const beepSoundRef = useRef<HTMLAudioElement | null>(null);
  const SoundRef = useRef<HTMLAudioElement | null>(null);

  const keypointsJson = useRef([]);
  const camKeypointJson = useRef([]);
  const audioUrl = useRef<string>('');
const backgroundUrl = useRef<string>('');
const [username, setUsername] = useState('');
const resultInfoId = useRef([]);


  const idx = useRef(-1);
  const len = useRef(0);
  const camLen = useRef(0);

  const setupVideo = async () => { 
    if (videoRef.current) {
      videoRef.current.src = audioUrl.current; // 비디오 파일 경로를 설정하세요.
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


  const data = async () => {
    try {
        // axios 요청 주소 수정 필요
        const accessToken = localStorage.getItem('accessToken');
        const decodedToken = jwtDecode<CustomJwtPayload>(accessToken!);
        const username = decodedToken.username;
        console.log(username);
        setUsername(username);

        const response = await axios.get(`https://i11a406.p.ssafy.io/api/v1/results/${username}/replay/7`, {
            headers: {
                'Authorization': accessToken,
            }
        });
        console.log(response);
        // resultInfoId props로 받아오기
        keypointsJson.current = JSON.parse(response.data.gamePoseData); // 영상 keypoint
        camKeypointJson.current = JSON.parse(response.data.myPoseData); // API로부터 가져온 JSON 데이터를 keypointsJson에 저장
        len.current = keypointsJson.current.length; // JSON 데이터의 길이 설정
        audioUrl.current = response.data.audioUrl as string;
        backgroundUrl.current = response.data.backgroundUrl as string;
        SoundRef.current = new Audio(audioUrl.current);
        console.log('keypoints:', keypointsJson.current);
        console.log('Loaded keypoints:', camKeypointJson.current); // 로드된 keypoints 출력
        // console.log('data length: ', camLen.current);
    } catch (error) {
        console.error('Error fetching JSON:', error); // 오류 처리
    }
};


  const init = async () => {
    const video = await setupVideo();

    beepSoundRef.current = new Audio('/countdown.mp3');
}
const startTimer = () => {
  let startTime = Date.now();
  setCountdown(4);

  return new Promise<void>((resolve) => {
    const tick = () => {
      const nowTime = Date.now();
      const elapsedTime = nowTime - startTime;
      const secondsLeft = 4 - Math.floor(elapsedTime / 1000);

      if (secondsLeft > 0) {
        setCountdown(secondsLeft);
        console.log('\n' + countdown + '\n');
        // 포즈 감지 수행 (빨강이)
        drawCamJson(keypointsJson.current[0], 0);

        // 초록이
        drawJson(keypointsJson.current[0], 0);

        // 다음 프레임 요청
        requestAnimationFrame(tick);
        console.log('requestAnimationFrame');
      } else {
        // if(videoRef.current)
        // videoRef.current.play();
        setCountdown(null);
        setShowComboEffect(true);
        intervalRef.current = setInterval(async () => await camDetect(), 50);
        resolve();
      }
    };

    tick(); // 첫 프레임 시작
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
      SoundRef.current!.pause();
      return;
    }

    // if (idx.current === -1 && videoRef.current) {
    //   videoRef.current.currentTime = 0;
    //   
    // }
    const posesKeypoints = drawJson(keypointsJson.current[idx.current], 1);
    const camKeypoints = drawCamJson(camKeypointJson.current[++idx.current], 1);

    setScores((prevScores) => {
      const newScores = [...prevScores];

      if (posesKeypoints && camKeypoints) {
        const sum = calculateScore(posesKeypoints, camKeypoints);
        newScores.push(sum);

        if (newScores.length === 16) {
          const averageScore = newScores.reduce((a, b) => a + b, 0) / 16;
          console.log('Average Score:', averageScore);

          updateScores(averageScore, bad, good, great, perfect, health, combo, maxCombo, grade);

          SoundRef.current!.onended = () => {
            console.log('끝났으니 결과 보내기!');

            setIsFinished(true);
          };
          return [];
        }
      }
      return newScores;
    });
  };

  

  const drawJson = (keypoints: Keypoint[] | undefined, status: number) => {
    // if (videoRef.current && canvasRef.current && camcanvasRef.current) {
    if (SoundRef.current && canvasRef.current && camcanvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');

        // if (status === 1 && (videoRef.current.paused || videoRef.current.ended)) return;
        if(status === 1 && (SoundRef.current.paused || SoundRef.current.ended)) {
          SoundRef.current.currentTime = 0;
          SoundRef.current.play();
        }

        if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            canvasRef.current.width = 720;
            canvasRef.current.height = 1280;

            if (keypoints && keypoints.length > 0) {
                drawGreen(ctx, keypoints);
            } else {
                console.warn('Keypoints are undefined or empty in drawJson');
            }
            return keypoints;
        }
    }
    return undefined;
};

const drawCamJson = (keypoints: Keypoint[] | undefined, status: number) => {
    if (videoRef.current && camcanvasRef.current) {
        const ctx = camcanvasRef.current.getContext('2d');

        if (ctx) {
            ctx.clearRect(0, 0, camcanvasRef.current.width, camcanvasRef.current.height);
            camcanvasRef.current.width = 640;
            camcanvasRef.current.height = 480;

            if (keypoints && keypoints.length > 0) {
                drawRed(ctx, keypoints);
                drawHandFoot(ctx, keypoints);
            } else {
                console.warn('Keypoints are undefined or empty in drawCamJson');
            }
            return keypoints;
        }
    }
    return undefined;
};


  useEffect(() => {
    data();
    init();
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      setCountdown(null);
    } else {
      playBeep();
    }
  }, [countdown]);

  useEffect(() => {
    if (detectedArmsUp) {
      startTimer();
    }
  }, [detectedArmsUp]);

  const handleRestart = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // setInterval로 반복 작업이 실행된 경우 정지
      intervalRef.current = null;
    }

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

    // 상태를 초기화합니다.
    // setYAlignedState(false);
    setAlignmentMessage('');
    setIsFinished(false);
    setShowComboEffect(false);
    setState(false);
    setDetectedArmsUp(false);
    setScores([]);
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

    // 다시 초기화 작업을 수행합니다.
    init();
  };

  const moveMainpage = () => {
    // 상태를 초기화합니다.
    // setYAlignedState(false);
    setAlignmentMessage('');
    setShowComboEffect(false);
    setState(false);
    setDetectedArmsUp(false);
    setScores([]);
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

    // 인식 로직 정지
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // setInterval로 반복 작업이 실행된 경우 정지
      intervalRef.current = null;
    }

    navigate('/');
  };

  const handleDetectArmsUp = () => {
    setDetectedArmsUp(true);
  };
  const handleMain = () => {
    navigate("/");
  };

  return (
    <div className='BackgroundVideo'>
        <video
          autoPlay
          loop
          muted
          className='background-video'
        >
          <source
            src={backgroundUrl.current}
            type='video/mp4'
          />
        </video>
    <div className='Neon'>
      
        <div className='topBar'>
          <div className='left'>
            <NeonButton onClick={moveMainpage}>Back</NeonButton>
          </div>
          <div className='right'>
          <NeonButton
              onClick={handleRestart}
              isRetry
            >
              Retry
            </NeonButton>
            </div>
            <NeonButton onClick={handleDetectArmsUp}>Start Detection</NeonButton>
        </div>

      <NeonCircle />

      { <div style={{ width: '100%', height: '100%', display: 'flex', marginTop: '100px' }}>
        <div
          style={{
            right: '10px',
            bottom: '10px',
            width: '5%',
            height: '90%',
            background: 'none' ,    
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
                {countdown}
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
              <canvas
                ref={camcanvasRef}
                className='canvas cam-canvas'
                style={{ transform: 'scaleX(-1)' }}
              />

        </div>
        <RainbowHealthBar health={health.current} />
      </div> }
      <ResultModalReplay
        isOpen={isFinished}
        onClose={moveMainpage}
        score={health.current}
        bad={bad.current}
        good={good.current}
        great={great.current}
        perfect={perfect.current}
        maxCombo={maxCombo.current}
      />
    </div>
    
    </div>
  );
};

export default Replay;
