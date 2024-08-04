import React, { useState, useEffect } from 'react';
import styles from './NeonRating.module.css';

type Rating = 'PERFECT' | 'GREAT' | 'GOOD' | 'BAD';

const ratings: Rating[] = ['PERFECT', 'GREAT', 'GOOD', 'BAD'];
const colors: Record<Rating, string> = {
  PERFECT: '#0fa',
  GREAT: '#0f0',
  GOOD: '#ff0',
  BAD: '#f00',
};

const NeonRating: React.FC = () => {
  const [currentRating, setCurrentRating] = useState<Rating | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomRating = ratings[Math.floor(Math.random() * ratings.length)];
      setCurrentRating(randomRating);
      setTimeout(() => {
        setCurrentRating(null);
      }, 3000); // The rating text will disappear after 3 seconds
    }, 4000); // Change rating every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.ratingContainer}>
      {currentRating && (
        <div
          className={styles.ratingText}
          style={{ '--rating-color': colors[currentRating] } as React.CSSProperties}
        >
          {currentRating}
        </div>
      )}
    </div>
  );
};

export default NeonRating;
