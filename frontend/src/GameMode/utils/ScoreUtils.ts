export const updateScores = (
  averageScore: number,
  bad: React.MutableRefObject<number>,
  good: React.MutableRefObject<number>,
  great: React.MutableRefObject<number>,
  perfect: React.MutableRefObject<number>,
  health: React.MutableRefObject<number>,
  combo: React.MutableRefObject<number>,
  maxCombo: React.MutableRefObject<number>,
  grade: React.MutableRefObject<string>
) => {
  if (averageScore < 80) {
    bad.current++;
    health.current -= 3.11;
    combo.current = 0;
    grade.current = 'BAD';
  } else if (averageScore < 85) {
    good.current++;
    health.current += 0.72;
    combo.current++;
    grade.current = 'GOOD';
  } else if (averageScore < 90) {
    great.current++;
    health.current += 1.33;
    combo.current++;
    grade.current = 'GREAT';
  } else {
    perfect.current++;
    health.current += 1.75;
    combo.current++;
    grade.current = 'PERFECT';
  }

  if (health.current < 0) {
    health.current = 0;
  }
  if (health.current > 100) {
    health.current = 100;
  }
  if (maxCombo.current < combo.current) {
    maxCombo.current = combo.current;
  }
};
