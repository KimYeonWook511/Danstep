import React, { useState } from 'react';
import './RemovePoseModal.css';

interface RemovePoseModalProps {
  onClose: () => void;
  onRemove: () => void; // 삭제 시 호출할 콜백
}

const RemovePoseModal: React.FC<RemovePoseModalProps> = ({ onClose, onRemove }) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      onClick={handleBackgroundClick}
    >
      <div className='login-box'>
        <button
          onClick={onClose}
          className='absolute text-white top-7 right-7 hover:text-cyan-400 focus:outline-none'
        >
          <svg
            className='w-6 h-6' // 버튼 크기를 크게 조정
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>

        <div className='flex flex-col items-center w-full'>
          <h2 className='mb-4 text-xl font-bold'>지우시겠습니까?</h2>

          <div className='flex w-full justify-evenly'>
            <button
              type='submit'
              className='w-1/3 py-2 border rounded-md border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black submit-button'
              onClick={onRemove}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              OK
            </button>

            <button
              className='w-1/3 py-2 text-white border border-red-600 rounded-md hover:bg-red-600 hover:text-white cancel-button'
              onClick={onClose}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemovePoseModal;
