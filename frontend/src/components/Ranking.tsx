// import React from 'react';
// import NavBar from './NavBar';
// import RankingCarousel from './RankingCarousel';
// import './Ranking.css';

// const Ranking: React.FC = () => {
//   return (
//     <>
//       <NavBar />
//       <div className="ranking-page-container">
//         <RankingCarousel />
//       </div>
//     </>
//   );
// };

// export default Ranking;

// RankingPage.tsx
// import React from 'react';
// import NavBar from './NavBar';
// import Carousel3d from './Carousel3dforS3';
// import './Ranking.css';
// import { CarouselProvider } from './CarouselContext';

// const RankingPage: React.FC = () => {
//   return (
//     <CarouselProvider>
//       <NavBar />
//       <div className="ranking-page-container">
//         <Carousel3d isRankingPage={true} />
//       </div>
//     </CarouselProvider>
//   );
// };

// export default RankingPage;

import React, { useEffect, useState } from 'react';
import './Ranking.css';
import { Game } from './types';
import api from '../api/api';

const RankingPage: React.FC = () => {
  const [rankings, setRankings] = useState<Game[]>([]); // Note: Using Game type for simplicity

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await api.get('/rankings');
        setRankings(response.data);
      } catch (error) {
      }
    };

    fetchRankings();
  }, []);

  return (
    <div className="ranking-page-container">
    </div>
  );
};

export default RankingPage;
