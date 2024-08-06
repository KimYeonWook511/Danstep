import React from 'react';
import Lottie from 'react-lottie';
import bounce from '../../assets/lottie/bounce.json';
import android from '../../assets/lottie/danceroid.json';
import firework from '../../assets/lottie/firework.json';
// import firework2 from '../../assets/lottie/firework2.json';
import musicbar3 from '../../assets/lottie/musicbar3.json';
import musicbar4 from '../../assets/lottie/musicbar4.json';

import 'tailwindcss/tailwind.css';

const animations = [bounce, bounce, bounce, bounce]; // 동일한 애니메이션을 여러 번 사용

const LottieAnimations = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="relative w-screen h-screen">
      {/* 네 방향 애니메이션
      <div className="absolute top-0 left-0 p-5">
        <Lottie
          options={{ ...defaultOptions, animationData: animations[0] }}
          height={200}
          width={200}
        />
      </div>
      <div className="absolute top-0 right-0 p-5">
        <Lottie
          options={{ ...defaultOptions, animationData: animations[1] }}
          height={200}
          width={200}
        />
      </div>
      <div className="absolute bottom-0 left-0 p-5">
        <Lottie
          options={{ ...defaultOptions, animationData: animations[2] }}
          height={200}
          width={200}
        />
      </div>
      <div className="absolute bottom-0 right-0 p-5">
        <Lottie
          options={{ ...defaultOptions, animationData: animations[3] }}
          height={200}
          width={200}
        />
      </div> */}

      {/* 상단의 두 개의 추가 애니메이션 */}
      <div className="absolute top-0 left-0 p-5">
        <Lottie
          options={{ ...defaultOptions, animationData: firework }}
          height={300}
          width={300}
        />
      </div>
      <div className="absolute top-0 right-0 p-5">
        <Lottie
          options={{ ...defaultOptions, animationData: firework }}
          height={300}
          width={300}
        />
      </div>
      {/* <div className="absolute bottom-0 right-0 p-5">
        <Lottie
          options={{ ...defaultOptions, animationData: firework2 }}
          height={300}
          width={300}
        />
      </div> */}

      {/* 음악 바 애니메이션 */}
      <div className="absolute bottom-0 left-0">
        <Lottie
          options={{ ...defaultOptions, animationData: musicbar3 }}
          height={400} 
          width={300}  
        />
      </div>
      <div className="absolute bottom-0 right-0 p-3" style={{ transform: 'scaleX(-1)' }}>
        <Lottie
          options={{ ...defaultOptions, animationData: musicbar4 }}
          height={400}
          width={300}
        />
      </div>
    </div>
  );
};

export default LottieAnimations;
