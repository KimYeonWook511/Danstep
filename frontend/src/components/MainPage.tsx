// // import React from 'react';
// // import './MainPage.css'; // 스타일 파일 불러오기
// // import Carousel3d from './Carousel3dforS3';
// // import NavBar from './NavBar';
// // import mainBackGround from '../assets/main_background.mp4'
// // import './MainPage.css';
// // import MusicPlayer from './MusicPlayer';

// // const MainPage: React.FC = () => {

// //   return (
// //     <div className="main-page-container">
// //       <NavBar />
// //         <video autoPlay loop muted className="background-video">
// //           <source src={ mainBackGround } type="video/mp4" />
// //         </video>
// //       <Carousel3d />
// //       {/* <MusicPlayer /> */}
// //       </div>
// //   );
// // };

// // export default MainPage;

// import React, { useState, useEffect } from 'react';
// import './MainPage.css'; // 스타일 파일 불러오기
// import Carousel3d from './Carousel3d';
// import NavBar from './NavBar';
// import mainBackGround from '../assets/main_background.mp4';
// import VideoModal from './VideoModal'; // 비디오 모달 컴포넌트 import
// import './MainPage.css';

// const MainPage: React.FC = () => {
//   const [showVideo, setShowVideo] = useState(false);
//   const videoUrl = "https://www.example.com/your-video.mp4"; // 비디오 URL

//   useEffect(() => {
//     const videoViewed = localStorage.getItem('videoViewed');
//     if (videoViewed !== 'true') {
//       setShowVideo(true);
//     }
//   }, []);

//   const handleCloseVideo = () => {
//     setShowVideo(false);
//     localStorage.setItem('videoViewed', 'true'); // 비디오 시청 기록 저장
//   };

//   return (
//     <div className="main-page-container">
//       <NavBar />
//       <video autoPlay loop muted className="background-video">
//         <source src={mainBackGround} type="video/mp4" />
//       </video>
//       <Carousel3d />
//       {showVideo && <VideoModal videoUrl={videoUrl} onClose={handleCloseVideo} />}
//       {/* <MusicPlayer /> */}
//     </div>
//   );
// };

// export default MainPage;
import React, { useEffect, useState } from 'react';
import './MainPage.css';
import Carousel3d from './Carousel3d';
import NavBar from './NavBar';
import mainBackGround from '../assets/main_background.mp4';
import { Game } from './types';

const MainPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('https://i11a406.p.ssafy.io/api/v1/games');
        const data = await response.json();
        setGames(data);
        console.log(data);
      } catch (error) {
        console.error('Failed to fetch games', error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className='main-page-container'>
      <NavBar />
      <video
        autoPlay
        loop
        muted
        className='background-video'
      >
        <source
          src={mainBackGround}
          type='video/mp4'
        />
      </video>
      <Carousel3d
        data={games}
        isRankingPage={false}
      />
    </div>
  );
};

export default MainPage;
