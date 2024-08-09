import React, { useState, useEffect, useRef, FC } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import Category from './Category'
import Menu from './Menu'
import './NavBar.css';
import './ProfileIcon.css'


const NavBar: FC = () => {
  
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
            <Menu/>
          </div>

        </div>
      </div>
     
    </>
  );
};

export default NavBar;
