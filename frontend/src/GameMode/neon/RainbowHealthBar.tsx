import React, { useEffect, useState } from 'react';
import styles from './RainbowHealthBar.module.css';

interface RainbowHealthBarProps {
  health: number;
}

const RainbowHealthBar: React.FC<RainbowHealthBarProps> = ({ health }) => {
  const [currentHealth, setCurrentHealth] = useState(health);

  useEffect(() => {
    setCurrentHealth(health);
  }, [health]);

  return (
    <div className={styles.healthBarContainer}>
      <div className={styles.healthBarFill} style={{ height: `${currentHealth}%` }}></div>
    </div>
  );
};

export default React.memo(RainbowHealthBar);
