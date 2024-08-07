import React, { useState } from 'react';
import Confetti from 'react-confetti';
import './firework.css';

const Firework: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleButtonClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // 3초 후 폭죽 효과 종료
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fireworks Effect</h1>
        <button onClick={handleButtonClick}>Show Fireworks</button>
        {showConfetti && <Confetti />}
      </header>
    </div>
  );
};

export default Firework;
