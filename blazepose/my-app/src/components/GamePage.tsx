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
       <div className="BackgroundVideo">
    {/* 배경 비디오 */}
    <video autoPlay loop muted className="background-video">
      <source src="/background3.mp4" type="video/mp4" />
      {/* src="/background.mp4"를 통해 public 폴더에 있는 파일 접근 */}
    </video>
      {!showPoseEstimator && (
        <Guide onShowPoseEstimator={handleShowPoseEstimator} />
      )}
      {showPoseEstimator && <PoseEstimator />}
      <ChartTest />
    </div>
    </div>

  );
};

export default GamePage;
