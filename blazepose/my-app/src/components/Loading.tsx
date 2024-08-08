import React from "react";
import "./Loading.css"; // CSS 파일 가져오기

const Loader : React.FC = () => {
  return (
    <div className="ring">
      Loading
      <span></span>
    </div>
  );
};

export default Loader;
