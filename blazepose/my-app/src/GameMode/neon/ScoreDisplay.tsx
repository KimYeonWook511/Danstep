import React from 'react';
import styles from './ScoreDisplay.module.css';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return <div className={styles.score}>{score}</div>;
};

export default ScoreDisplay;
