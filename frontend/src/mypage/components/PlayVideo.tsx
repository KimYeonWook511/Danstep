import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { BsPlayBtn } from 'react-icons/bs';
import './PlayVideo.css';
import RemovePoseModal from './RemovePoseModal';
import api from '../../api/api';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface VideoData {
  title: string;
  score: number;
  resultDate: string;
  resultInfoId: number;
  thumbnailUrl: string;
}

interface PlayVideoProps {
  videos: VideoData[];
  onDelete: (deletedVideoId: number) => void; // 콜백 함수 추가
}

interface CustomJwtPayload extends JwtPayload {
  username: string;
}

const PlayVideo: React.FC<PlayVideoProps> = ({ videos, onDelete }) => {
  const navigate = useNavigate();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const [showRemovePoseModal, setShowRemovePoseModal] = useState(false);

  const formatDate = (dateString: string) => {
    // 연도, 월, 일, 시, 분, 초를 각각 2글자씩 추출
    const year = dateString.slice(2, 4);
    const month = dateString.slice(5, 7);
    const day = dateString.slice(8, 10);
    const hours = dateString.slice(11, 13);
    const minutes = dateString.slice(14, 16);
    // const second = dateString.slice(17, 19);

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const handleReplayClick = (videoId: number) => {
    navigate(`/replay/${videoId}`);
  };

  const handleTrashClick = (index: number) => {
    setSelectedVideoIndex(index);
    setShowRemovePoseModal(true);
  };

  const handleCloseModal = () => {
    setShowRemovePoseModal(false);
    setSelectedVideoIndex(null);
  };

  const handleRemove = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const decodedToken = jwtDecode<CustomJwtPayload>(accessToken!);
    if (selectedVideoIndex !== null) {
      const videoToDelete = videos[selectedVideoIndex];
      try {
        await api.delete(`results/${decodedToken.username}/replay/${videoToDelete.resultInfoId}`, {
          headers: {
            Authorization: accessToken,
          },
        });
        // 부모 컴포넌트로 삭제된 비디오의 ID를 전달
        onDelete(videoToDelete.resultInfoId);

        setSelectedVideoIndex(null);
        setShowRemovePoseModal(false);
      } catch (error) {}
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', color: 'black' }}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          textAlign: 'center',
          color: 'white',
          fontSize: '20px',
        }}
      >
        <p style={{ width: '15%', fontFamily: 'neon-text', fontSize: '22px', color: 'white' }}>Game</p>
        <p style={{ width: '30%', fontFamily: 'neon-text', fontSize: '22px', color: 'white' }}>Score</p>
        <p style={{ width: '30%', fontFamily: 'neon-text', fontSize: '22px', color: 'white' }}>date</p>
        <p style={{ width: '25%' }}></p>
      </div>
      <hr style={{ marginTop: '10px', marginBottom: '20px' }}></hr>
      {videos.map((video, index) => (
        <div
          key={index}
          style={{
            width: '100%',
            height: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            textAlign: 'center',
            marginBottom: '10px',
            marginTop: '10px',
            color: 'white',
            fontSize: '18px',
            alignItems: 'center',
          }}
          className='map-hover'
        >
          <p
            style={{
              width: '15%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              widows: '100%',
              height: 'auto',
              borderRadius: '20px',
            }}
          >
            <img
              src={video.thumbnailUrl}
              title={video.title}
            />
          </p>
          <p style={{ width: '30%' }}>{(video.score / 100).toFixed(2)}</p>
          <p style={{ width: '30%' }}>{formatDate(video.resultDate)}</p>
          <div
            style={{
              width: '25%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <button>
              <BsPlayBtn
                className='replay-icon'
                style={{ marginRight: '40px', textAlign: 'center' }}
                onClick={() => handleReplayClick(video.resultInfoId)}
              />
            </button>
            <button onClick={() => handleTrashClick(index)}>
              <FaTrash
                className={`trash-icon ${hoveredIndex === index ? 'hover' : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </button>
          </div>
        </div>
      ))}

      {showRemovePoseModal && (
        <RemovePoseModal
          onClose={handleCloseModal}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
};

export default PlayVideo;
