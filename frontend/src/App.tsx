import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import MainPage from './components/MainPage';
import Ranking from './components/Ranking';
import GamePage from './components/GamePage';
import './fonts/font.css';
import mainBgm from './assets/mainbgm.mp3';
import MyPage from './mypage/components/MyPage';
import Replay from './mypage/components/Replay'

const MusicPlayer: React.FC = () => {
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const musicRoutes = ['/', '/ranking', '/mypage'];
  const shouldPlayMusic = musicRoutes.includes(location.pathname);

  useEffect(() => {
    if (audioRef.current) {
      if (shouldPlayMusic) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [location.pathname, shouldPlayMusic]);
  useEffect(() => {
    const handleMouseMove = () => {
      if (!hasInteracted) {
        if (audioRef.current) {
          audioRef.current.muted = false;  // 음소거 해제
          audioRef.current.play().then(() => {
            setHasInteracted(true);  // 상호작용이 발생했음을 표시
          }).catch(error => {
            console.error('Failed to play audio:', error);
          });
        }
        document.removeEventListener('mousemove', handleMouseMove);  // 이벤트 리스너 제거
      }
    };

    if (shouldPlayMusic) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);  // 컴포넌트 언마운트 시 클린업
    };
  }, [shouldPlayMusic, hasInteracted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

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
            zIndex: 1000
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
                bottom: '86px',  // 아이콘 위에 볼륨 바 위치
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
    </>
  );
};

// let isCloseTriggered = false;

// window.addEventListener('beforeunload', (event) => {
//   isCloseTriggered = true; // 창이 닫힐 때 플래그를 설정
// });

// window.addEventListener('unload', () => {
//   if (isCloseTriggered) {
//     // 창이 실제로 닫힐 때만 localStorage 초기화
//     localStorage.clear();
//   }
// });

// // 페이지가 로드될 때 isCloseTriggered를 초기화
// window.addEventListener('load', () => {
//   isCloseTriggered = false;
// });


const App: React.FC = () => {
  return (
    <Router>
      <MusicPlayer />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/game/:id" element={<GamePage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/replay/:id" element={<Replay/>}/>
      </Routes>
    </Router>
  );
};

export default App;


// import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
// import MainPage from './components/MainPage';
// import GamePage from './components/GamePage';
// import './fonts/font.css';
// import mainBgm from './assets/mainbgm.mp3';
// import MyPage from './mypage/components/MyPage';
// import Replay from './mypage/components/Replay'

// const MusicPlayer: React.FC = () => {
//   const location = useLocation();
//   const audioRef = useRef<HTMLAudioElement>(null);
//   const [isMuted, setIsMuted] = useState(true);  // 초기값을 true로 설정하여 음소거 상태로 시작
//   const [volume, setVolume] = useState(0.5);
//   const [showVolumeControl, setShowVolumeControl] = useState(false);
//   const [hasInteracted, setHasInteracted] = useState(false);

//   const musicRoutes = ['/', '/mypage'];
//   const shouldPlayMusic = musicRoutes.includes(location.pathname);

//   useEffect(() => {
//     const handleMouseMove = () => {
//       if (!hasInteracted && audioRef.current) {
//         audioRef.current.muted = false;  // 음소거 해제
//         setHasInteracted(true);  // 상호작용이 발생했음을 표시
//       }
//     };

//     if (shouldPlayMusic) {
//       document.addEventListener('mousemove', handleMouseMove);
//     }

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);  // 컴포넌트 언마운트 시 클린업
//     };
//   }, [shouldPlayMusic, hasInteracted]);

//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.volume = volume;
//       audioRef.current.muted = isMuted;
//     }
//   }, [volume, isMuted]);

//   const volumeUpIcon = (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className="feather feather-volume-2"
//     >
//       <polygon points="3 9 9 9 13 5 13 19 9 15 3 15"></polygon>
//       <path d="M16.5 12c0 1.3-.5 2.5-1.4 3.5"></path>
//       <path d="M19.5 12c0 2-1 3.8-2.5 4.7"></path>
//       <path d="M22.5 12c0 2.9-1.5 5.4-3.5 6.9"></path>
//     </svg>
//   );

//   const volumeMuteIcon = (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className="feather feather-volume-x"
//     >
//       <polygon points="3 9 9 9 13 5 13 19 9 15 3 15"></polygon>
//       <line x1="18" y1="9" x2="22" y2="13"></line>
//       <line x1="22" y1="9" x2="18" y2="13"></line>
//     </svg>
//   );

//   return (
//     <>
//       <audio ref={audioRef} loop style={{ display: 'none' }}>
//         <source src={mainBgm} type="audio/mp3" />
//       </audio>

//       {shouldPlayMusic && (
//         <div
//           style={{
//             position: 'fixed',
//             bottom: '20px',
//             right: '20px',
//             display: 'flex',
//             flexDirection: 'column-reverse',
//             alignItems: 'center',
//             zIndex: 1000
//           }}
//           onMouseEnter={() => setShowVolumeControl(true)}
//           onMouseLeave={() => setShowVolumeControl(false)}
//         >
//           {showVolumeControl && (
//             <input
//               type="range"
//               min="0"
//               max="1"
//               step="0.01"
//               value={volume}
//               onChange={(e) => setVolume(parseFloat(e.target.value))}
//               style={{
//                 position: 'absolute',
//                 bottom: '86px',  // 아이콘 위에 볼륨 바 위치
//                 transform: 'rotate(-90deg)',
//                 width: '100px',
//               }}
//             />
//           )}
//           <div
//             style={{
//               backgroundColor: 'white',
//               padding: '10px',
//               borderRadius: '50%',
//               boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
//               cursor: 'pointer',
//               position: 'relative',
//             }}
//             onClick={() => setIsMuted(!isMuted)}
//           >
//             {isMuted ? volumeMuteIcon : volumeUpIcon}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// const App: React.FC = () => {
//   return (
//     <Router>
//       <MusicPlayer />
//       <Routes>
//         <Route path="/" element={<MainPage />} />
//         <Route path="/game/:id" element={<GamePage />} />
//         <Route path="/mypage" element={<MyPage />} />
//         <Route path="/replay/:id" element={<Replay />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
