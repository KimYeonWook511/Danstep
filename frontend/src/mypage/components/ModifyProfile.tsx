import React, { useState } from 'react';
import { modifyProfile } from '../utils/mypageAxios';
import  { jwtDecode, JwtPayload } from 'jwt-decode';

interface ModifyProfileProps {
  onNicknameChange: (newNickname: string) => void;
}

interface CustomJwtPayload extends JwtPayload {
  nickname: string;
}

const ModifyProfile: React.FC<ModifyProfileProps> = ({ onNicknameChange }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);

  const validateNickname = (nickname: string) => {
    const nicknameRegex = /^[a-zA-Z0-9]{2,6}$/;
    if (!nicknameRegex.test(nickname)) {
      setNicknameError("2~6자 이내 영문자 및 숫자만 가능합니다.");
      return false;
    }
    setNicknameError(null);
    return true;
  };

  const validateNewPassword = (password: string) => {
    if (!password) {
      setNewPasswordError(null); // 비밀번호가 없는 경우 에러를 초기화합니다.
      return true;
    }
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+=[\]{};':"\\|,.<>/?`~]{8,20}$/;
    if (!passwordRegex.test(password)) {
      setNewPasswordError("8자 이상 20자 이하 영문자, 숫자, 특수문자만 가능합니다.");
      return false;
    }
    setNewPasswordError(null);
    return true;
  };

  const containsKorean = (text: string) => {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return koreanRegex.test(text);
  };

  const handleModifyProfile = async () => {
    const isNicknameValid = validateNickname(nickname);
    const isNewPasswordValid = validateNewPassword(newPassword);

    if (!isNicknameValid || !isNewPasswordValid) {
      return;
    }

    const response = await modifyProfile({ currentPassword, newPassword, nickname });

    if (response.status === 200) {
      setSuccess('수정이 완료되었습니다.');
      localStorage.setItem("accessToken", response.headers.authorization);
      const decodedToken = jwtDecode<CustomJwtPayload>(response.headers.authorization!);
      onNicknameChange(decodedToken.nickname);
    } else if (response.data.errorCode === '4000') {
      setError('아이디 입력 형식이 어긋났습니다.');
    } else if (response.data.errorCode === '4001') {
      setError('닉네임 입력 형식이 어긋났습니다.');
    } else if (response.data.errorCode === '4002') {
      setError('비밀번호 입력 형식이 어긋났습니다.');
    } else if (response.data.errorCode === '4003') {
      setError('아이디가 중복되었습니다.');
    } else if (response.data.errorCode === '4004') {
      setError('닉네임이 중복되었습니다.');
    } else if (response.data.errorCode === '4005') {
      setError('현재 비밀번호가 불일치합니다.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'black' }}>
      <h2 style={{ color: 'white', fontSize: '30px', marginBottom: '30px' }}>프로필 수정</h2>
      <div style={{ margin: '20px 0' }}>
        <input
          className='input-box'
          type="text"
          placeholder="닉네임 수정"
          value={nickname}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (!containsKorean(inputValue)) {
              setNickname(inputValue);
              validateNickname(inputValue);
            }
            else{
              setNicknameError("한국어가 입력되었습니다. 영문자, 숫자만 가능합니다.");
            }
          }}
          style={{ padding: '10px', width: '60%', marginBottom: '10px' }}
        />
        {nicknameError && <div className="mt-1 text-red-500 text-sm">{nicknameError}</div>}
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
          onChange={(e) => {
            const inputValue = e.target.value;
            if (!containsKorean(inputValue)) {
              setNewPassword(inputValue);
              validateNewPassword(inputValue);
            }
          }}
          style={{ padding: '10px', width: '60%', marginBottom: '10px' }}
        />
        {newPasswordError && <div className="mt-1 text-red-500 text-sm">{newPasswordError}</div>}
      </div>
      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
      {success && <div className="mt-2 text-green-500 text-sm">{success}</div>}
      <button
        className='modify-button'
        style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer', color: 'white', fontSize: '20px' }}
        onClick={handleModifyProfile}
      >
        수정 완료
      </button>
    </div>
  );
};

export default ModifyProfile;
