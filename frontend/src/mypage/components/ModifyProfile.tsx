// ModifyProfile.tsx
import React, { useState } from 'react';
import { modifyProfile } from '../utils/mypageAxios';

const ModifyProfile: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
//   const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');

  const handleModifyProfile = async () => {
    await modifyProfile({ currentPassword, newPassword, nickname });
    // 수정 후 추가적인 동작이 필요한 경우 여기서 처리할 수 있습니다.
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center',color:'black' }}>
      <h2 style={{color:'white',fontSize:'30px', marginBottom:'30px'}}>프로필 수정</h2>
      <div style={{ margin: '20px 0' }}>
        <input
          className='input-box'
          type="text"
          placeholder="닉네임 수정"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{ padding: '10px', width: '60%', marginBottom: '10px' }}
        />
      </div>
      <div style={{ margin: '20px 0' }}>
        <input
          className='input-box'
          type="password"
          placeholder="현재 비밀번호"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={{ padding: '10px', width: '60%', marginBottom: '10px' }}
        />
      </div>
      <div style={{ margin: '20px 0' }}>
        <input
          className='input-box'
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ padding: '10px', width: '60%', marginBottom: '10px' }}
        />
      </div>
      <button
        className='modify-button'
        style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer',color:'white',fontSize:'20px' }}
        onClick={handleModifyProfile}
      >
        수정 완료
      </button>
    </div>
  );
};

export default ModifyProfile;
