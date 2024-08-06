import React, { useState, useEffect, useMemo } from 'react';
import styles from './NeonRating.module.css';

const worker = new Worker(new URL('./NeonRatingWorker.ts', import.meta.url));

type Rating = 'PERFECT' | 'GREAT' | 'GOOD' | 'BAD';

const NeonRating: React.FC = () => {
  const [currentRating, setCurrentRating] = useState<Rating | null>(null);
  const [color, setColor] = useState<string>('');

  useEffect(() => {
    const handleWorkerMessages = (event: MessageEvent) => {
      const { action, currentRating, color } = event.data;

      if (action === 'updateRating') {
        setCurrentRating(currentRating);
        setColor(color);
      }
    };

    worker.onmessage = handleWorkerMessages;

    return () => {
      worker.terminate();
    };
  }, []);

  const ratingStyle = useMemo(() => ({ '--rating-color': color } as React.CSSProperties), [color]);

  return (
    <div className={styles.ratingContainer}>
      {currentRating && (
        <div className={styles.ratingText} style={ratingStyle}>
          {currentRating}
        </div>
      )}
    </div>
  );
};

export default React.memo(NeonRating);
