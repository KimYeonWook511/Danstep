import axios from 'axios';

interface Score {
    bad: number;
    good: number;
    great: number;
    perfect: number;
    health: number;
}

export const receiveScores = async (): Promise<Score[]> => {
    const response = await axios.get('http://localhost:8080/scores');
    return response.data;
};
