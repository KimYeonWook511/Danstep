import React, { useEffect, useState } from 'react';
import './MainPage.css';
import Carousel3d from './Carousel3d';
import NavBar from './NavBar';
import mainBackGround from '../assets/main_background.mp4';
import axios from 'axios';
import { Game } from './types';

const MainPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('https://i11a406.p.ssafy.io/api/v1/games');
        const data = response.data;
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
      />
    </div>
  );
};

export default MainPage;
