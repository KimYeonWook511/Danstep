import React from "react";
import "./Loading.css"; // CSS 파일 가져오기

const Loader: React.FC = () => {
  return (
    <div className="loading-overlay">
      <div className="ring">
        Loading
        <span className="span-class"></span>
      </div>
    </div>
  );
};

export default Loader;
