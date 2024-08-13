import React, { useState, useEffect, useRef, FC } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../api/logout';
import Category from './Category'
import Menu from './Menu'
import './NavBar.css';
import './ProfileIcon.css'
import { HttpStatusCode } from 'axios';


const NavBar: FC = () => {
  
  const [navHeight, setNavHeight] = useState<number>(0);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("accessToken") !== null); // 로그인 상태 관리

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
    if (await logout() === HttpStatusCode.Ok) {
      setIsLoggedIn(false);
    }
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

            <div className='center-items'>
            <Category/>
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
