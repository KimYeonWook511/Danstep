import React from 'react';
import styles from './NeonButton.module.css';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const NeonButton: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button className={styles.neonButton} onClick={onClick}>
      {children}
    </button>
  );
};

export default NeonButton;
