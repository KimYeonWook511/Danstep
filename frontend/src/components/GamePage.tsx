import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from "../api/api";
import Guide from './Guide';
import PoseEstimator from '../GameMode/components/PoseEstimator';
import bgm from '../assets/sound/ready_to_start.mp3';

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

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the game ID from the URL parameters
  const [game, setGame] = useState<Game | null>(null);
  const [showPoseEstimator, setShowPoseEstimator] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Fetch the game data using the ID from the URL
    const fetchGame = async () => {
      try {
        const response = await api.get(`/games/${id}`);
        setGame(response.data); // Set the fetched game data to the state
      } catch (error) {
      }
    };
    fetchGame();
  }, [id]); // Dependency array includes `id` to refetch if the ID changes

  useEffect(() => {
    // 게임 데이터가 로드된 후에만 오디오를 재생, 이미 오디오가 생성된 경우 새로 생성하지 않음
    if (game && !audioRef.current) {
      audioRef.current = new Audio(bgm);
      audioRef.current.volume = 0.05;
      audioRef.current.play().catch((error) => {
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [game]); // game 데이터가 로드된 후에만 실행

  useEffect(() => {
    // backgroundUrl이 변경될 때 비디오 소스 업데이트
    if (videoRef.current && game?.backgroundUrl) {
      videoRef.current.src = game.backgroundUrl;
      videoRef.current.load(); // 비디오를 다시 로드
      videoRef.current.play().catch((error) => {
      });
    }
  }, [game?.backgroundUrl]); // backgroundUrl이 변경될 때만 실행

  const handleShowPoseEstimator = () => {
    setShowPoseEstimator(true);
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.remove();
    }
  };

  const resumeAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('Error resuming audio:', error);
      });
    }
  };

  return (
    <div>
      <div className='BackgroundVideo'>
        <video
        ref={videoRef}
          autoPlay
          loop
          muted
          className='background-video'
        >
          <source
            src={game?.backgroundUrl}
            type='video/mp4'
          />
        </video>
        {!showPoseEstimator && <Guide onShowPoseEstimator={handleShowPoseEstimator} />}
        {showPoseEstimator && game && <PoseEstimator game={game} pauseAudio={pauseAudio} resumeAudio={resumeAudio} />} {/* Pass the game data as a prop */}
      </div>
    </div>
  );
};

export default GamePage;