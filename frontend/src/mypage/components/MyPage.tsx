import React, { useEffect, useState } from 'react';
import PlayVideo from './PlayVideo';
import ModifyProfile from './ModifyProfile';
import LoginForm from '../../components/LoginForm';
import './MyPage.css';
import { logout } from '../../api/logout';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { HttpStatusCode } from 'axios';
import api from "../../api/api";
import { useNavigate } from 'react-router-dom';

interface CustomJwtPayload extends JwtPayload {
  username: string;
  nickname: string;
}

interface VideoData {
  title: string;
  score: number;
  resultDate: string;
  resultInfoId: number;
  nickname: string;
}

const Mypage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'video' | 'profile'>('video');
  const [showLogin, setShowLogin] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);

  const fetchData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const decodedToken = jwtDecode<CustomJwtPayload>(accessToken);
      setNickname(decodedToken.nickname);
      try {
        const response = await api.get(`/results/${decodedToken.username}`, {
          headers: {
            Authorization: accessToken,
          },
        });
        console.log("MyPage.tsx api: ", response);
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    } else {
      setShowLogin(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    if (await logout() === HttpStatusCode.Ok) {
      // 로그아웃 후 추가적인 동작이 필요한 경우 여기서 처리할 수 있습니다.
      setNickname(null);
      // setShowLogin(true); // 로그아웃 시 로그인 폼을 다시 표시
      navigate("/");
    }
  };

  const handleCloseLoginForm = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setShowLogin(false);
      fetchData(); // 로그인 후 비디오 데이터를 다시 가져옵니다.
    }
  };

  const handleTabChange = (tab: 'video' | 'profile') => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setActiveTab(tab);
    } else {
      setShowLogin(true);
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  if (showLogin) {
    return <LoginForm onClose={handleCloseLoginForm} onLogin={handleCloseLoginForm} />;
  }

  return (
    <div style={{ display: 'flex', width: '1200px', height: '600px' }}>
      <div
        className='red-neon red'
        style={{
          display: 'flex',
          width: '90%',
          height: '90%',
          backgroundColor: 'black',
          padding: '50px',
          margin: '50px',
          borderRadius: '5%',
          borderWidth: '1px',
          borderColor: 'black',
          border: 'none',
        }}
      >
        {/* 마이페이지 좌측 nav */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '30%',
            height: '100%',
            marginRight: '10px',
            margin: 'auto',
          }}
        >
          <div
            style={{
              height: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: 'auto',
            }}
          >
            <div
              className='red-neon animated-text red'
              style={{
                fontFamily: 'neon-number',
                color: 'yellow',
                height: '10%',
                marginTop: '5%',
                alignContent: 'center',
                fontSize: '50px',
              }}
            >
              {nickname}
            </div>
          </div>
          <div
            style={{
              height: '70%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: '5%',
              paddingBottom: '5%',
              color: 'white',
            }}
          >
            <button
              style={{
                color: 'white',
                height: '50%',
                width: '50%',
                textAlign: 'center',
                alignContent: 'center',
                margin: '10px',
                padding: '10px',
                backgroundColor: 'black',
                border: '1px solid white',
                borderRadius: '5px',
              }}
              onClick={() => handleTabChange('video')}
            >
              플레이 영상
            </button>
            <button
              style={{
                color: 'white',
                height: '50%',
                width: '50%',
                textAlign: 'center',
                alignContent: 'center',
                margin: '10px',
                padding: '10px',
                backgroundColor: 'black',
                border: '1px solid white',
                borderRadius: '5px',
              }}
              onClick={() => handleTabChange('profile')}
            >
              프로필 수정
            </button>
            <button
              style={{
                color: 'white',
                height: '50%',
                width: '50%',
                textAlign: 'center',
                alignContent: 'center',
                margin: '10px',
                padding: '10px',
                backgroundColor: 'black',
                border: '1px solid white',
                borderRadius: '5px',
              }}
              onClick={handleBackClick}
            >
              메인페이지로 이동
            </button>
            <button
              style={{
                color: 'white',
                height: '50%',
                width: '50%',
                textAlign: 'center',
                alignContent: 'center',
                margin: '10px',
                padding: '10px',
                backgroundColor: 'black',
                border: '1px solid white',
                borderRadius: '5px',
              }}
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        </div>

        <div
          className='white-neon'
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '70%',
            height: '100%',
            marginLeft: '30px',
            padding: '30px',
            borderRadius: '5%',
            backgroundColor: 'white',
            overflow: 'auto',
            scrollbarWidth: '-moz-initial',
            flexWrap: 'wrap',
          }}
        >
          {activeTab === 'video' ? <PlayVideo videos={videos} /> : <ModifyProfile />}
        </div>
      </div>
    </div>
  );
};

export default Mypage;
