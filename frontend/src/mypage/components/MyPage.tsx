import React, { useEffect, useState } from 'react';
import PlayVideo from './PlayVideo';
import ModifyProfile from './ModifyProfile';
import LoginForm from '../../components/LoginForm'; // LoginForm 컴포넌트를 임포트
import './MyPage.css';
// import { logout } from '../../api/login';
import { logout } from '../../api/logout';
import  { jwtDecode,JwtPayload } from 'jwt-decode';
import { getUser } from '../utils/mypageAxios';
import { useNavigate } from 'react-router-dom';
import { HttpStatusCode } from 'axios';

interface CustomJwtPayload extends JwtPayload {
  username: string;
}

const Mypage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'video' | 'profile'>('video');
  const [showLogin, setShowLogin] = useState(false);
  const [decodeUsername, setDecodeUsername] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      setDecodeUsername(decodedToken.username);
    } else {
      setShowLogin(true); // 토큰이 없으면 로그인 폼을 표시
    }
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행되도록 함

  const handleLogout = async () => {
    if (await logout() === HttpStatusCode.Ok) {
      // 로그아웃 후 추가적인 동작이 필요한 경우 여기서 처리할 수 있습니다.
      setDecodeUsername(null); // 로그아웃 시 decodeUsername 초기화
      // setShowLogin(true); // 로그아웃 시 로그인 폼을 다시 표시
      navigate("/");
    }
  };

  const handleCloseLoginForm = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      setDecodeUsername(decodedToken.username);
    }
    setShowLogin(false); // 로그인 폼 닫기
    setIsLoggedIn(true);
  };

  const handleTabChange = (tab: 'video' | 'profile') => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setActiveTab(tab);
    } else {
      setShowLogin(true); // 토큰이 없으면 로그인 폼을 표시
    }
  };

  if (showLogin) {
    return <LoginForm onClose={handleCloseLoginForm} onLogin={handleCloseLoginForm} />; // 로그인 폼을 표시하고 onClose prop 전달
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
              style={{
                color: 'black',
                width: '100px',
                height: '100px',
                backgroundColor: 'brown',
                textAlign: 'center',
                alignContent: 'center',
                marginTop: '15%',
                borderRadius: '50%',
              }}
            ></div>
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
              {decodeUsername}
            </div>
          </div>
          <div
            style={{
              height: '50%',
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
                margin: '5px',
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
                margin: '5px',
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
                margin: '5px',
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
          {activeTab === 'video' ? <PlayVideo /> : <ModifyProfile />}
        </div>
      </div>
    </div>
  );
};

export default Mypage;
