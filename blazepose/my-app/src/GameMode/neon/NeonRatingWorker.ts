/* eslint-disable */
type Rating = 'PERFECT' | 'GREAT' | 'GOOD' | 'BAD';

const ratings: Rating[] = ['PERFECT', 'GREAT', 'GOOD', 'BAD'];
const colors: Record<Rating, string> = {
  PERFECT: '#0fa',
  GREAT: '#0f0',
  GOOD: '#ff0',
  BAD: '#f00',
};

let currentRating: Rating | null = null;

const changeRating = () => {
  const randomRating = ratings[Math.floor(Math.random() * ratings.length)];
  currentRating = randomRating;
  self.postMessage({ action: 'updateRating', currentRating, color: colors[randomRating] });
  setTimeout(() => {
    currentRating = null;
    self.postMessage({ action: 'updateRating', currentRating: null, color: '' });
  }, 500); // The rating text will disappear after 3 seconds
};

setInterval(changeRating, 4000); // Change rating every 4 seconds

export {};
