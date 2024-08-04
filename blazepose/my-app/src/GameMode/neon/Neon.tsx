import React, { useState } from 'react';
import NeonButton from './NeonButton'; // Adjust the path as necessary
import NeonRating from './NeonRating'; // Adjust the path as necessary
import RainbowHealthBar from './RainbowHealthBar'; // Adjust the path as necessary
import './Neon.css'; // Ensure global styles are included
import './TopBar.css'; // Add this line to include your custom CSS
import NeonCircle from './NeonCircle';
import ScoreDisplay from './ScoreDisplay';
import ThreeStars from './ThreeStars';

const App: React.FC = () => {
  const [health, setHealth] = useState(100);

  // Function to simulate health change
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
          <ScoreDisplay score={health} /> {/* 중앙에 점수 표시 */}
        </div>
        <div className="right">
          <NeonButton onClick={retry}>Retry</NeonButton>
          <NeonButton onClick={help}>?</NeonButton>
        </div>
      </div>
      <NeonCircle />
      <NeonButton onClick={decreaseHealth}>Decrease Health</NeonButton>
      <NeonRating />
      <RainbowHealthBar health={health} />
    </div>
  );
};

export default App;
