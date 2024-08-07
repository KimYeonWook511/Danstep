import React, { useState } from 'react';
import './Guide.css';
import greenImage from './green-image.png';
import redImage from './red-image.png';

interface GuideProps {
    onShowPoseEstimator: () => void;
}

const Guide: React.FC<GuideProps> = ({ onShowPoseEstimator }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onShowPoseEstimator();
        }, 500); // Match the duration of the fade-out animation
    };

    return (
        <div className={`guide-overlay ${isVisible ? 'visible' : 'hidden'}`}>
            <div className={`guide-content ${isVisible ? 'fade-in' : 'fade-out'}`}>
                <h1 className="warning-message">춤을 추실 땐 주변을 조심해 주세요</h1>
                <div className="guide-instructions">
                    <div className="instruction left">
                        <img src={greenImage} alt="Green Pose" />
                        <p>캡 화면 테두리가 초록색이면 카메라에 인식이 잘 되고 있음을 의미해요! 이대로 재밌게 즐겨주세요!!</p>
                    </div>
                    <div className="instruction right">
                        <img src={redImage} alt="Red Pose" />
                        <p>캡 화면 테두리가 빨간색이면 카메라에 인식이 잘 안되고 있음을 의미해요! 인식이 되도록 카메라 범위로 들어와 주세요!!</p>
                    </div>
                </div>
                <button className="play-button" onClick={handleClose}>Play</button>
            </div>
        </div>
    );
};

export default Guide;
