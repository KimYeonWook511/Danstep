import React, { Component, ReactNode, useCallback, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-spring-3d-carousel';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'react-spring';
import image0 from '../assets/images/facup.gif';
import image1 from '../assets/images/1.png';
import image2 from '../assets/images/2.png';
import image3 from '../assets/images/3.png';
import image4 from '../assets/images/4.png';
import image5 from '../assets/images/5.png';
import image6 from '../assets/images/6.png';
import image7 from '../assets/images/7.png';
import image8 from '../assets/images/8.png';
import image9 from '../assets/images/9.png';
import image10 from '../assets/images/10.png';
import thumb1 from '../assets/images/dance_thumb_1.jpg';
import thumb2 from '../assets/images/dance_thumb_2.jpg';
import video from '../assets/dance_video.mp4';
const video1 = `${process.env.PUBLIC_URL}/proto.mp4`;

interface Slide {
  key: string;
  content: ReactNode;
  onClick: () => void;
}

interface ExampleState {
  goToSlide: number;
  offsetRadius: number;
  showNavigation: boolean;
  config: typeof config.stiff;
}

const Carousel3d: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = React.useState<ExampleState>({
    goToSlide: 0,
    offsetRadius: 3,
    showNavigation: false,
    config: config.stiff,
  });
  const [isHovered, setIsHovered] = React.useState<boolean[]>(Array(10).fill(false));
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (isHovered[0]) {
        video.play().catch(error => {
          console.error("Error attempting to play video:", error);
        });
      } else {
        video.pause();
      }
    }
  }, [isHovered[0]]);

  const slides: Slide[] = [
    {
      key: uuidv4(),
      content: (
        <div
          onMouseEnter={(e) => {
            const videoElement = e.currentTarget.querySelector('video');
            if (videoElement) videoElement.play();
          }}
          onMouseLeave={(e) => {
            const videoElement = e.currentTarget.querySelector('video');
            if (videoElement) videoElement.pause();
          }}
        >
          <video src={video} muted style={{ width: '100%' }} />
        </div>
      ),
      onClick: () => {
        if (state.goToSlide === 0) {
          navigate('/game');
        } else {
          setState({ ...state, goToSlide: 0 });
        }
      }
    },
    {
      key: uuidv4(),
      content: <img src={thumb1} alt="1" />,
      onClick: () => {
        if (state.goToSlide === 1) {
          navigate('/game');
        } else {
          setState({ ...state, goToSlide: 1 });
        }
      }
    },
    {
      key: uuidv4(),
      content: <img src={image0} alt="2" />,
      onClick: () => setState({ ...state, goToSlide: 2 }),
    },
    {
      key: uuidv4(),
      content: <img src={image3} alt="3" />,
      onClick: () => setState({ ...state, goToSlide: 3 }),
    },
    {
      key: uuidv4(),
      content: <img src={image4} alt="4" />,
      onClick: () => setState({ ...state, goToSlide: 4 }),
    },
    {
      key: uuidv4(),
      content: <img src={image5} alt="5" />,
      onClick: () => setState({ ...state, goToSlide: 5 }),
    },
    {
      key: uuidv4(),
      content: <img src={image6} alt="6" />,
      onClick: () => setState({ ...state, goToSlide: 6 }),
    },
    {
      key: uuidv4(),
      content: <img src={image7} alt="7" />,
      onClick: () => setState({ ...state, goToSlide: 7 }),
    },
    {
      key: uuidv4(),
      content: <img src={image8} alt="8" />,
      onClick: () => setState({ ...state, goToSlide: 8 }),
    },
    {
      key: uuidv4(),
      content: <img src={image9} alt="9" />,
      onClick: () => setState({ ...state, goToSlide: 9 }),
    },
    {
      key: uuidv4(),
      content: <img src={image10} alt="10" />,
      onClick: () => setState({ ...state, goToSlide: 10 }),
    },
  ];

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState: ExampleState) => ({
      ...prevState,
      [e.target.name]: parseInt(e.target.value, 10) || 0,
    }));
  };

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.deltaY < 0) {
        // Scroll up
        setState((prevState) => ({
          ...prevState,
          goToSlide: prevState.goToSlide === 0 ? slides.length - 1 : prevState.goToSlide - 1,
        }));
      } else {
        // Scroll down
        setState((prevState) => ({
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
