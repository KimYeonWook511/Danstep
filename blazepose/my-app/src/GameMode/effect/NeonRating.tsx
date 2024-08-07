import React from 'react';
import styled from 'styled-components';

const RatingContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
`;

const RatingText = styled.span<{ rating: string }>`
  font-size: 24px;
  color: white;
  text-shadow:
    0 0 5px ${(props) => getColor(props.rating)},
    0 0 10px ${(props) => getColor(props.rating)},
    0 0 15px ${(props) => getColor(props.rating)},
    0 0 20px ${(props) => getColor(props.rating)};

  @keyframes neon {
    0%,
    100% {
      text-shadow:
        0 0 5px ${(props) => getColor(props.rating)},
        0 0 10px ${(props) => getColor(props.rating)},
        0 0 15px ${(props) => getColor(props.rating)},
        0 0 20px ${(props) => getColor(props.rating)};
    }
    50% {
      text-shadow:
        0 0 10px ${(props) => getColor(props.rating)},
        0 0 20px ${(props) => getColor(props.rating)},
        0 0 30px ${(props) => getColor(props.rating)},
        0 0 40px ${(props) => getColor(props.rating)};
    }
  }

  animation: neon 1.5s ease-in-out infinite alternate;
`;

const getColor = (rating: string) => {
  switch (rating) {
    case 'PERFECT':
      return '#0fa';
    case 'GREAT':
      return '#0f0';
    case 'GOOD':
      return '#ff0';
    case 'BAD':
      return '#f00';
    default:
      return '#fff';
  }
};

interface RatingProps {
  rating: 'PERFECT' | 'GREAT' | 'GOOD' | 'BAD';
}

const NeonRating: React.FC<RatingProps> = ({ rating }) => {
  return (
    <RatingContainer>
      <RatingText rating={rating}>{rating}</RatingText>
    </RatingContainer>
  );
};

export default NeonRating;
