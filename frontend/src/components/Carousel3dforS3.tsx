// import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Carousel from 'react-spring-3d-carousel';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
// import { config } from 'react-spring';
// import './Carousel3dforS3.css';

// import slideSound from '../assets/sound/slide_sound_2.mp3'

// interface Game {
//     id: string;
//     thumbnailUrl: string;
//     title: string;
//     artist: string;
//     duration: string;
//     difficulty: string;
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
//     // API를 통해 게임 리스트를 받아오는 가정된 함수
//     const fetchGames = async () => {
//       try {
//         const response = await axios.get('https://i11a406.p.ssafy.io/api/v1/games');
//         const data = response.data;

//           // 게임 리스트로 설정
//         setGames(data);
//         console.log(response);
//       } catch (error) {
//           console.log(error);
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
//       className="carousel-item"
//         onMouseEnter={() => setIsHovered(game)}
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
//         <img src={game.thumbnailUrl} alt={`slide-${index}`} className="carousel-image"/>
//         {isHovered && isHovered.id === game.id && (
//           <div className="game-info-overlay">
//             <h2>{game.title}</h2>
//             <p>Artist: {game.artist}</p>
//             <p>Duration: {game.duration}</p>
//             <p>Difficulty: {game.difficulty}</p>
//           </div>
//         )}
//       </div>
//     )
//   }));
  

//   // console.log(slides);

//   const handleWheel = useCallback(
//     (e: React.WheelEvent) => {
//       if (slides.length === 0) return; // slide가 비어있을 때

//       playSlideSound();

//       if (e.deltaY < 0) {
//         // Scroll up
//         setState((prevState) => ({
//           ...prevState,
//           goToSlide: prevState.goToSlide === 0 ? slides.length - 1 : prevState.goToSlide - 1,
//         }));
//       } else {
//         // Scroll down
//         setState((prevState) => ({
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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-spring-3d-carousel';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'react-spring';
import './Carousel3dforS3.css';
import slideSound from '../assets/sound/slide_sound_2.mp3';

interface Game {
  id: string;
  thumbnailUrl: string;
  title: string;
  artist: string;
  duration: string;
  difficulty: string;
}

const Carousel3d: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [state, setState] = useState({
    goToSlide: 0,
    offsetRadius: 5,
    showNavigation: false,
    config: config.stiff,
  });

  const [isHovered, setIsHovered] = useState<Game | null>(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio(slideSound));

  useEffect(() => {
    // 이미지 프리로딩
    const preloadImages = async () => {
      const imageUrls = games.map(game => game.thumbnailUrl);

      await Promise.all(imageUrls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        });
      }));
    };

    // API를 통해 게임 리스트를 받아오는 가정된 함수
    const fetchGames = async () => {
      try {
        const response = await axios.get('https://i11a406.p.ssafy.io/api/v1/games');
        const data = response.data;
        setGames(data);

        // 이미지 프리로딩
        preloadImages();
      } catch (error) {
        console.log(error);
      }
    };

    fetchGames();
  }, []);

  const playSlideSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const slides = games.map((game, index) => ({
    key: uuidv4(),
    content: (
      <div
        className="carousel-item"
        onMouseEnter={() => setIsHovered(game)}
        onMouseLeave={() => setIsHovered(null)}
        onClick={() => {
          if (state.goToSlide === index) {
            navigate(`/game/${game.id}`);
          } else {
            setState({ ...state, goToSlide: index });
            playSlideSound();
          }
        }}
        style={{ cursor: 'pointer' }} // 클릭 가능임을 시각적으로 표현
      >
        <img src={game.thumbnailUrl} alt={`slide-${index}`} className="carousel-image" />
        {isHovered && isHovered.id === game.id && (
          <div className="game-info-overlay">
            <h2>{game.title}</h2>
            <p>Artist: {game.artist}</p>
            <p>Duration: {game.duration}</p>
            <p>Difficulty: {game.difficulty}</p>
          </div>
        )}
      </div>
    )
  }));

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (slides.length === 0) return; // slide가 비어있을 때

      playSlideSound();

      if (e.deltaY < 0) {
        // Scroll up
        setState(prevState => ({
          ...prevState,
          goToSlide: prevState.goToSlide === 0 ? slides.length - 1 : prevState.goToSlide - 1,
        }));
      } else {
        // Scroll down
        setState(prevState => ({
          ...prevState,
          goToSlide: (prevState.goToSlide + 1) % slides.length,
        }));
      }
    },
    [slides.length]
  );

  return (
    <div className="w-screen h-screen" onWheel={handleWheel}>
      <Carousel
        slides={slides}
        goToSlide={state.goToSlide}
        offsetRadius={state.offsetRadius}
        showNavigation={state.showNavigation}
        animationConfig={state.config}
      />
    </div>
  );
};

export default Carousel3d;
