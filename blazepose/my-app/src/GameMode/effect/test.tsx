// import React, { useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { MirrorBall } from './MirrorBall';
// import HealthBar from './HealthBar';
// import './test.css'; // 기존 CSS 파일
// import './HealthBar.css'; // 체력바 CSS 파일

// const App: React.FC = () => {
//   const [top, setTop] = useState<number>(0);
//   const [currentHealth, setCurrentHealth] = useState<number>(100);
//   const maxHealth = 100;

//   const handleClick = () => {
//     setTop((prevTop) => Math.min(prevTop + 50, window.innerHeight));
//     setCurrentHealth((prevHealth) => Math.max(prevHealth - 10, 0));
//   };

//   return (
//     <div className="container">
//       <HealthBar currentHealth={currentHealth} maxHealth={maxHealth} />
//       <div className="stage-background"></div>
//       <div className="black-background" style={{ top: `${top}px` }}></div>
//       <button onClick={handleClick}>Click to reveal background</button>
//       {/* <Canvas className="canvas">
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[5, 5, 5]} />
//         <MirrorBall />
//       </Canvas> */}
//     </div>
//   );
// };

// export default App;

import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import RainbowHealthBar from './RainbowHealthBar';
import NeonButtonComponent from './NeonButton';
import NeonRating from './NeonRating';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background-color: #000;
    color: #fff;
    text-align: center;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Test: React.FC = () => {
  const [health, setHealth] = useState(80);
  const [rating, setRating] = useState<'PERFECT' | 'GREAT' | 'GOOD' | 'BAD'>('PERFECT');

  const handleBackClick = () => {
    alert('뒤로가기 버튼 클릭됨');
  };

  const handleHelpClick = () => {
    alert('물음표 버튼 클릭됨');
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <RainbowHealthBar health={health} />
        <NeonButtonComponent text="뒤로가기" onClick={handleBackClick} />
        <NeonButtonComponent text="?" onClick={handleHelpClick} />
        <NeonRating rating={rating} />
      </AppContainer>
    </>
  );
};

export default Test;
