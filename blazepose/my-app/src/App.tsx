import React, { useState } from 'react';
import PoseEstimator from './GameMode/components/PoseEstimator';
import ChartTest from './mypage/components/ChartTest';
import Guide from './components/Guide';

const App: React.FC = () => {
    const [showPoseEstimator, setShowPoseEstimator] = useState(false);

    const handleShowPoseEstimator = () => {
        setShowPoseEstimator(true);
    };

    return (
        <div>
            {!showPoseEstimator && <Guide onShowPoseEstimator={handleShowPoseEstimator} />}
            {showPoseEstimator && <PoseEstimator />}
            <h1 className="text-3xl font-bold underline">BlazePose with TensorFlow.js</h1>
            <ChartTest />
        </div>
    );
};

export default App;
