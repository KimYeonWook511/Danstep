import React, { useState } from 'react';
import Guide from './Guide';
import PoseEstimator from '../GameMode/components/PoseEstimator';
import ChartTest from '../mypage/components/ChartTest';

const GamePage: React.FC = () => {
  const [showPoseEstimator, setShowPoseEstimator] = useState(false);

  const handleShowPoseEstimator = () => {
    setShowPoseEstimator(true);
  };

  return (
    <div>
      {!showPoseEstimator && (
        <Guide onShowPoseEstimator={handleShowPoseEstimator} />
      )}
      {showPoseEstimator && <PoseEstimator />}
      <ChartTest />
    </div>
  );
};

export default GamePage;
