// // interface Game {
// //   id: string;
// //   thumbnailUrl: string;
// //   title: string;
// //   level?: string;
// //   playtime?: string;
// //   rank?: number;
// //   score?: string;
// // }

// // const Carousel3d: React.FC<{ data: Game[]; isRankingPage?: boolean }> = ({ data, isRankingPage = false }) => {
// //   const navigate = useNavigate();
// //   const [isHovered, setIsHovered] = useState<Game | null>(null);
// //   const [goToSlide, setGoToSlide] = useState(0);
// //   const audioRef = useRef<HTMLAudioElement>(new Audio(slideSound));

// //   const playSlideSound = () => {
// //     if (audioRef.current) {
// //       audioRef.current.currentTime = 0;
// //       audioRef.current.play();
// //     }
// //   };

// //   const slides = data.map((item, index) => {
// //     // 랭킹 페이지에서 rank와 score를 강제로 설정
// //     const rank = isRankingPage ? 1 : item.rank;
// //     const score = isRankingPage ? '10000' : item.score;

// //     return {
// //       key: uuidv4(),
// //       content: (
// //         <div
// //           className="carousel-item"
// //           onMouseEnter={() => {
// //             if (goToSlide === index) setIsHovered(item);
// //           }}
// //           onMouseLeave={() => setIsHovered(null)}
// //           onClick={() => {
// //             if (goToSlide === index) {
// //               navigate(isRankingPage ? `/ranking/${item.id}` : `/game/${item.id}`);
// //             } else {
// //               setGoToSlide(index);
// //               playSlideSound();
// //             }
// //           }}
// //           style={{ cursor: 'pointer' }}
// //         >
// //           <img src={item.thumbnailUrl} alt={`slide-${index}`} className="carousel-image" />
// //           {isHovered && isHovered.id === item.id && (
// //             <div className="game-info-overlay">
// //               <h2>{item.title}</h2>
// //               {isRankingPage ? (
// //                 <>
// //                   {rank !== undefined && <p>Rank: {rank}</p>}
// //                   {score !== undefined && <p>Score: {score}</p>}
// //                 </>
// //               ) : (
// //                 <>
// //                   {item.level !== undefined && <p>Level: {item.level}</p>}
// //                   {item.playtime !== undefined && <p>PlayTime: {item.playtime}</p>}
// //                 </>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       )
// //     };
// //   });

// //   const handleWheel = useCallback(
// //     (e: React.WheelEvent) => {
// //       if (slides.length === 0) return;
// //       playSlideSound();

// //       if (e.deltaY < 0) {
// //         setGoToSlide(goToSlide === 0 ? slides.length - 1 : goToSlide - 1);
// //       } else {
// //         setGoToSlide((goToSlide + 1) % slides.length);
// //       }
// //     },
// //     [slides.length, goToSlide]
// //   );

// //   return (
// //     <div className="w-screen h-screen" onWheel={handleWheel}>
// //       <Carousel
// //         slides={slides}
// //         goToSlide={goToSlide}
// //         offsetRadius={5}
// //         showNavigation={false}
// //         animationConfig={config.stiff}
// //       />
// //     </div>
// //   );
// // };

// // export default Carousel3d;
// import React, { useCallback, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Carousel from 'react-spring-3d-carousel';
// import { v4 as uuidv4 } from 'uuid';
// import { config } from 'react-spring';
// import './Carousel3d.css';
// import slideSound from '../assets/sound/slide_sound_2.mp3';

// interface Ranking {
//   rank: number;
//   score: string;
//   nickname: string;
//   game_info_id?: string;

// }

// interface Game {
//   id: string;
//   thumbnailUrl: string;
//   title: string;
//   level?: string;
//   playtime?: string;
//   rankTop3List?: Ranking[];
// }

// interface Ranking {
//   rank: number;
//   score: string;
//   nickname: string;
//   game_info_id?: string;
// }

// const Carousel3d: React.FC<{ data: Game[] }> = ({ data }) => {
//   const navigate = useNavigate();
//   const [isHovered, setIsHovered] = useState<CarouselData | null>(null);
//   const [goToSlide, setGoToSlide] = useState(0);
//   const audioRef = useRef<HTMLAudioElement>(new Audio(slideSound));

//   const playSlideSound = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = 0;
//       audioRef.current.play();
//     }
//   };

//   const renderStars = (level?: string) => {
//     if (!level) return null;
//     const stars = [];
//     const levelNum = parseInt(level, 10);

//     for (let i = 0; i < levelNum; i++) {
//       stars.push(
//         <span key={i} className='star'>
//           ★
//         </span>
//       )
//     };
//     return stars;
//   }

//   const slides = data.map((item, index) => ({
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
//             navigate(`/game/${item.id}`);
//           } else {
//             setGoToSlide(index);
//             playSlideSound();
//           }
//         }}
//       >
//         <img src={item.thumbnailUrl} alt={`slide-${index}`} className="carousel-image" />
//         {isHovered && isHovered.id === item.id && (
//           <div className="game-info-overlay">
//             <h2>{item.title}</h2>
//             <div className="game-details">
//               {item.level && <p className="level-stars">{renderStars(item.level)}</p>}
//               {item.playtime && <p className="play-time">PlayTime: {item.playtime}</p>}
//             </div>
//             {item.rankTop3List && item.rankTop3List.length > 0 && (
//               <div className="ranking-table">
//                 {/* <h3>Top {item.rankTop3List.length} Rankings</h3> */}
//                 <ul>
//                   {item.rankTop3List.map(ranking => (
//                     <li key={ranking.rank}>
//                       <span>{ranking.rank}. {ranking.nickname}</span>
//                       <span>Score: {ranking.score}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
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
//     <div
//       className='w-screen h-screen'
//       onWheel={handleWheel}
//     >
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

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-spring-3d-carousel';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'react-spring';
import './Carousel3d.css';
import slideSound from '../assets/sound/slide_sound_2.mp3';

interface Game {
  id: string;
  thumbnailUrl: string;
  title: string;
  level?: string;
  playtime?: string;
  rankTop3List?: Ranking[];
}

interface Ranking {
  rank: number;
  score: number;
  nickname: string;
  game_info_id?: string;
}

const Carousel3d: React.FC<{ data: Game[] }> = ({ data }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState<Game | null>(null);
  const [goToSlide, setGoToSlide] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(new Audio(slideSound));

  const playSlideSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const renderStars = (level?: string) => {
    if (!level) return null;
    const stars = [];
    const levelNum = parseInt(level, 10);

    for (let i = 0; i < levelNum; i++) {
      stars.push(
        <span
          key={i}
          className='star'
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const slides = data.map((item, index) => ({
    key: uuidv4(),
    content: (
      <div
        className='carousel-item'
        onMouseEnter={() => {
          if (goToSlide === index) setIsHovered(item);
        }}
        onMouseLeave={() => setIsHovered(null)}
        onClick={() => {
          if (goToSlide === index) {
            navigate(`/game/${item.id}`);
          } else {
            setGoToSlide(index);
            playSlideSound();
          }
        }}
      >
        <img
          src={item.thumbnailUrl}
          alt={`slide-${index}`}
          className='carousel-image'
        />
        {isHovered && isHovered.id === item.id && (
          <div className='game-info-overlay'>
            <h2>{item.title}</h2>
            <div className='game-details'>
              {item.level && <p className='level-stars'>{renderStars(item.level)}</p>}
              {item.playtime && <p className='play-time'>PlayTime: {item.playtime}</p>}
            </div>
            {item.rankTop3List && item.rankTop3List.length > 0 && (
              <div className='ranking-podium'>
                {item.rankTop3List
                  .sort((a, b) => a.rank - b.rank)
                  .map((ranking) => (
                    <div
                      key={ranking.rank}
                      className={`podium-step ${ranking.rank === 1 ? 'first' : ranking.rank === 2 ? 'second' : 'third'}`}
                    >
                      <span className='nickname'>{ranking.nickname}</span>
                      <span className='score'>{(ranking.score / 100).toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
        <span className='border-animation'></span>
        <span className='border-animation'></span>
        <span className='border-animation'></span>
        <span className='border-animation'></span>
      </div>
    ),
  }));

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (slides.length === 0) return;
      playSlideSound();
      if (e.deltaY < 0) {
        setGoToSlide(goToSlide === 0 ? slides.length - 1 : goToSlide - 1);
      } else {
        setGoToSlide((goToSlide + 1) % slides.length);
      }
    },
    [slides.length, goToSlide]
  );

  return (
    <div
      className='w-screen h-screen'
      onWheel={handleWheel}
    >
      <Carousel
        slides={slides}
        goToSlide={goToSlide}
        offsetRadius={5}
        showNavigation={false}
        animationConfig={config.default}
      />
    </div>
  );
};

export default Carousel3d;
