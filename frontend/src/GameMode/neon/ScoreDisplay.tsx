import React, { useEffect, useState } from 'react';
import styles from './ScoreDisplay.module.css';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  const [currentScore, setCurrentScore] = useState(score);

  useEffect(() => {
        setCurrentScore(score);
    },[score]);
  return <div className={styles.score}>{currentScore}</div>;
};

export default React.memo(ScoreDisplay);
