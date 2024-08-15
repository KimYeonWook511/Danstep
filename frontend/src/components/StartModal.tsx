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
          <p>Tip. Chrome의 설정 - 시스템 - 가능한 경우 그래픽 사용을 켜주세요!</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
