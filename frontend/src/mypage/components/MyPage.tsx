import React, { useEffect, useState } from 'react';
import PlayVideo from './PlayVideo';
import ModifyProfile from './ModifyProfile';
import LoginForm from '../../components/LoginForm';
import './MyPage.css';
import { logout } from '../../api/logout';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { HttpStatusCode } from 'axios';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import mainBackGround from '../../assets/main_background.mp4';

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
  thumbnailUrl: string;
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
        setVideos(response.data);
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          setShowLogin(true); // 에러가 400일 때 로그인 화면 표시
        }
      }
    } else {
      setShowLogin(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    if ((await logout()) === HttpStatusCode.Ok) {
      setNickname(null);
    }
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('hasSeenModal');
    navigate('/');
  };

  const handleCloseLoginForm = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setShowLogin(false);
      fetchData(); // 로그인 후 비디오 데이터를 다시 가져옵니다.
    } else {
      navigate('/');
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

  const handleNicknameChange = (newNickname: string) => {
    setNickname(newNickname);
  };

  const handleVideoDelete = (deletedVideoId: number) => {
    setVideos((prevVideos) => prevVideos.filter((video) => video.resultInfoId !== deletedVideoId));
  };

  if (showLogin) {
    return (
      <LoginForm
        onClose={handleCloseLoginForm}
        onLogin={handleCloseLoginForm}
      />
    );
  }

  return (
    <div style={{ display: 'flex', width: '1200px', height: '600px', textAlign: 'center' }}>
      <NavBar />
      <video
        autoPlay
        loop
        muted
        className='background-video'
      >
        <source
          src={mainBackGround}
          type='video/mp4'
        />
      </video>

      <div
        className='neon-border'
        style={{
          display: 'flex',
          width: '100%',
          height: '90%',
          backgroundColor: 'black',
          paddingTop: '50px',
          paddingBottom: '50px',
          paddingRight: '50px',
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
                height: '100%',
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
                fontFamily: 'neon-text',
                fontSize: '25px',
              }}
              onClick={() => handleTabChange('video')}
              className='grow-button'
            >
              replay
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
                fontFamily: 'neon-text',
                fontSize: '25px',
              }}
              onClick={() => handleTabChange('profile')}
              className='grow-button'
            >
              edit info
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
                fontFamily: 'neon-text',
                fontSize: '25px',
              }}
              onClick={handleBackClick}
              className='grow-button'
            >
              Go back
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
                fontFamily: 'neon-text',
                fontSize: '25px',
              }}
              className='grow-button'
              onClick={handleLogout}
            >
              logout
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
            padding: '20px',
            borderRadius: '5%',
            color: 'white',
            overflow: 'auto',
            scrollbarWidth: '-moz-initial',
            flexWrap: 'wrap',
          }}
        >
          {activeTab === 'video' ? (
            <PlayVideo
              videos={videos}
              onDelete={handleVideoDelete}
            />
          ) : (
            <ModifyProfile onNicknameChange={handleNicknameChange} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Mypage;
