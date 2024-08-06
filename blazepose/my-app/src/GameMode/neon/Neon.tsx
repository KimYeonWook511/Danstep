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
    <div className="Neon">
      <ThreeStars />
      <div className="topBar">
        <div className="left">
          <NeonButton onClick={goBack}>Back</NeonButton>
        </div>

        
        <div className="center">
          <div className="danceroid-wrapper">
            {/* 왼쪽 danceroid 애니메이션 */}
            <LottieComponent
              animationData={danceroid}
              loop={true}
              autoplay={true}
              style={{ width: 50, height: 50 }}
            />
              <div className="score-container">
              <ScoreDisplay score={health} />
            </div>
            {/* 오른쪽 danceroid 애니메이션 */}
            <LottieComponent
              animationData={danceroid}
              loop={true}
              autoplay={true}
              style={{ width: 50, height: 50 }}
            />
          </div>
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

  );
};

export default App;
