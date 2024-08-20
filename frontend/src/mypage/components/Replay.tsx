import React, { useEffect, useRef, useState } from 'react';
import { Keypoint } from '@tensorflow-models/pose-detection';
import '../../canvas.css';
import '../../GameMode/neon/Neon.css';
import '../../GameMode/neon/TopBar.css';
import './Replay.css';
import { drawGreen, drawHandFoot, drawHandFootGreen, drawRed } from '../../GameMode/utils/DrawUtils';
import { calculateScore } from '../../GameMode/utils/CalculateUtils';
import { updateScores } from '../../GameMode/utils/ScoreUtils';
import NeonButton from '../../GameMode/neon/NeonButton';
import RainbowHealthBar from '../../GameMode/neon/RainbowHealthBar';
import NeonCircle from '../../GameMode/neon/NeonCircle';
import { useNavigate, useParams } from 'react-router-dom';
import ComboEffect from '../../GameMode/components/ComboEffect';
import api from '../../api/api';
import Loader from '../../components/Loading';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import ResultModalReplay from './ResultModalReplay';

interface CustomJwtPayload extends JwtPayload {
  username: string;
}

const Replay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const camcanvasRef = useRef<HTMLCanvasElement>(null);

  const intervalRef = useRef<any>(null);

  const firstFrameY = useRef<number[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isYAligned = useRef(false);
  const isCheckEnd = useRef(false);

  const bad = useRef(0);
  const good = useRef(0);
  const great = useRef(0);
  const perfect = useRef(0);
  const health = useRef(100);
  const combo = useRef(0);
  const maxCombo = useRef(0);
  const grade = useRef('');

  const dbbad = useRef(0);
  const dbgood = useRef(0);
  const dbgreat = useRef(0);
  const dbperfect = useRef(0);
  const dbhealth = useRef(0);
  const dbmaxCombo = useRef(0);

  const [detectedArmsUp, setDetectedArmsUp] = useState<boolean>(false);
  const [scores, setScores] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [alignmentMessage, setAlignmentMessage] = useState<string>('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showComboEffect, setShowComboEffect] = useState<boolean>(false);
  const beepSoundRef = useRef<HTMLAudioElement | null>(null);
  const SoundRef = useRef<HTMLAudioElement | null>(null);

  const keypointsJson = useRef([]);
  const camKeypointJson = useRef([]);
  const audioUrl = useRef<string>('');
  const backgroundUrl = useRef<string>('');
  const [loading, setLoading] = useState(true);

  const idx = useRef(-1);
  const len = useRef(0);

  const setupVideo = async () => {
    if (videoRef.current) {
      videoRef.current.src = audioUrl.current; // 비디오 파일 경로를 설정하세요.
      return new Promise<HTMLVideoElement>((resolve) => {
        videoRef.current!.onloadedmetadata = () => {
          videoRef.current!.pause(); // 이거 안 넣어도 되지 않나??
          resolve(videoRef.current!);
        };
      });
    }
    return null;
  };

  const data = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      const decodedToken = jwtDecode<CustomJwtPayload>(accessToken!);
      const username = decodedToken.username;

      const response = await api.get(`/results/${username}/replay/${id}`, {
        headers: {
          Authorization: accessToken,
        },
      });
      keypointsJson.current = JSON.parse(response.data.gamePoseData);
      camKeypointJson.current = JSON.parse(response.data.myPoseData);
      len.current = keypointsJson.current.length;
      audioUrl.current = response.data.audioUrl as string;
      backgroundUrl.current = response.data.backgroundUrl as string;
      SoundRef.current = new Audio(audioUrl.current);
      SoundRef.current.volume = 0.2;
      dbbad.current = response.data.bad;
      dbgood.current = response.data.good;
      dbgreat.current = response.data.great;
      dbperfect.current = response.data.perfect;
      dbmaxCombo.current = response.data.maxCombo;
      dbhealth.current = response.data.score;
    } catch (error) {
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const init = async () => {
    await setupVideo();
    beepSoundRef.current = new Audio('/countdown.mp3');
  };

  const startTimer = (): Promise<void> => {
    return new Promise<void>((resolve) => {
      setCountdown(4); //출력 값

      let countdown = 4; // 카운트다운 시작 값
      let intervalCount = 0; // 50ms마다 증가할 카운트
      const interval = 20; // 20번 50ms를 더하면 1초

      timerIntervalRef.current = setInterval(() => {
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
      }, 50);
    });
  };

  const playBeep = () => {
    if (beepSoundRef.current) {
      beepSoundRef.current.volume = 0.2;
      beepSoundRef.current.play();
    }
  };

  const camDetect = async () => {
    if (idx.current >= len.current) {
      clearInterval(intervalRef.current);
      setIsFinished(true);
      SoundRef.current!.pause();
      return;
    }

    const posesKeypoints = drawJson(keypointsJson.current[idx.current], 1);
    const camKeypoints = drawCamJson(camKeypointJson.current[++idx.current], 1);

    setScores((prevScores) => {
      const newScores = [...prevScores];

      if (posesKeypoints && camKeypoints) {
        const sum = calculateScore(posesKeypoints, camKeypoints);
        newScores.push(sum);

        if (newScores.length === 8) {
          const averageScore = newScores.reduce((a, b) => a + b, 0) / 8;
          updateScores(averageScore, bad, good, great, perfect, health, combo, maxCombo, grade);
          SoundRef.current!.onended = () => {
            setIsFinished(true);
          };
          return [];
        }
      }
      return newScores;
    });
  };

  const drawJson = (keypoints: Keypoint[] | undefined, status: number) => {
    if (SoundRef.current && canvasRef.current && camcanvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      if (status === 1 && (SoundRef.current.paused || SoundRef.current.ended)) {
        SoundRef.current.currentTime = 0;
        SoundRef.current.play();
      }

      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.width = 480;
        canvasRef.current.height = 854;

        if (keypoints && keypoints.length > 0) {
          drawGreen(ctx, keypoints);
          drawHandFootGreen(ctx, keypoints);
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
        }
        return keypoints;
      }
    }
    return undefined;
  };

  useEffect(() => {
    data();
    init();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (SoundRef.current) {
        SoundRef.current.pause();
      }
    };
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
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

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
    if (SoundRef.current) {
      SoundRef.current.pause();
      SoundRef.current.currentTime = 0;
    }

    setAlignmentMessage('');
    setIsFinished(false);
    setShowComboEffect(false);
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

    init();
  };

  const moveMypage = () => {
    setAlignmentMessage('');
    setShowComboEffect(false);
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
    if (SoundRef.current) {
      SoundRef.current.pause();
      SoundRef.current.currentTime = 0;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    navigate('/mypage');
  };

  const handleDetectArmsUp = () => {
    setDetectedArmsUp(true);
  };

  if (loading) {
    return <Loader />;
  }

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
            <NeonButton onClick={moveMypage}>Back</NeonButton>
          </div>
          <div className='topbar-center'>
            <NeonButton onClick={handleDetectArmsUp}>Start Replay</NeonButton>
          </div>
          <div className='right'>
            <NeonButton
              onClick={handleRestart}
              isRetry
            >
              Retry
            </NeonButton>
          </div>
        </div>

        <NeonCircle />

        <div style={{ width: '100%', height: '100%', display: 'flex', marginTop: '100px' }}>
          <div
            style={{
              right: '10px',
              bottom: '10px',
              width: '5%',
              height: '90%',
              background: 'none',
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
            ></canvas>
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
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '20px',
                color: 'red',
                fontSize: '30px',
                fontWeight: 'bold',
                fontFamily: 'neon-text',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
              }}
              className='animated-text-time'
            >
              [REC]
            </div>
            <canvas
              ref={camcanvasRef}
              className='canvas cam-canvas'
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
          <RainbowHealthBar health={health.current} />
        </div>
        <ResultModalReplay
          isOpen={isFinished}
          onClose={moveMypage}
          score={dbhealth.current}
          bad={dbbad.current}
          good={dbgood.current}
          great={dbgreat.current}
          perfect={dbperfect.current}
          maxCombo={dbmaxCombo.current}
        />
      </div>
    </div>
  );
};

export default Replay;
