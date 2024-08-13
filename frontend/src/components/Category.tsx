import React from "react";
import { Link } from 'react-router-dom'; // Link 컴포넌트 임포트
import trophy from '../assets/trophy.png'; // trophy 이미지 임포트
import "./Category.css"; // CSS 파일 가져오기

const Category: React.FC = () => {
  return (
    <div className="category-container">
      <div className="category-item">
        <Link to="/" className="category-link game-button">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          GAME
        </Link>
      </div>
      
      <div className="category-item">
        <Link to="/ranking" className="category-link ranking-button">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          RANKING
            <img src={trophy} alt="Trophy" className="trophy-icon" />
        </Link>
      </div>
    </div>
  );
};

export default Category;
