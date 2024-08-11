import React from 'react';
import './ResultModal.css';
import {resultGrade} from '../utils/ResultGrade'
import api from '../../api/api';
import axios from 'axios';

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

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, score, bad, good, great, perfect, maxCombo,poseData, gameInfoId }) => {
  if (!isOpen) {
    return null;
  }

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem('accessToken') || '';
    try {
      const data={
        score,
        perfect,
        great,
        good,
        bad,
        maxCombo,
        gameInfoId,
        poseData
      };
      console.log(accessToken)
      const response = await axios.post("https://i11a406.p.ssafy.io/api/v1/results",data,{
        headers:{
          'Content-Type': 'application/json',
          'Authorization' : accessToken,
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
        {/* <div className="button-group">
          <button onClick={onClose}>
            <img src="다시하기.png" alt="Retry" />
            
          </button>
          <button onClick={() => console.log('메인페이지로 이동')}>
            <img src="메인페이지.png" alt="Next Step" />
            
          </button>
        </div> */}
        <button 
          onClick={handleSubmit} 
          style={{ 
            marginTop: '15px', 
            padding: '10px 20px', 
            fontSize: '18px', 
            fontFamily: 'neon-text', 
            backgroundColor: 'black', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          저장하기
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
