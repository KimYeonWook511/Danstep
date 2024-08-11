import React from 'react';
import NavBar from './NavBar';
import './Ranking.css'; // 스타일 파일 불러오기
import MusicPlayer from './MusicPlayer';

const Ranking: React.FC = () => {
  return (
    <>
    <NavBar />
      <div className="ranking-page-container">
        <span>랭킹페이지 입니다</span>
        {/* <MusicPlayer /> */}
      </div>
    </>
  );
};

export default Ranking;
