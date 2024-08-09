import React from 'react';

interface ComboEffectProps {
  combo: number;
  grade: string;
}

const ComboEffect: React.FC<ComboEffectProps> = ({ combo, grade }) => {
  return (
    <div
      style={{
        width: '50%',
        height: '100%',
        textAlign: 'center',
        alignContent: 'center',
        color: 'black',
        fontFamily: 'neon-text',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <div
            className='animated-text combo'
            style={{ fontSize: '80px' }}
          >
            Combo
          </div>
          <div
            className='animated-text neon-number'
            style={{ fontFamily: 'neon-number' }}
          >
            {combo}
          </div>
        </div>
        <div className='animated-text perfect'>{grade}</div>
      </div>
    </div>
  );
};

export default ComboEffect;
