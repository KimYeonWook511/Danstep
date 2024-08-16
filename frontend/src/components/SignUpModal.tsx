import React, { useState } from 'react';
import { signUp } from '../api/auth';
import './SignUpModal.css';

interface SignUpModalProps {
  onClose: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ onClose }) => {
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const validateNickname = (nickname: string) => {
    const nicknameRegex = /^[a-zA-Z0-9]{2,6}$/;
    if (!nicknameRegex.test(nickname)) {
      setNicknameError("2~6자 이내 영문자 및 숫자만 가능합니다.");
      return false;
    }
    setNicknameError(null);
    return true;
  };

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!usernameRegex.test(username)) {
      setUsernameError("4~20자 이내 영문자 및 숫자만 가능합니다.");
      return false;
    }
    setUsernameError(null);
    return true;
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+=[\]{};':"\\|,.<>/?`~]{8,20}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError("8자 이상 20자 이하 영문자, 숫자, 특수문자만 가능합니다.");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    setConfirmPasswordError(null);
    return true;
  };

  const containsKorean = (text: string) => {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return koreanRegex.test(text);
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); 
    }
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // 에러 초기화
    setSuccess(null); // 성공 메시지 초기화

    const isNicknameValid = validateNickname(nickname);
    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);

    if (!isNicknameValid || !isUsernameValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    try {
      const response = await signUp({ nickname, username, password });
      setNickname('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      onClose();
    } catch (error:any) {
      const errorcode = error.response.data.errorCode;
      if(errorcode === '4000')
      {
      setError('아이디 입력 형식이 어긋났습니다.');
      }
      else if(errorcode==='4001'){
        setError('닉네임 입력 형식이 어긋났습니다.');
      }
      else if(errorcode==='4002'){
        setError('비밀번호 입력 형식이 어긋났습니다.');
      }
      else if(errorcode==='4003'){
        setError('아이디가 중복되었습니다.');
      }
      else if(errorcode==='4004'){
        setError('닉네임이 중복되었습니다.');
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}
    >
      <div className='signup-box'>
        <button
          onClick={onClose}
          className="absolute top-7 right-7 text-white hover:text-cyan-400 focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <form className="flex flex-col items-center w-full" onSubmit={handleSignUp}>
          <h2 className="text-xl font-semibold mb-4">회원가입</h2>

          <div className="user-box w-full">
            <input
              type="text"
              id="username"
              placeholder="아이디"
              value={username}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (!containsKorean(inputValue)) {
                  setUsername(inputValue);
                  validateUsername(inputValue);
                }
                else{
                  setUsernameError("한국어가 입력되었습니다. 영문자, 숫자만 가능합니다.")
                }
              }}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            {usernameError && <div className="mt-1 text-red-500 text-sm">{usernameError}</div>}
          </div>

          <div className="user-box w-full">
            <input
              type="password"
              id="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (!containsKorean(inputValue)) {
                  setPassword(inputValue);
                  validatePassword(inputValue);
                }
              }}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            {passwordError && <div className="mt-1 text-red-500 text-sm">{passwordError}</div>}
          </div>

          <div className="user-box w-full">
            <input
              type="password"
              id="confirm-password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (!containsKorean(inputValue)) {
                  setConfirmPassword(inputValue);
                  validateConfirmPassword(password, inputValue);
                }
              }}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            {confirmPasswordError && <div className="mt-1 text-red-500 text-sm">{confirmPasswordError}</div>}
          </div>

          <div className="user-box w-full">
            <input
              type="text"
              id="nickname"
              placeholder="닉네임"
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
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
            {nicknameError && <div className="mt-1 text-red-500 text-sm">{nicknameError}</div>}
          </div>

          {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

          <div className="submit-button w-full">
            <button type="submit" className="w-full py-2 rounded-md border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;
