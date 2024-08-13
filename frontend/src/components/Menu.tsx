import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignUpModal from './SignUpModal';
import './Menu.css';
import './ProfileIcon.css'

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
      <div className={`profile-button yellow-profile-button ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
      <a href="#">
          <i className="fa-solid fa-user"></i>
          <span>My</span>
        </a>
      </div>

      {isOpen && ( // 조건부 렌더링 적용: isOpen이 true일 때만 메뉴바 렌더링
        <ul className={`dropdown-list ${isOpen ? 'opened' : ''}`}>
          {isLoggedIn ? (
            <>
              <Link to="/mypage" onClick={closeMenu}>
                <li>
                  <span className="lnr lnr-mypage"></span> 마이페이지
                </li>
              </Link>

              <li
                onClick={() => {
                  onLogout();
                  closeMenu();
                }}
              >
                <span className="lnr lnr-exit"></span> 로그아웃
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
                <span className="lnr lnr-login"></span> 로그인
              </li>

              <li
                onClick={() => {
                  setShowSignUpModal(true);
                  closeMenu(); 
                }}
              >
                <span className="lnr lnr-signup"></span> 회원가입
              </li>
            </>
          )}
        </ul>
      )}

      {showLoginForm && (
        <LoginForm onClose={() => setShowLoginForm(false)} onLogin={onLogin} />
      )}

      {showSignUpModal && (
        <SignUpModal onClose={() => setShowSignUpModal(false)} />
      )}
    </div>
  );
};

export default Menu;
