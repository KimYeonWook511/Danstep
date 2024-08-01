export const updateScores = (averageScore: number, bad: React.MutableRefObject<number>, good: React.MutableRefObject<number>, great: React.MutableRefObject<number>, perfect: React.MutableRefObject<number>, health: React.MutableRefObject<number>) => {
    if (averageScore < 80) {
        bad.current++;
        health.current -= 0.5;
    } else if (averageScore < 85) {
        good.current++;
        health.current += 0.1;
    } else if (averageScore < 90) {
        great.current++;
        health.current += 0.3;
    } else {
        perfect.current++;
        health.current += 0.5;
    }

    if (health.current < 0) {
        health.current = 0;
    }
    if (health.current > 100) {
        health.current = 100;
    }
};
