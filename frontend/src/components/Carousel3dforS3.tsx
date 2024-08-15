// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Carousel from 'react-spring-3d-carousel';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import { config } from 'react-spring';
// import './Carousel3dforS3.css';
// import slideSound from '../assets/sound/slide_sound_2.mp3';

// interface Game {
//   id: string;
//   thumbnailUrl: string;
//   title: string;
//   level: string;
//   playtime: string;
// }

// const Carousel3d: React.FC = () => {
//   const navigate = useNavigate();
//   const [games, setGames] = useState<Game[]>([]);
//   const [state, setState] = useState({
//     goToSlide: 0,
//     offsetRadius: 5,
//     showNavigation: false,
//     config: config.stiff,
//   });

//   const [isHovered, setIsHovered] = useState<Game | null>(null);
//   const audioRef = useRef<HTMLAudioElement>(new Audio(slideSound));

//   useEffect(() => {
//     // 이미지 프리로딩
//     const preloadImages = async () => {
//       const imageUrls = games.map(game => game.thumbnailUrl);

//       await Promise.all(imageUrls.map(url => {
//         return new Promise((resolve, reject) => {
//           const img = new Image();
//           img.src = url;
//           img.onload = resolve;
//           img.onerror = reject;
//         });
//       }));
//     };

//     // API를 통해 게임 리스트를 받아오는 가정된 함수
//     const fetchGames = async () => {
//       try {
//         const response = await axios.get('https://i11a406.p.ssafy.io/api/v1/games');
//         const data = response.data;
//         console.log(response);
//         setGames(data);

//         // 이미지 프리로딩
//         preloadImages();
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchGames();
//   }, []);

//   const playSlideSound = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = 0;
//       audioRef.current.play();
//     }
//   };

//   const slides = games.map((game, index) => ({
//     key: uuidv4(),
//     content: (
//       <div
//         className="carousel-item"
//         onMouseEnter={() => {
//           if (state.goToSlide === index) {
//             setIsHovered(game);
//           }
//         }}
//         onMouseLeave={() => setIsHovered(null)}
//         onClick={() => {
//           if (state.goToSlide === index) {
//             navigate(`/game/${game.id}`);
//           } else {
//             setState({ ...state, goToSlide: index });
//             playSlideSound();
//           }
//         }}
//         style={{ cursor: 'pointer' }} // 클릭 가능임을 시각적으로 표현
//       >
//         <img src={game.thumbnailUrl} alt={`slide-${index}`} className="carousel-image" />
//         {isHovered && isHovered.id === game.id && (
//           <div className="game-info-overlay">
//             <h2>{game.title}</h2>
//             <p>Level: {game.level}</p>
//             <p>PlayTime: {game.playtime}</p>
//           </div>
//         )}
//       </div>
//     )
//   }));


//   const handleWheel = useCallback(
//     (e: React.WheelEvent) => {
//       if (slides.length === 0) return; // slide가 비어있을 때

//       playSlideSound();

//       if (e.deltaY < 0) {
//         // Scroll up
//         setState(prevState => ({
//           ...prevState,
//           goToSlide: prevState.goToSlide === 0 ? slides.length - 1 : prevState.goToSlide - 1,
//         }));
//       } else {
//         // Scroll down
//         setState(prevState => ({
//           ...prevState,
//           goToSlide: (prevState.goToSlide + 1) % slides.length,
//         }));
//       }
//     },
//     [slides.length]
//   );

//   return (
//     <div className="w-screen h-screen" onWheel={handleWheel}>
//       <Carousel
//         slides={slides}
//         goToSlide={state.goToSlide}
//         offsetRadius={state.offsetRadius}
//         showNavigation={state.showNavigation}
//         animationConfig={state.config}
//       />
//     </div>
//   );
// };

// export default Carousel3d;

// // Carousel3d.tsx
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Carousel from 'react-spring-3d-carousel';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import { config } from 'react-spring';
// import './Carousel3dforS3.css';
// import slideSound from '../assets/sound/slide_sound_2.mp3';
// import { useCarousel } from './CarouselContext';

// interface Game {
//   id: string;
//   thumbnailUrl: string;
//   title: string;
//   level: string;
//   playtime: string;
// }

// interface Ranking {
//   id: string;
//   rank: number;
//   thumbnailUrl: string;
//   title: string;
//   score: string;
// }

// const Carousel3d: React.FC<{ isRankingPage?: boolean }> = ({ isRankingPage = false }) => {
//   const navigate = useNavigate();
//   const { goToSlide, setGoToSlide } = useCarousel();
//   const [games, setGames] = useState<Game[]>([]);
//   const [rankings, setRankings] = useState<Ranking[]>([]);
//   const [isHovered, setIsHovered] = useState<Game | Ranking | null>(null);
//   const audioRef = useRef<HTMLAudioElement>(new Audio(slideSound));

//   useEffect(() => {
//     const preloadImages = async (images: string[]) => {
//       await Promise.all(images.map(url => new Promise((resolve, reject) => {
//         const img = new Image();
//         img.src = url;
//         img.onload = resolve;
//         img.onerror = reject;
//       })));
//     };

//     const fetchGames = async () => {
//       try {
//         const response = await axios.get('https://i11a406.p.ssafy.io/api/v1/games');
//         setGames(response.data);
//         preloadImages(response.data.map((game: Game) => game.thumbnailUrl));
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     const fetchRankings = async () => {
//       try {
//         const response = await axios.get('https://i11a406.p.ssafy.io/api/v1/rankings'); // 랭킹 API로 교체
//         setRankings(response.data);
//         preloadImages(response.data.map((ranking: Ranking) => ranking.thumbnailUrl));
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     if (isRankingPage) {
//       fetchRankings();
//     } else {
//       fetchGames();
//     }
//   }, [isRankingPage]);

//   const playSlideSound = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = 0;
//       audioRef.current.play();
//     }
//   };

//   const slidesData = isRankingPage ? rankings : games;

//   const slides = slidesData.map((item, index) => ({
//     key: uuidv4(),
//     content: (
//       <div
//         className="carousel-item"
//         onMouseEnter={() => {
//           if (goToSlide === index) setIsHovered(item);
//         }}
//         onMouseLeave={() => setIsHovered(null)}
//         onClick={() => {
//           if (goToSlide === index) {
//             navigate(isRankingPage ? `/ranking/${item.id}` : `/game/${item.id}`);
//           } else {
//             setGoToSlide(index);
//             playSlideSound();
//           }
//         }}
//         style={{ cursor: 'pointer' }}
//       >
//         <img src={item.thumbnailUrl} alt={`slide-${index}`} className="carousel-image" />
//         {isHovered && isHovered.id === item.id && (
//           <div className="game-info-overlay">
//             <h2>{item.title}</h2>
//             {isRankingPage && 'rank' in item ? (
//               <>
//                 <p>Rank: {item.rank}</p>
//                 <p>Score: {item.score}</p>
//               </>
//             ) : 'level' in item ? (
//               <>
//                 <p>Level: {item.level}</p>
//                 <p>PlayTime: {item.playtime}</p>
//               </>
//             ) : null}
//           </div>
//         )}
//       </div>
//     )
//   }));

//   const handleWheel = useCallback(
//     (e: React.WheelEvent) => {
//       if (slides.length === 0) return;
//       playSlideSound();

//       if (e.deltaY < 0) {
//         setGoToSlide(goToSlide === 0 ? slides.length - 1 : goToSlide - 1);
//       } else {
//         setGoToSlide((goToSlide + 1) % slides.length);
//       }
//     },
//     [slides.length, goToSlide]
//   );

//   return (
//     <div className="w-screen h-screen" onWheel={handleWheel}>
//       <Carousel
//         slides={slides}
//         goToSlide={goToSlide}
//         offsetRadius={5}
//         showNavigation={false}
//         animationConfig={config.stiff}
//       />
//     </div>
//   );
// };

// export default Carousel3d;

import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-spring-3d-carousel';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'react-spring';
import './Carousel3dforS3.css';
import slideSound from '../assets/sound/slide_sound_2.mp3';
import throttle from 'lodash/throttle';

interface Game {
  id: string;
  thumbnailUrl: string;
  title: string;
  level: string;
  playtime: string;
}

interface Ranking {
  id: string;
  rank: number;
  thumbnailUrl: string;
  title: string;
  score: string;
}

type CarouselData = Game | Ranking;

const Carousel3d: React.FC<{ data: CarouselData[]; isRankingPage?: boolean }> = ({ data, isRankingPage = false }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState<CarouselData | null>(null);
  const [goToSlide, setGoToSlide] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(new Audio(slideSound));

  const playSlideSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const slides = data.map((item, index) => ({
    key: uuidv4(),
    content: (
      <div
        className="carousel-item"
        onMouseEnter={() => {
          if (goToSlide === index) setIsHovered(item);
        }}
        onMouseLeave={() => setIsHovered(null)}
        onClick={() => {
          if (goToSlide === index) {
            navigate(isRankingPage ? `/ranking/${item.id}` : `/game/${item.id}`);
          } else {
            setGoToSlide(index);
            playSlideSound();
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <img src={item.thumbnailUrl} alt={`slide-${index}`} className="carousel-image" />
        {isHovered && isHovered.id === item.id && (
          <div className="game-info-overlay">
            <h2>{item.title}</h2>
            {isRankingPage && 'rank' in item ? (
              <>
                <p>Rank: {item.rank}</p>
                <p>Score: {item.score}</p>
              </>
            ) : 'level' in item ? (
              <>
                <p>Level: {item.level}</p>
                <p>PlayTime: {item.playtime}</p>
              </>
            ) : null}
          </div>
        )}
      </div>
    )
  }));

  const handleWheel = useCallback(
    throttle((e: React.WheelEvent) => {
      if (slides.length === 0) return;
      playSlideSound();

      if (e.deltaY < 0) {
        setGoToSlide(goToSlide === 0 ? slides.length - 1 : goToSlide - 1);
      } else {
        setGoToSlide((goToSlide + 1) % slides.length);
      }
    }, 200), // 200ms의 간격으로 휠 이벤트 처리
    [slides.length, goToSlide]
  );

  return (
    <div className="w-screen h-screen" onWheel={handleWheel}>
      <Carousel
        slides={slides}
        goToSlide={goToSlide}
        offsetRadius={5}
        showNavigation={false}
        animationConfig={config.gentle}
      />
    </div>
  );
};

export default Carousel3d;
