import React, { useEffect, useState } from 'react';
import styles from './ScoreDisplay.module.css';

const worker = new Worker(new URL('./ScoreDisplayWorker.ts', import.meta.url));

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  const [currentScore, setCurrentScore] = useState(score);

  useEffect(() => {
    const handleWorkerMessages = (event: MessageEvent) => {
      const { action, score } = event.data;

      if (action === 'updateScore') {
        setCurrentScore(score);
      }
    };

    worker.onmessage = handleWorkerMessages;

    worker.postMessage({ action: 'updateScore', score });

    return () => {
      worker.terminate();
    };
  }, [score]);

  return <div className={styles.score}>{currentScore}</div>;
};

export default React.memo(ScoreDisplay);
