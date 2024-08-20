import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignUpModal from './SignUpModal';
import './Menu.css';
import './ProfileIcon.css';

interface MenuProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: () => void;
}

const Menu: React.FC<MenuProps> = ({ isLoggedIn, onLogout, onLogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null); // 메뉴 바 요소 참조

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef}>
      <div
        className={`profile-button yellow-profile-button ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
      >
        <a href='#'>
          <i className='fa-solid fa-user'></i>
          <span>My</span>
        </a>
      </div>

      {isOpen && ( // 조건부 렌더링 적용: isOpen이 true일 때만 메뉴바 렌더링
        <ul className={`dropdown-list ${isOpen ? 'opened' : ''}`}>
          {isLoggedIn ? (
            <>
              <Link
                to='/mypage'
                onClick={closeMenu}
              >
                <li style={{ width: '100%' }}>
                  <span
                    className='lnr lnr-mypage'
                    style={{ fontFamily: 'neon-text', fontSize: '18px', textAlign: 'center', width: '100%' }}
                  >
                    MyPage
                  </span>
                  <div className='star-1'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 784.11 815.53'
                    >
                      <path
                        d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                        className='fil0'
                      ></path>
                    </svg>
                  </div>
                  <div className='star-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 784.11 815.53'
                    >
                      <path
                        d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                        className='fil0'
                      ></path>
                    </svg>
                  </div>
                  <div className='star-3'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 784.11 815.53'
                    >
                      <path
                        d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                        className='fil0'
                      ></path>
                    </svg>
                  </div>
                  <div className='star-4'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 784.11 815.53'
                    >
                      <path
                        d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                        className='fil0'
                      ></path>
                    </svg>
                  </div>
                  <div className='star-5'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 784.11 815.53'
                    >
                      <path
                        d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                        className='fil0'
                      ></path>
                    </svg>
                  </div>
                  <div className='star-6'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 784.11 815.53'
                    >
                      <path
                        d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                        className='fil0'
                      ></path>
                    </svg>
                  </div>
                </li>
              </Link>

              <li
                onClick={() => {
                  onLogout();
                  closeMenu();
                }}
              >
                <span
                  className='lnr lnr-exit'
                  style={{ fontFamily: 'neon-text', fontSize: '18px', textAlign: 'center', width: '100%' }}
                >
                  Logout
                </span>
                <div className='star-1'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
                <div className='star-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
                <div className='star-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
                <div className='star-4'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
                <div className='star-5'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
                <div className='star-6'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
              </li>
            </>
          ) : (
            <>
              <li
                onClick={() => {
                  setShowLoginForm(true);
                  closeMenu();
                }}
              >
                <span className='lnr lnr-login'>로그인</span>
                <div className='star-1'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
                <div className='star-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
                <div className='star-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
                <div className='star-4'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
                <div className='star-5'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
                <div className='star-6'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
              </li>

              <li
                onClick={() => {
                  setShowSignUpModal(true);
                  closeMenu();
                }}
              >
                <span className='lnr lnr-signup'>회원가입</span>
                <div className='star-1'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
                <div className='star-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
                <div className='star-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
                <div className='star-4'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
                <div className='star-5'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
                <div className='star-6'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 784.11 815.53'
                  >
                    <path
                      d='M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z'
                      className='fil0'
                    ></path>
                  </svg>
                </div>
              </li>
            </>
          )}
        </ul>
      )}

      {showLoginForm && (
        <LoginForm
          onClose={() => setShowLoginForm(false)}
          onLogin={onLogin}
        />
      )}

      {showSignUpModal && <SignUpModal onClose={() => setShowSignUpModal(false)} />}
    </div>
  );
};

export default Menu;
