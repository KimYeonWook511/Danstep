import React from 'react';
import styles from './RainbowHealthBar.module.css';
import ScoreDisplay from './ScoreDisplay';

interface RainbowHealthBarProps {
  health: number;
}

const RainbowHealthBar: React.FC<RainbowHealthBarProps> = ({ health }) => {
  return (
    <div className={styles.healthBarContainer}>
      <div className={styles.healthBarFill} style={{ height: `${health}%` }}></div>
    </div>
  );
};

export default RainbowHealthBar;
