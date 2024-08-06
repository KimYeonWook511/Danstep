import React, { useState, useEffect, useRef } from 'react';
import styles from './NeonCircle.module.css';

const NeonCircle: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isBursting, setIsBursting] = useState(false);
  const requestRef = useRef<number>();

  const handleMouseMove = (event: MouseEvent) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  const handleClick = () => {
    setIsBursting(true);
    setTimeout(() => {
      setIsBursting(false);
    }, 300); // 애니메이션 지속 시간에 맞춰서 복원
  };

  const animate = () => {
    requestRef.current = requestAnimationFrame(animate);
    const circle = document.querySelector(`.${styles.neonCircle}`) as HTMLElement;
    if (circle) {
      circle.style.left = `${position.x}px`;
      circle.style.top = `${position.y}px`;
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(requestRef.current!);
    };
  }, [position]);

  return <div className={`${styles.neonCircle} ${isBursting ? styles.burst : ''}`} />;
};

export default NeonCircle;
