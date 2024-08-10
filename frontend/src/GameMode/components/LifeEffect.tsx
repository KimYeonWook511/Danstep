import React from 'react';

interface LifeEffectProps {
  health: number;
}

const LifeEffect: React.FC<LifeEffectProps> = ({ health }) => {
  return (
    <div
      style={{
        width: '50%',
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        color: 'black',
        fontFamily: 'neon-text',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>
          <div
            className='animated-text'
            style={{ fontSize: '80px', textAlign: 'center' }}
          >
            LIFE
          </div>
          <div
            className='animated-text neon-number'
            style={{ fontFamily: 'neon-number', textAlign: 'center' }}
          >
            {health.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeEffect;
