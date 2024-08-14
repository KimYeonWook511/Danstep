import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import './PlayVideo.css';

interface VideoData {
  title: string;
  score: number;
  resultDate: string;
  resultInfoId: number;
}

interface PlayVideoProps {
  videos: VideoData[];
}

const PlayVideo: React.FC<PlayVideoProps> = ({ videos }) => {
  const navigate = useNavigate();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const handleReplayClick = (videoId: number) => {
    navigate(`/replay/${videoId}`);
  };

  const handleTrashClick = (index: number) => {
    alert(`나와라 좌표 : ${index}`);
  };

  return (
    <div style={{ width: '100%', height: '100%', color: 'black' }}>
      <div
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', textAlign: 'center', color: 'black' }}
      >
        <p style={{ width: '25%' }}>제목</p>
        <p style={{ width: '25%' }}>점수</p>
        <p style={{ width: '25%' }}>플레이한 날짜</p>
        <p style={{ width: '25%' }}></p>
      </div>
      <hr style={{ marginTop: '10px', marginBottom: '20px' }}></hr>
      {videos.map((video, index) => (
        <div
          key={index}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            textAlign: 'center',
            alignItems: 'center',
            marginBottom: '10px',
            color: 'black',
          }}
        >
          <p style={{ width: '25%' }}>{video.title}</p>
          <p style={{ width: '25%' }}>{video.score}</p>
          <p style={{ width: '25%' }}>{formatDate(video.resultDate)}</p>
          <div
            style={{ width: '25%', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <button
              style={{ color: 'black', marginRight: '40px', textAlign: 'center' }}
              onClick={() => handleReplayClick(video.resultInfoId)}
            >
              다시보기
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
    </div>
  );
};

export default PlayVideo;
