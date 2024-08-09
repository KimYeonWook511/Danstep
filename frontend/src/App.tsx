import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import MainPage from './components/MainPage';
import Ranking from './components/Ranking';
import GamePage from './components/GamePage';
import './fonts/font.css';
import mainBgm from './assets/mainbgm.mp3';

const MusicPlayer: React.FC = () => {
  const location = useLocation();

  const musicRoutes = ['/', '/ranking'];

  const shouldPlayMusic = musicRoutes.includes(location.pathname);

  return (
    <>
    {shouldPlayMusic && (
      <audio autoPlay loop muted={true} style={{ display: 'none' }}>
        <source src={mainBgm} type="audio/mp3" />
      </audio>
    )}
    </>
  );
};

const App: React.FC = () => {

  return (
    <Router>
      <MusicPlayer />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  );
};


export default App;
