import React, { useCallback, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-spring-3d-carousel';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'react-spring';
import './Carousel3d.css';
import slideSound from '../assets/sound/slide_sound_2.mp3';
import { throttle } from 'lodash';

interface Game {
  id: string;
  thumbnailUrl: string;
  title: string;
  audioUrl?: string;
  level?: string;
  playtime?: string;
  rankTop3List?: Ranking[];
}

interface Ranking {
  rank: number;
  score: number;
  nickname: string;
  game_info_id?: string;
}

interface Carousel3dProps {
  data: Game[];
  onMainMusicControl?: (play: boolean) => void;
}

const Carousel3d: React.FC<Carousel3dProps> = ({ data, onMainMusicControl = () => {} }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState<Game | null>(null);
  const [goToSlide, setGoToSlide] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);

  const playSlideSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(slideSound);
    audioRef.current.volume = 0.1;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((error) => {
      console.error('Failed to play slide sound:', error);
    });
  };

  const playGameSound = (audioUrl?: string) => {
    if (audioUrl && !isPlayingRef.current) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      onMainMusicControl(false);
      isPlayingRef.current = true;
      audioTimeoutRef.current = setTimeout(() => {
        const gameAudio = new Audio(audioUrl);
        gameAudio.play().catch((error) => {
          console.error('Failed to play game sound:', error);
        });
        audioRef.current = gameAudio;
        audioRef.current.volume = 0.05;
        isPlayingRef.current = false;
      }, 1000);
    }
  };

  const stopGameSound = () => {
    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      onMainMusicControl(true);
    }
    isPlayingRef.current = false;
  };

  const handleSlideClick = (index: number, itemId: string) => {
    if (goToSlide === index) {
      stopGameSound(); // 페이지 이동 전에 오디오 중지
      navigate(`/game/${itemId}`);
    } else {
      setGoToSlide(index);
      playSlideSound();
    }
  };

  const plusRank = (rank?: number) => {
    if (rank === 1) {
      return rank + 'st';
    } else if (rank === 2) {
      return rank + 'nd';
    } else {
      return rank + 'rd';
    }
  };

  const renderStars = (level?: string) => {
    if (!level) return null;
    const stars = [];
    const levelNum = parseInt(level, 10);

    for (let i = 0; i < levelNum; i++) {
      stars.push(
        <span key={i} className="star">
          ★
        </span>
      );
    }
    return stars;
  };

  const slides = useMemo(
    () =>
      data.map((item, index) => ({
        key: uuidv4(),
        content: (
          <div
            className="carousel-item"
            onMouseEnter={() => {
              if (goToSlide === index) {
                if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = setTimeout(() => {
                  setIsHovered(item);
                  playGameSound(item.audioUrl);
                }, 300);
              }
            }}
            onMouseLeave={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
              setIsHovered(null);
              stopGameSound();
            }}
            onClick={() => handleSlideClick(index, item.id)}
          >
            <img src={item.thumbnailUrl} alt={`slide-${index}`} className="carousel-image" />
            {isHovered && isHovered.id === item.id && (
              <div className="game-info-overlay">
                <h2>{item.title}</h2>
                <div className="game-details">
                  {item.level && <p className="level-stars">{renderStars(item.level)}</p>}
                  {item.playtime && <p className="play-time">PlayTime: {item.playtime}sec</p>}
                </div>
                {item.rankTop3List && item.rankTop3List.length > 0 && (
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignContent: 'center',
                      marginTop: '20px',
                    }}
                  >
                    {item.rankTop3List
                      .sort((a, b) => a.rank - b.rank)
                      .map((ranking) => (
                        <div
                          key={ranking.rank}
                          style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'space-between  ',
                            fontFamily: 'neon-number',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                          }}
                          className={`${ranking.rank === 1 ? 'first' : ranking.rank === 2 ? 'second' : 'third'}`}
                        >
                          <div style={{ marginRight: '10px' }}>{plusRank(ranking.rank)}</div>
                          <div style={{ textAlign: 'center' }} className="nickname">
                            {ranking.nickname}
                          </div>
                          <div style={{ marginLeft: '10px' }}>
                            {(ranking.score / 100).toFixed(2)}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
            <span className="border-animation"></span>
            <span className="border-animation"></span>
            <span className="border-animation"></span>
            <span className="border-animation"></span>
          </div>
        ),
      })),
    [data, goToSlide, isHovered]
  );

  const handleWheel = useCallback(
    throttle((e: React.WheelEvent) => {
      if (slides.length === 0) return;
      playSlideSound();

      if (e.deltaY < 0) {
        setGoToSlide(goToSlide === 0 ? slides.length - 1 : goToSlide - 1);
      } else {
        setGoToSlide((goToSlide + 1) % slides.length);
      }
    }, 200),
    [slides.length, goToSlide]
  );

  return (
    <div className="w-screen h-screen" onWheel={handleWheel}>
      <Carousel
        slides={slides}
        goToSlide={goToSlide}
        offsetRadius={5}
        showNavigation={false}
        animationConfig={config.gentle}
      />
    </div>
  );
};

export default Carousel3d;
