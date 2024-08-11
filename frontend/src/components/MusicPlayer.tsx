import React, { useState, useRef, useEffect } from 'react';
import mainBgm from '../assets/mainbgm.mp3';  // 경로가 적절한지 확인하세요

const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mute 상태와 볼륨 상태를 관리하기 위한 state
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5); // 초기 볼륨 50%

  // 음악이 재생될 때, 볼륨을 설정합니다.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Mute 상태가 변경될 때, audio 요소의 muted 속성을 업데이트합니다.
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  };

  return (
    <>
      <audio
        ref={audioRef}
        autoPlay
        loop
        muted={isMuted}
        style={{ display: 'none' }}
      >
        <source
          src={mainBgm}
          type='audio/mp3'
        />
      </audio>

      {/* Mute 버튼과 볼륨 슬라이더 UI 추가 */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', alignItems: 'center', zIndex: 1000 }}>
        <button onClick={toggleMute} style={{ marginRight: '10px' }}>
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={{ width: '100px' }}
        />
      </div>
    </>
  );
};

export default MusicPlayer;
