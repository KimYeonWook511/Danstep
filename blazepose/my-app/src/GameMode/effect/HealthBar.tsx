import React from 'react';
import './HealthBar.css';

interface HealthBarProps {
  currentHealth: number;
  maxHealth: number;
}

const HealthBar: React.FC<HealthBarProps> = ({ currentHealth, maxHealth }) => {
  const healthPercentage = (currentHealth / maxHealth) * 100;

  return (
    <div className="health-bar">
      <div className="health-bar__fill" style={{ width: `${healthPercentage}%` }}></div>
    </div>
  );
};

export default HealthBar;
