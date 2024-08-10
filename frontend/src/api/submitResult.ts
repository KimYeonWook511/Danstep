// submitResult.ts

import api from './api';

interface PoseData {
  [key: string]: any; // Adjust this type based on the actual structure of poseData
}

interface SubmitResultParams {
  accessToken: string;
  score: number;
  perfect: number;
  great: number;
  good: number;
  bad: number;
  maxCombo: number;
  gameInfoId: number;
  poseData: PoseData;
}

export const submitResult = async ({
  accessToken,
  score,
  perfect,
  great,
  good,
  bad,
  maxCombo,
  gameInfoId,
  poseData,
}: SubmitResultParams): Promise<void> => {
  try {
    // Set the Authorization header for this request
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    // Construct the payload
    const payload = {
      score,
      perfect,
      great,
      good,
      bad,
      maxCombo,
      gameInfoId,
      poseData,
    };

    // Send the POST request to the API
    await api.post('/api/v1/results', payload, config);

    console.log('Result submitted successfully');
  } catch (error) {
    console.error('Error submitting result:', error);
    throw error;
  }
};
