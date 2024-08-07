import React, { useState, useEffect, useRef, FC } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import trophy from '../assets/trophy.png';
import LoginForm from './LoginForm';
import SignUpModal from './SignUpModal';
import './NavBar.css';  // 스타일을 위한 CSS 파일을 임포트합니다.
import Category from './Category'

const NavBar: FC = () => {
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);
  const [navHeight, setNavHeight] = useState<number>(0);

  const navRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <>
      <div
        ref={navRef}
        className="nav-bar"
      >
        <div className="nav-content">
          <div className="left-items">
            <img className="h-12 w-auto logo" src={logo} alt="Logo" />
            <div className="brand-name">DanStep</div>
          </div>

          {/* <div className="center-items">
            <div className="nav-links">
              <Link to="/" className="nav-link">Game</Link>
              <span className="separator">|</span>
              <Link to="/ranking" className="nav-link flex items-center">
                <span>Ranking</span>
                <img src={trophy} alt="Trophy" className="trophy-icon" />
              </Link>
            </div>
          </div> */}

            <div className='center-items'>
            <Category/>
            </div>

          <div className="right-items">
            <button onClick={() => setShowLoginForm(!showLoginForm)} className="nav-button">로그인</button>
            <button onClick={() => setShowSignUpModal(true)} className="nav-button">회원가입</button>
            <button className="profile-button">
              <span className="sr-only">User Profile</span>
              <svg className="profile-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0a10 10 0 100 20A10 10 0 1010 0zM5 15a6 6 0 0110 0H5zm5-9a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {showLoginForm && <LoginForm />}
      {showSignUpModal && <SignUpModal onClose={() => setShowSignUpModal(false)} />}
    </>
  );
};

export default NavBar;
