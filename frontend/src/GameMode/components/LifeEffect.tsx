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
        textAlign: 'center',
        alignContent: 'center',
        color: 'black',
        fontFamily: 'neon-text',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <div
            className='animated-text red'
            style={{ fontSize: '80px' }}
          >
            LIFE
          </div>
          <div
            className='animated-text neon-number'
            style={{ fontFamily: 'neon-number' }}
          >
            {health.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeEffect;
