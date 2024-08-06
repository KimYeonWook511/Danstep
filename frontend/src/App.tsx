// import React, { useState } from 'react';
// import PoseEstimator from './GameMode/components/PoseEstimator';
// import ChartTest from './mypage/components/ChartTest';
// import Guide from './components/Guide';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainPage from './components/MainPage';
import Ranking from './components/Ranking';
import NavBar from './components/NavBar';
import S3 from './S3Test/S3';

const App: React.FC = () => {
    // const [showPoseEstimator, setShowPoseEstimator] = useState(false);

    // const handleShowPoseEstimator = () => {
    //     setShowPoseEstimator(true);
    // };

    return (

        <Router>
            <NavBar />
            <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/kyw/test" element={<S3/>}/>
            </Routes>
            <Routes>
                <Route path="/api/*" element={<Navigate to="/" />} />
            </Routes>
      
{/* 
        <div>
            {!showPoseEstimator && <Guide onShowPoseEstimator={handleShowPoseEstimator} />}
            {showPoseEstimator && <PoseEstimator />}
            <h1 className="text-3xl font-bold underline">BlazePose with TensorFlow.js</h1>
            <ChartTest />
        </div> */}
        </Router>
    );
};

export default App;
