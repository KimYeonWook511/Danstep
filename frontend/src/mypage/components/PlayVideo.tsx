// PlayVideo.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import  { jwtDecode,JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
    username: string;
  }
interface VideoData {
  title: string;
  score: number;
  playedDate: string;
}

const PlayVideo: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    // axios 요청으로 데이터를 가져오는 부분

    const accessToken = localStorage.getItem('accessToken');
    const decodedToken = jwtDecode<CustomJwtPayload>(accessToken!);
    const username = decodedToken.username;
    console.log(username);
    setUsername(username);
    axios.get(`https://i11a406.p.ssafy.io/api/results/${username}`,{
      headers: {
          'Authorization': accessToken,
      }
  })  // 서버에서 데이터 받아오는 URL
      .then(response => {
        setVideos(response.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류가 발생했습니다.', error);
      });
  }, []);

  const handleReplayClick = (videoId: number) => {
    // Replay 페이지로 이동, videoId를 URL 파라미터로 전달
    navigate(`/replay/${videoId}`);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
        <p style={{ width: '25%' }}>제목</p>
        <p style={{ width: '25%' }}>점수</p>
        <p style={{ width: '25%' }}>플레이한 날짜</p>
        <p style={{ width: '25%' }}>다시보기</p>
      </div>
      <hr style={{ marginTop: '10px', marginBottom: '20px' }}></hr>
      {/* axios로 받아온 데이터를 map을 사용하여 리스트로 렌더링 */}
      {videos.map((video, index) => (
        <div
          key={index}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            textAlign: 'center',
            marginBottom: '10px',
          }}
        >
          <p style={{ width: '25%' }}>{video.title}</p>
          <p style={{ width: '25%' }}>{video.score}</p>
          <p style={{ width: '25%' }}>{video.playedDate}</p>
          <button
            style={{ width: '25%' }}
            onClick={() => handleReplayClick(index)}  // 클릭 시 handleReplayClick 호출
          >
            다시보기
          </button>
        </div>
      ))}
    </div>
  );
};

export default PlayVideo;
