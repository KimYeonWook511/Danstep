import React, { useState } from 'react';
import { login } from '../api/login';
import './LoginForm.css'

interface LoginFormProps {
  onClose: () => void;
  onLogin: () => void;  // 로그인 성공 시 호출할 콜백
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const containsKorean = (text: string) => {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return koreanRegex.test(text);
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); 
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // 에러 초기화

    try {
      await login({ username, password });
      // 로그인 성공 후 필요한 로직 (예: 페이지 리다이렉트)
      onLogin();
      onClose();
    } catch (err) {
      setPassword('');
      setError('로그인에 실패하였습니다. 아이디와 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleBackgroundClick}
    >
      <div className='login-box'>
        <button
          onClick={onClose}
          className="absolute top-7 right-7 text-white hover:text-cyan-400 focus:outline-none"
        >
          <svg
            className="h-6 w-6" // 버튼 크기를 크게 조정
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

        <form className="flex flex-col items-center w-full" onSubmit={handleLogin}>
          <h2 className="text-xl font-semibold mb-4">로그인</h2>
          <div className='user-box w-full'>
            <input
              type="text"
              id="username"
              placeholder="아이디"
              value={username}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (!containsKorean(inputValue)) {
                  setUsername(inputValue);
                }
                else{
                  setUsernameError("한국어가 입력되었습니다. 영문자, 숫자만 가능합니다.");
                }
              }}
              className='block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </div>
          {usernameError && <div className="mb-2 text-red-500 text-sm">{usernameError}</div>}
          <div className='user-box w-full'>
            <input
              type="password"
              id="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (!containsKorean(inputValue)) {
                  setPassword(inputValue);
                }
              }}
              className='block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </div>

          {error && <div className="mb-2 text-red-500 text-sm">{error}</div>}

          <div className='submit-button w-full'>
            <button type="submit" className="w-full py-2 rounded-md border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
