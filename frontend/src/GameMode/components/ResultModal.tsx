import React, { useEffect, useState } from 'react';
import './ResultModal.css';
import { resultGrade } from '../utils/ResultGrade';
import axios from 'axios';
import LoginForm from '../../components/LoginForm';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  bad: number;
  good: number;
  great: number;
  perfect: number;
  maxCombo: number;
  poseData: string;
  gameInfoId: number;
}

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, score, bad, good, great, perfect, maxCombo, poseData, gameInfoId }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedin] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // 제출 여부를 저장할 상태 추가

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false); // ResultModal이 열릴 때마다 isSubmitted를 초기화
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const closeLoginForm = () => {
    setShowLogin(false);
    setIsLoggedin(true);
  };

  const handleSubmit = async () => {
    if (isSubmitted) return; // 이미 제출되었다면 아무 동작도 하지 않음

    const accessToken = localStorage.getItem('accessToken') || '';
    setIsSubmitted(true); // 제출 완료 후 상태 업데이트
    if (!accessToken) {
      setShowLogin(true);
      return;
    }

    try {
      const data = {
        score,
        perfect,
        great,
        good,
        bad,
        maxCombo,
        gameInfoId,
        poseData
      };

      const response = await axios.post("https://i11a406.p.ssafy.io/api/v1/results", data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken,
        }
      });

      console.log(response);
      
    } catch (error) {
      console.error('Failed to submit result:', error);
    }
  };

  return (
    <div className='modal-overlay'>
      <div className='result-modal-content'>
        <button
          className='modal-close'
          onClick={onClose}
        >
          &times;
        </button>
        {showLogin ? (
          <LoginForm onClose={closeLoginForm} onLogin={closeLoginForm}/> 
        ) : (
          <>
            <div
              className='gameover'
              style={{ color: 'black', fontFamily: 'neon-text' }}
            >
              Game Over
            </div>
            <div
              className='score'
              style={{ color: 'black', fontFamily: 'neon-number' }}
            >
              {score.toFixed(1)}
            </div>
            <div className='result-container'>
              <div
                className='grade'
                style={{ color: 'violet', fontFamily: 'neon-text' }}
              >
                {resultGrade(score)}
              </div>
              <div className='grade-container'>
                <div className='grade-wrapper'>
                  <div
                    className='grade-text'
                    style={{ color: 'blue', fontFamily: 'neon-text', fontSize: 32 }}
                  >
                    PERFECT
                  </div>
                  <span className='grade-label'>{perfect}</span>
                </div>
                <div className='grade-wrapper'>
                  <div
                    className='grade-text'
                    style={{ color: 'green', fontFamily: 'neon-text', fontSize: 32 }}
                  >
                    GREAT
                  </div>
                  <span className='grade-label'>{great}</span>
                </div>
                <div className='grade-wrapper'>
                  <div
                    className='grade-text'
                    style={{ color: 'orange', fontFamily: 'neon-text', fontSize: 32 }}
                  >
                    GOOD
                  </div>
                  <span className='grade-label'>{good}</span>
                </div>
                <div className='grade-wrapper'>
                  <div
                    className='grade-text'
                    style={{ color: 'red', fontFamily: 'neon-text', fontSize: 32 }}
                  >
                    BAD
                  </div>
                  <span className='grade-label'>{bad}</span>
                </div>
                <div className='grade-wrapper'>
                  <div
                    className='grade-text'
                    style={{ color: 'black', fontFamily: 'neon-text', fontSize: 32 }}
                  >
                    COMBO
                  </div>
                  <span className='grade-label'>{maxCombo}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitted} // 제출 여부에 따라 버튼 비활성화
              style={{ 
                marginTop: '15px', 
                padding: '10px 20px', 
                fontSize: '18px', 
                fontFamily: 'neon-text', 
                backgroundColor: isSubmitted ? 'grey' : 'black', // 제출된 경우 색상을 회색으로 변경
                color: 'white', 
                border: 'none', 
                cursor: isSubmitted ? 'not-allowed' : 'pointer' // 제출된 경우 커서를 비활성화 모양으로 변경
              }}
            >
              {isSubmitted ? '제출 완료' : '저장하기'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultModal;
