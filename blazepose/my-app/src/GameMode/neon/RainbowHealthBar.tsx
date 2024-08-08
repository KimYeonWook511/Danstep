import React, { useEffect, useState } from 'react';
import styles from './RainbowHealthBar.module.css';

const worker = new Worker(new URL('./RainbowHealthBarWorker.ts', import.meta.url));

interface RainbowHealthBarProps {
  health: number;
}

const RainbowHealthBar: React.FC<RainbowHealthBarProps> = ({ health }) => {
  const [currentHealth, setCurrentHealth] = useState(health);

  useEffect(() => {
    const handleWorkerMessages = (event: MessageEvent) => {
      const { action, health } = event.data;

      if (action === 'updateHealth') {
        setCurrentHealth(health);
      }
    };

    worker.onmessage = handleWorkerMessages;

    worker.postMessage({ action: 'updateHealth', data: health });

    return () => {
      worker.terminate();
    };
  }, [health]);

  return (
    <div className={styles.healthBarContainer}>
      <div className={styles.healthBarFill} style={{ height: `${currentHealth}%` }}></div>
    </div>
  );
};

export default React.memo(RainbowHealthBar);
