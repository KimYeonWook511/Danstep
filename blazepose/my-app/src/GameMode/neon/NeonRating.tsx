import React, { useState, useEffect } from 'react';
import styles from './NeonRating.module.css';
import firework2 from '../../assets/lottie/firework2.json';
import LottieComponent from '../animations/LottieComponent';

type Rating = 'PERFECT' | 'GREAT' | 'GOOD' | 'BAD';

const ratings: Rating[] = ['PERFECT', 'GREAT', 'GOOD', 'BAD'];
const colors: Record<Rating, string> = {
  PERFECT: '#48cae4',
  GREAT: '#0f0',
  GOOD: '#ff0',
  BAD: '#f00',
};

const NeonRating: React.FC = () => {
  const animationDuration = 7000; // 애니메이션과 텍스트 지속 시간 (고정)

  const [currentRating, setCurrentRating] = useState<Rating | null>('PERFECT');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomRating = ratings[Math.floor(Math.random() * ratings.length)];
      setCurrentRating(randomRating);

      const displayDuration = randomRating === 'PERFECT' ? animationDuration : 3000;

      setTimeout(() => {
        setCurrentRating(null);
      }, displayDuration);
    }, 6000); // 6초마다 평점 변경

    return () => clearInterval(intervalId);
  }, [animationDuration]); // animationDuration이 변할 때만 useEffect를 실행

  return (
    <div className={styles.ratingContainer}>
      {currentRating === 'PERFECT' && (
        <div className={styles.perfectContainer}>
          <div
            className={styles.ratingText}
            style={
              {
                '--rating-color': colors[currentRating],
                '--rating-color-shadow': colors[currentRating],
                '--rating-color-shadow-light': colors[currentRating],
              } as React.CSSProperties
            }
          >
            {currentRating.split('').map((char, index) => (
              <span key={index} className={index % 2 === 0 ? '' : styles.light}>
                {char}
              </span>
            ))}
          </div>
        </div>
      )}
      {currentRating && currentRating !== 'PERFECT' && (
        <div
          className={styles.ratingText}
          style={
            {
              '--rating-color': colors[currentRating],
              '--rating-color-shadow': colors[currentRating],
              '--rating-color-shadow-light': colors[currentRating],
            } as React.CSSProperties
          }
        >
          {currentRating.split('').map((char, index) => (
            <span key={index} className={index % 2 === 0 ? '' : styles.light}>
              {char}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default NeonRating;
