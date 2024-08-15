import React, { FC, useEffect } from 'react';
import './Modal.css';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (!isVisible) {
      sessionStorage.setItem('hasSeenModal', 'true');
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="start-modal-overlay">
      <div className="start-modal-content">
        <button className="start-modal-close-button" onClick={onClose}>X</button>
        <div className="start-modal-body">
          <button className="start-modal-logo" onClick={onClose}>DanStep Start</button>
          <p className='tip1'>Tip1. Chrome의 설정 - 시스템 - "가능한 경우 그래픽 사용"을 켜주세요!</p>
          <p className='tip2'>Tip2. 주소창에 chrome://flags 검색 후 Choose ANGLE graphics backend을 default로 설정해 주세요!</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
