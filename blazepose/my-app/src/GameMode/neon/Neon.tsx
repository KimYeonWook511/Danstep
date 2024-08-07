import React, { useState } from 'react';
import NeonButton from './NeonButton'; // Adjust the path as necessary
import NeonRating from './NeonRating'; // Adjust the path as necessary
import RainbowHealthBar from './RainbowHealthBar'; // Adjust the path as necessary
import './Neon.css'; // Ensure global styles are included
import './TopBar.css'; // Add this line to include your custom CSS
import NeonCircle from './NeonCircle';
import ScoreDisplay from './ScoreDisplay';
import ThreeStars from './ThreeStars';
import Bounce from '../animations/Bounce';
import danceroid from '../../assets/lottie/danceroid.json'
import LottieComponent from '../animations/LottieComponent.jsx';

const App: React.FC = () => {
  const [health, setHealth] = useState(100);

  // 체력 감소 버튼 함수
  const decreaseHealth = () => {
    setHealth((prevHealth) => Math.max(0, prevHealth - 10));
  };

  const goBack = () => {
    console.log('Go Back');
  };

  const retry = () => {
    console.log('Retry');
  };

  const help = () => {
    console.log('Help');
  };

  return (
    <div className="BackgroundVideo">
    {/* 배경 비디오 */}
    <video autoPlay loop muted className="background-video">
      <source src="/background3.mp4" type="video/mp4" />
      {/* src="/background.mp4"를 통해 public 폴더에 있는 파일 접근 */}
    </video>

    <div className="Neon">
      {/* <ThreeStars /> */}
      <div className="topBar">
        <div className="left">
          <NeonButton onClick={goBack}>Back</NeonButton>
        </div>

        <div className="right">
          <NeonButton onClick={retry}>Retry</NeonButton>
          <NeonButton onClick={help}>?</NeonButton>
        </div>
      </div>
      <NeonCircle />
      <NeonRating />

      {/* <NeonButton onClick={decreaseHealth}>Decrease Health</NeonButton> */}
      <RainbowHealthBar health={health} />
      <Bounce/>

    </div>
    </div>
  );
};

export default App;
