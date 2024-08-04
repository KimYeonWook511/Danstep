import React from 'react';
import styled, { keyframes } from 'styled-components';

const rainbowAnimation = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const HealthBarContainer = styled.div`
  width: 100%;
  height: 30px;
  background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet);
  background-size: 400% 400%;
  border-radius: 15px;
  overflow: hidden;
  animation: ${rainbowAnimation} 2s linear infinite;
`;

const HealthBarFill = styled.div<{ width: number }>`
  width: ${(props) => props.width}%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
`;

interface HealthBarProps {
  health: number;
}

const RainbowHealthBar: React.FC<HealthBarProps> = ({ health }) => {
  return (
    <HealthBarContainer>
      <HealthBarFill width={health} />
    </HealthBarContainer>
  );
};

export default RainbowHealthBar;
