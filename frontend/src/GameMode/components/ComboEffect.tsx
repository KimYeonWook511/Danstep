import React from 'react';

interface ComboEffectProps {
  combo: number;
  grade: string;
}

const ComboEffect: React.FC<ComboEffectProps> = ({ combo, grade }) => {
  const getGradeColor = (grade: string) => {
    const lowerGrade = grade.toLowerCase();

    if (lowerGrade === 'perfect') {
      return { color: 'gold', rgb: '255, 215, 0' }; // 금색
    } else if (lowerGrade === 'great') {
      return { color: 'blue', rgb: '0, 0, 255' }; // 파랑색
    } else if (lowerGrade === 'good') {
      return { color: 'green', rgb: '0, 128, 0' }; // 초록색
    } else if (lowerGrade === 'bad') {
      return { color: 'red', rgb: '255, 0, 0' }; // 빨간색
    }
  };

  const gradeColor = getGradeColor(grade);

  return (
    <div
      style={{
        width: '100%', // 부모 요소 전체를 사용
        height: '100%',
        display: 'flex', // Flexbox 사용
        justifyContent: 'center', // 수평 중앙 정렬
        alignItems: 'center', // 수직 중앙 정렬
        color: 'black',
        fontFamily: 'neon-text',
        flexDirection: 'column', // 수직 정렬
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div
          className='animated-text grade-now'
          style={
            {
              textAlign: 'center',
              fontSize: '80px',
              '--neon-color': gradeColor?.color,
              '--neon-color-rgb': gradeColor?.rgb,
            } as React.CSSProperties
          }
        >
          {grade}
        </div>
      </div>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          className='animated-text combo'
          style={{ fontSize: '60px', textAlign: 'center' }}
        >
          Combo
        </div>
        <div
          className='animated-text neon-number'
          style={{ fontFamily: 'neon-number', textAlign: 'center', fontSize: '100px' }}
        >
          {combo}
        </div>
      </div>
    </div>
  );
};

export default ComboEffect;
