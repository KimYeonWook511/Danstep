// result.ts
import axios from 'axios';

export const sendScores = async (scores: { bad: number, good: number, great: number, perfect: number, health: number }) => {
    try {
        await axios.post('http://localhost:8080/scores', scores);
    } catch (error) {
    }
};
