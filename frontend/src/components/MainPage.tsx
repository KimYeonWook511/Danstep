import React from 'react';
import './MainPage.css'; // 스타일 파일 불러오기
import Carousel3d from './Carousel3dforS3';
import NavBar from './NavBar';
import mainBackGround from '../assets/main_background.mp4'
import './MainPage.css'; 

const MainPage: React.FC = () => {
 
  return (
    <div className="main-page-container">
      <NavBar />
        <video autoPlay loop muted className="background-video">
          <source src={ mainBackGround } type="video/mp4" />
        </video>
      <Carousel3d />
      </div>
  );
};

export default MainPage;
