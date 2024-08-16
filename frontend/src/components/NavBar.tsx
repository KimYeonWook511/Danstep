import { useState, useEffect, useRef, FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Menu from './Menu'
import './NavBar.css';
import './ProfileIcon.css'
import { logout } from '../api/logout';
import { HttpStatusCode } from 'axios';


const NavBar: FC = () => {
  
  const [navHeight, setNavHeight] = useState<number>(0);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("accessToken") !== null); // 로그인 상태 관리
  const navigate = useNavigate();
  useEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.clientHeight);
      }
    };

    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);

    return () => {
      window.removeEventListener('resize', updateNavHeight);
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // 로그인 성공 시 상태 업데이트
  };

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("hasSeenModal");
    navigate("/");
  };

  return (
    <>
      <div ref={navRef} className="nav-bar">
        <div className="nav-content">
          <div className="left-items">
          <Link to="/" className="logo-link">
              <div className="logo">DanStep</div>
            </Link>
          </div>

          <div className="right-item">
          <Menu isLoggedIn={isLoggedIn} onLogout={handleLogout} onLogin={handleLoginSuccess} />
          </div>

        </div>
      </div>
     
    </>
  );
};

export default NavBar;
