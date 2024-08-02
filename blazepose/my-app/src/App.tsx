// import React, { useState } from 'react';
// import PoseEstimator from './GameMode/components/PoseEstimator';
// import ChartTest from './mypage/components/ChartTest';
// import Guide from './components/Guide';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MainPage from './components/MainPage';
import Ranking from './components/Ranking';
import NavBar from './components/NavBar';

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
