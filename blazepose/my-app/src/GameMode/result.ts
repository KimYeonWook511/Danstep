// result.ts
import axios from 'axios';

export const sendScores = async (scores: { bad: number, good: number, great: number, perfect: number, health: number }) => {
    try {
        const response = await axios.post('http://localhost:8080/scores', scores);
        console.log('Scores sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending scores:', error);
    }
};
