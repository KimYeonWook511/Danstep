import React from 'react';
import styled from 'styled-components';

const NeonButton = styled.button`
  background-color: black;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 18px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow:
    0 0 5px #0fa,
    0 0 15px #0fa,
    0 0 20px #0fa,
    0 0 25px #0fa;
  &:hover {
    box-shadow:
      0 0 20px #0fa,
      0 0 30px #0fa,
      0 0 40px #0fa,
      0 0 50px #0fa;
  }
`;

interface ButtonProps {
  text: string;
  onClick: () => void;
}

const NeonButtonComponent: React.FC<ButtonProps> = ({ text, onClick }) => {
  return <NeonButton onClick={onClick}>{text}</NeonButton>;
};

export default NeonButtonComponent;
