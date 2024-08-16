import React from 'react';
import styles from './NeonButton.module.css';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  isRetry?: boolean;
}

const NeonButton: React.FC<ButtonProps> = ({ onClick, children, isRetry }) => {
  return (
    <button
      className={`${styles.neonButton} ${isRetry ? styles.chromeButton : ''}`} // 조건부 스타일 적용
      onClick={onClick}
    >
      {isRetry ? '↻' : children} {/* isRetry가 true일 때 이모지를 사용 */}
    </button>
  );
};

export default NeonButton;
