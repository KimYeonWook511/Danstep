import React from 'react';
import PoseEstimator from './GameMode/components/PoseEstimator';
import ChartTest from './mypage/components/ChartTest'
import Guide from './components/Guide';

const App: React.FC = () => {
    return (
        <div>
            <Guide />
            <h1 className="text-3xl font-bold underline">BlazePose with TensorFlow.js</h1>
            <PoseEstimator />
            <ChartTest/>
        </div>
    );
};

export default App;
