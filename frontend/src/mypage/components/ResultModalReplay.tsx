import React, { useState } from 'react';
import '../../GameMode/components/ResultModal.css';
import { resultGrade } from '../../GameMode/utils/ResultGrade';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  bad: number;
  good: number;
  great: number;
  perfect: number;
  maxCombo: number;
}

const ResultModalReplay: React.FC<ResultModalProps> = ({ isOpen, onClose, score, bad, good, great, perfect, maxCombo}) => {
  if (!isOpen) {
    return null;
  }

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
              SCORE
            </div>
            <div
              className='score'
              style={{ color: 'black', fontFamily: 'neon-number' }}
            >
              {(score/100).toFixed(2)}
            </div>
            <div className='result-container'>
              <div
                className='grade'
                style={{ color: 'violet', fontFamily: 'neon-text' }}
              >
                {resultGrade(score/100)}
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
      </div>
    </div>
  );
};

export default ResultModalReplay;
