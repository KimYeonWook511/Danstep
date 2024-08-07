import React from 'react';
import './MainPage.css'; // 스타일 파일 불러오기
import Carousel3d from './Carousel3d';
import SearchBar from './SearchBar';
import SearchResult from './SearchResult';
import NavBar from './NavBar';

interface Game {
  id: number;
  name: string;
  difficulty: number;
}

const MainPage: React.FC = () => {
 
  return (
    <div>
      <NavBar />
      
      <div className="main-page-container">
      <Carousel3d />
  
      </div>
    </div>
  );
};

export default MainPage;
