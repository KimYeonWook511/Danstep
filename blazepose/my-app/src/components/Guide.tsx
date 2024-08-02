import React from 'react';

interface GuideProps {
    onShowPoseEstimator: () => void;
}

const Guide: React.FC<GuideProps> = ({ onShowPoseEstimator }) => {
    return (
        <div>
            <p>가이드페이지입니다.</p>
            <button onClick={onShowPoseEstimator}>Show Pose Estimator</button>
        </div>
    );
};

export default Guide;
