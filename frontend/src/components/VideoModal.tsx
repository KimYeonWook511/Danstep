// src/components/VideoModal.tsx
import React from 'react';
import './VideoModal.css'; // 스타일 파일

interface VideoModalProps {
  videoUrl: string;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, onClose }) => {
  return (
    <div className="video-modal">
      <div className="video-modal-content">
        <button className="video-modal-close" onClick={onClose}>X</button>
        <video src={videoUrl} controls autoPlay />
      </div>
    </div>
  );
};

export default VideoModal;
