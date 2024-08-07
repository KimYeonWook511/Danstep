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
  const games: Game[] = [
    { id: 1, name: 'Game A', difficulty: 3 },
    { id: 2, name: 'Game B', difficulty: 1 },
    { id: 3, name: 'Game C', difficulty: 2 },
    { id: 4, name: 'Game D', difficulty: 4 },
  ];

  return (
    <div>
      <NavBar />
      <div className="main-page-container">
      <Carousel3d />
      {/* <div className="image-grid">
        <SearchBar />
        <SearchResult games={games} />
      </div> */}
      </div>
    </div>
  );
};

export default MainPage;
