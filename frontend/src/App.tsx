import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import MainPage from './components/MainPage';
import Ranking from './components/Ranking';
import GamePage from './components/GamePage';
import './fonts/font.css';
import mainBgm from './assets/mainbgm.mp3';
import MyPage from './mypage/components/MyPage';
import Replay from './mypage/components/Replay';
import Modal from './components/StartModal';

const MusicPlayer: React.FC<{
  onMainMusicControl?: (control: (play: boolean) => void) => void;
}> = ({ onMainMusicControl }) => {
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.1);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(
    () => !sessionStorage.getItem('hasSeenModal')
  );

  const musicRoutes = ['/', '/ranking', '/mypage'];
  const shouldPlayMusic = musicRoutes.includes(location.pathname);

  useEffect(() => {
    if (audioRef.current) {
      if (shouldPlayMusic && !isModalVisible) {
        audioRef.current.play().catch((error) => {
          console.error('Failed to play audio:', error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [location.pathname, shouldPlayMusic, isModalVisible]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleMainMusicControl = useCallback((play: boolean) => {
    if (audioRef.current) {
      if (play) {
        audioRef.current.play().catch((error) => console.error('Failed to play audio:', error));
      } else {
        audioRef.current.pause();
      }
    }
  }, []);

  useEffect(() => {
    if (onMainMusicControl) {
      onMainMusicControl(handleMainMusicControl);
    }
  }, [onMainMusicControl, handleMainMusicControl]);

  const volumeUpIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-volume-2"
    >
      <polygon points="3 9 9 9 13 5 13 19 9 15 3 15"></polygon>
      <path d="M16.5 12c0 1.3-.5 2.5-1.4 3.5"></path>
      <path d="M19.5 12c0 2-1 3.8-2.5 4.7"></path>
      <path d="M22.5 12c0 2.9-1.5 5.4-3.5 6.9"></path>
    </svg>
  );

  const volumeMuteIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-volume-x"
    >
      <polygon points="3 9 9 9 13 5 13 19 9 15 3 15"></polygon>
      <line x1="18" y1="9" x2="22" y2="13"></line>
      <line x1="22" y1="9" x2="18" y2="13"></line>
    </svg>
  );

  return (
    <>
      <audio ref={audioRef} loop style={{ display: 'none' }}>
        <source src={mainBgm} type="audio/mp3" />
      </audio>

      {shouldPlayMusic && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column-reverse',
            alignItems: 'center',
            zIndex: 1005,
          }}
          onMouseEnter={() => setShowVolumeControl(true)}
          onMouseLeave={() => setShowVolumeControl(false)}
        >
          {showVolumeControl && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{
                position: 'absolute',
                bottom: '86px',
                transform: 'rotate(-90deg)',
                width: '100px',
              }}
            />
          )}
          <div
            style={{
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '50%',
              boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? volumeMuteIcon : volumeUpIcon}
          </div>
        </div>
      )}

      <Modal isVisible={isModalVisible} onClose={handleCloseModal} />
    </>
  );
};

const App: React.FC = () => {
  const [mainMusicControl, setMainMusicControl] = useState<(play: boolean) => void>(() => () => {});

  return (
    <Router>
      <MusicPlayer onMainMusicControl={setMainMusicControl} />
      <Routes>
        <Route path="/" element={<MainPage onMainMusicControl={mainMusicControl} />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/game/:id" element={<GamePage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/replay/:id" element={<Replay />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
