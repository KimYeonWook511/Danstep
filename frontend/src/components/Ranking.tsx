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
import Carousel3d from './Carousel3d';
import NavBar from './NavBar';
import { Game } from './types';
import api from '../api/api';

const RankingPage: React.FC = () => {
  const [rankings, setRankings] = useState<Game[]>([]); // Note: Using Game type for simplicity

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await api.get('/rankings');
        // const data = response.json();
        // setRankings(data);
        console.log("Ranking.tsx axios: ", response);
        setRankings(response.data);
      } catch (error) {
        console.error('Failed to fetch rankings', error);
      }
    };

    fetchRankings();
  }, []);

  return (
    <div className="ranking-page-container">
      <NavBar />
    </div>
  );
};

export default RankingPage;
