import React, { useState, useEffect, useRef, FC } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import trophy from '../assets/trophy.png';
import LoginForm from './LoginForm';
import SignUpModal from './SignUpModal';

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
    <div
      ref={navRef}
      className={`fixed top-0 w-full bg-purple-400 shadow-sm transition-all duration-300 z-50`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-12 w-auto" src={logo} alt="Logo" />
            </div>
            <div className={`ml-4 text-white text-lg font-semibold`}>
              DanStep
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center">
            <div className={`flex space-x-4 mb-2 transition-all duration-300`}>
              <Link to="/" className="text-white">Game</Link>
              <div className="text-white">|</div>
              <Link to="/ranking" className="text-white flex items-center">
                <span>Ranking</span>
                <img src={trophy} alt="Trophy" className="h-6 w-6 ml-1" />
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => setShowLoginForm(!showLoginForm)} className="text-white">로그인</button>
            <button onClick={() => setShowSignUpModal(true)} className="text-white">회원가입</button>
            <button className="bg-white p-2 rounded-full text-gray-400 hover:text-gray-500">
              <span className="sr-only">User Profile</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0a10 10 0 100 20A10 10 0 1010 0zM5 15a6 6 0 0110 0H5zm5-9a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {showLoginForm && <LoginForm />}
      {showSignUpModal && <SignUpModal onClose={() => setShowSignUpModal(false)} />}
    </div>
  );
};

export default NavBar;
